import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { getMediumById, getSubgenreById } from './src/lib/comedyCatalog.ts';
import type {
  CharacterProfile,
  ComedyPlot,
  PlotGenerationRequest,
  RerollElementRequest,
  RunningGag,
  StoryBeat,
} from './src/types/plot.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const MODEL_NAME = 'gemini-4-hydrogen';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add it in Settings > Secrets to use Writer’s Room AI.',
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatApiError(err: unknown): { status: number; message: string } {
  const rawMessage = err instanceof Error ? err.message : 'Unexpected server error.';
  if (rawMessage.includes('GEMINI_API_KEY')) {
    return { status: 503, message: rawMessage };
  }
  if (rawMessage.includes('403') || rawMessage.includes('PERMISSION_DENIED')) {
    return {
      status: 403,
      message: 'Gemini API permission denied. Please verify your API key in Settings > Secrets.',
    };
  }
  if (rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message: 'Rate limit or quota reached on the Gemini API. Please retry shortly.',
    };
  }
  return { status: 500, message: rawMessage };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/generate-plot', async (req, res) => {
    try {
      const body = req.body as PlotGenerationRequest;
      const characterCount = Math.min(6, Math.max(1, Number(body.characterCount) || 3));
      const mediumDef = getMediumById(body.medium);
      const primarySub = getSubgenreById(body.subgenre);
      const secondarySub =
        body.secondarySubgenre && body.secondarySubgenre !== 'none'
          ? getSubgenreById(body.secondarySubgenre)
          : null;

      const existing = body.existingPlot;
      const lockedConstraints: string[] = [];

      if (existing?.titleLocked) {
        lockedConstraints.push(
          `LOCKED TITLE & LOGLINE: Title="${existing.title}", Logline="${existing.logline}", ComedicEngine="${existing.comedicEngine}". Keep these intact and build around them.`,
        );
      }
      if (existing?.settingLocked) {
        lockedConstraints.push(
          `LOCKED SETTING: "${existing.setting}". Keep this exact setting.`,
        );
      }
      if (existing?.characters?.length) {
        existing.characters.slice(0, characterCount).forEach((char, idx) => {
          if (char.locked) {
            lockedConstraints.push(
              `LOCKED CHARACTER #${idx + 1}: Name="${char.name}", Archetype="${char.archetype}", ComedicFlaw="${char.comedicFlaw}", SecretGoal="${char.secretGoal}". Preserve this character at slot ${idx + 1}.`,
            );
          }
        });
      }
      if (existing?.beats?.length && existing.medium === body.medium) {
        existing.beats.forEach((beat, idx) => {
          if (beat.locked) {
            lockedConstraints.push(
              `LOCKED BEAT #${idx + 1} (${beat.label}): Summary="${beat.summary}", Escalation="${beat.comedicEscalation}". Preserve this beat and weave surrounding unlocked beats into it seamlessly.`,
            );
          }
        });
      }
      if (existing?.runningGags?.length) {
        existing.runningGags.forEach((gag, idx) => {
          if (gag.locked) {
            lockedConstraints.push(
              `LOCKED RUNNING GAG #${idx + 1}: Setup="${gag.setup}", Payoff="${gag.payoff}". Keep this gag.`,
            );
          }
        });
      }

      const beatPlan = mediumDef.beatTemplates
        .map((b, i) => `${i + 1}. ${b.label} (${b.defaultCue}) — ${b.guidance}`)
        .join('\n');

      const prompt = [
        `Generate an original, sharply written comedy plot tailored to the following writer specifications:`,
        `- Medium: ${mediumDef.name} (${mediumDef.formatNote})`,
        `- Primary Comedic Subgenre: ${primarySub.name} (${primarySub.coreMechanism} Tone: ${primarySub.toneCue})`,
        secondarySub
          ? `- Secondary Subgenre Blend: ${secondarySub.name} (${secondarySub.coreMechanism})`
          : '- Secondary Subgenre Blend: None',
        `- Exact Number of Characters: ${characterCount}`,
        body.premiseSeed?.trim()
          ? `- Writer's Premise Seed / Constraint: "${body.premiseSeed.trim()}"`
          : '- Writer’s Premise Seed: Invent a fresh, delightfully absurd comedic predicament.',
        '',
        `Required Beat Structure (${mediumDef.beatTemplates.length} beats):`,
        beatPlan,
        '',
        lockedConstraints.length > 0
          ? `IMPORTANT LOCKED ELEMENTS FROM PREVIOUS DRAFT (you MUST respect and preserve these verbatim while inventing fresh unlocked parts around them):\n${lockedConstraints.join('\n')}`
          : 'All elements are unlocked—invent everything fresh.',
        '',
        `Requirements:`,
        `1. Return EXACTLY ${characterCount} distinct, funny characters with memorable names, clear comedic flaws, and conflicting secret goals.`,
        `2. Return EXACTLY ${mediumDef.beatTemplates.length} beats matching the medium's structure above, referencing the characters by name and tailored specifically to ${mediumDef.name} conventions.`,
        `3. Return EXACTLY 3 clever running gags with explicit setup and climax payoff.`,
        `4. Keep jokes crisp, grounded in character flaws, and genuinely funny rather than generic clichés.`,
      ].join('\n');

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction:
            'You are a veteran comedy showrunner and story editor. You craft tight, character-driven comedic plots with escalating irony, sharp subgenre voice, and clean medium-specific beat sheets.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              logline: { type: Type.STRING },
              setting: { type: Type.STRING },
              comedicEngine: { type: Type.STRING },
              characters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    archetype: { type: Type.STRING },
                    comedicFlaw: { type: Type.STRING },
                    secretGoal: { type: Type.STRING },
                  },
                  required: ['name', 'archetype', 'comedicFlaw', 'secretGoal'],
                },
              },
              beats: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    mediumCue: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    comedicEscalation: { type: Type.STRING },
                  },
                  required: ['label', 'mediumCue', 'summary', 'comedicEscalation'],
                },
              },
              runningGags: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    setup: { type: Type.STRING },
                    payoff: { type: Type.STRING },
                  },
                  required: ['setup', 'payoff'],
                },
              },
            },
            required: [
              'title',
              'logline',
              'setting',
              'comedicEngine',
              'characters',
              'beats',
              'runningGags',
            ],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        throw new Error('Gemini returned an empty response.');
      }

      const parsed = JSON.parse(rawText) as {
        title: string;
        logline: string;
        setting: string;
        comedicEngine: string;
        characters: Array<{
          name: string;
          archetype: string;
          comedicFlaw: string;
          secretGoal: string;
        }>;
        beats: Array<{
          label: string;
          mediumCue: string;
          summary: string;
          comedicEscalation: string;
        }>;
        runningGags: Array<{ setup: string; payoff: string }>;
      };

      const characters: CharacterProfile[] = Array.from({ length: characterCount }).map(
        (_, idx) => {
          const prev = existing?.characters[idx];
          if (prev?.locked) {
            return prev;
          }
          const c = parsed.characters[idx] ?? parsed.characters[0];
          return {
            id: makeId('char'),
            name: c?.name || `Character ${idx + 1}`,
            archetype: c?.archetype || 'Comedic Foil',
            comedicFlaw: c?.comedicFlaw || 'Refuses to admit fault',
            secretGoal: c?.secretGoal || 'Escape embarrassment',
            locked: false,
          };
        },
      );

      const beats: StoryBeat[] = mediumDef.beatTemplates.map((tpl, idx) => {
        const prev = existing?.beats[idx];
        if (prev?.locked && existing?.medium === body.medium) {
          return prev;
        }
        const b = parsed.beats[idx];
        return {
          id: makeId('beat'),
          beatNumber: idx + 1,
          label: b?.label || tpl.label,
          mediumCue: b?.mediumCue || tpl.defaultCue,
          summary: b?.summary || tpl.guidance,
          comedicEscalation: b?.comedicEscalation || 'Comedic stakes heighten sharply.',
          locked: false,
        };
      });

      const runningGags: RunningGag[] = [0, 1, 2].map((idx) => {
        const prev = existing?.runningGags[idx];
        if (prev?.locked) {
          return prev;
        }
        const g = parsed.runningGags[idx] ?? parsed.runningGags[0];
        return {
          id: makeId('gag'),
          setup: g?.setup || 'A recurring misunderstanding about a mundane object.',
          payoff: g?.payoff || 'Pays off unexpectedly at the climax.',
          locked: false,
        };
      });

      const resultPlot: ComedyPlot = {
        id: existing?.id ?? makeId('plot'),
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        title: existing?.titleLocked ? existing.title : parsed.title,
        titleLocked: existing?.titleLocked ?? false,
        logline: existing?.titleLocked ? existing.logline : parsed.logline,
        setting: existing?.settingLocked ? existing.setting : parsed.setting,
        settingLocked: existing?.settingLocked ?? false,
        comedicEngine: existing?.titleLocked ? existing.comedicEngine : parsed.comedicEngine,
        medium: body.medium,
        subgenre: body.subgenre,
        secondarySubgenre: body.secondarySubgenre ?? 'none',
        characterCount,
        premiseSeed: body.premiseSeed ?? '',
        characters,
        beats,
        runningGags,
      };

      res.json({ plot: resultPlot });
    } catch (err) {
      const { status, message } = formatApiError(err);
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/reroll-element', async (req, res) => {
    try {
      const { elementType, targetId, plot } = req.body as RerollElementRequest;
      const mediumDef = getMediumById(plot.medium);
      const primarySub = getSubgenreById(plot.subgenre);
      const ai = getAiClient();

      const contextSummary = [
        `Title: ${plot.title}`,
        `Logline: ${plot.logline}`,
        `Medium: ${mediumDef.name}`,
        `Subgenre: ${primarySub.name}`,
        `Setting: ${plot.setting}`,
        `Characters: ${plot.characters.map((c) => `${c.name} (${c.archetype}; flaw: ${c.comedicFlaw}; goal: ${c.secretGoal})`).join(' | ')}`,
      ].join('\n');

      if (elementType === 'premise') {
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `Given this comedy project context:\n${contextSummary}\n\nInvent a fresh, punchier alternative Working Title, Logline, and Comedic Engine that still fits the characters and setting.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                logline: { type: Type.STRING },
                comedicEngine: { type: Type.STRING },
              },
              required: ['title', 'logline', 'comedicEngine'],
            },
          },
        });
        const data = JSON.parse((response.text ?? '{}').trim()) as {
          title: string;
          logline: string;
          comedicEngine: string;
        };
        res.json({ plot: { ...plot, ...data } });
        return;
      }

      if (elementType === 'setting') {
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `Given this comedy project:\n${contextSummary}\n\nPropose a funnier, richer new primary setting (1 vivid sentence) different from "${plot.setting}".`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                setting: { type: Type.STRING },
              },
              required: ['setting'],
            },
          },
        });
        const data = JSON.parse((response.text ?? '{}').trim()) as { setting: string };
        res.json({ plot: { ...plot, setting: data.setting } });
        return;
      }

      if (elementType === 'character') {
        const target = plot.characters.find((c) => c.id === targetId);
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `Given this comedy project:\n${contextSummary}\n\nReplace character "${target?.name ?? 'target'}" with a completely new, funnier character who clashes hilariously with the rest of the cast.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                archetype: { type: Type.STRING },
                comedicFlaw: { type: Type.STRING },
                secretGoal: { type: Type.STRING },
              },
              required: ['name', 'archetype', 'comedicFlaw', 'secretGoal'],
            },
          },
        });
        const data = JSON.parse((response.text ?? '{}').trim()) as {
          name: string;
          archetype: string;
          comedicFlaw: string;
          secretGoal: string;
        };
        const nextChars = plot.characters.map((c) =>
          c.id === targetId ? { ...c, ...data } : c,
        );
        res.json({ plot: { ...plot, characters: nextChars } });
        return;
      }

      if (elementType === 'beat') {
        const target = plot.beats.find((b) => b.id === targetId);
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `Given this comedy project:\n${contextSummary}\n\nRewrite ONLY beat "${target?.label ?? ''}" (${target?.mediumCue ?? ''}) with a funnier, sharper twist that fits the characters and ${mediumDef.name} medium.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                comedicEscalation: { type: Type.STRING },
              },
              required: ['summary', 'comedicEscalation'],
            },
          },
        });
        const data = JSON.parse((response.text ?? '{}').trim()) as {
          summary: string;
          comedicEscalation: string;
        };
        const nextBeats = plot.beats.map((b) =>
          b.id === targetId ? { ...b, ...data } : b,
        );
        res.json({ plot: { ...plot, beats: nextBeats } });
        return;
      }

      if (elementType === 'gag') {
        const target = plot.runningGags.find((g) => g.id === targetId);
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `Given this comedy project:\n${contextSummary}\n\nReplace the running gag "${target?.setup ?? ''}" with a brand-new, clever setup and payoff.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                setup: { type: Type.STRING },
                payoff: { type: Type.STRING },
              },
              required: ['setup', 'payoff'],
            },
          },
        });
        const data = JSON.parse((response.text ?? '{}').trim()) as {
          setup: string;
          payoff: string;
        };
        const nextGags = plot.runningGags.map((g) =>
          g.id === targetId ? { ...g, ...data } : g,
        );
        res.json({ plot: { ...plot, runningGags: nextGags } });
        return;
      }

      res.status(400).json({ error: 'Unknown elementType for reroll.' });
    } catch (err) {
      const { status, message } = formatApiError(err);
      res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build artifacts not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Folio & Farce server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
