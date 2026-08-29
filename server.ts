import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization helper for Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in server environment');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI 3D Animation Generation Endpoint
app.post('/api/gemini/generate-animation', async (req, res) => {
  try {
    const { modelName, meshNames, dimensions, userPrompt, motionStyle } = req.body;

    let ai: GoogleGenAI | null = null;
    try {
      ai = getGeminiClient();
    } catch (e: any) {
      console.warn('Gemini client init note:', e?.message);
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Fallback engine will be used.',
      });
    }

    const systemPrompt = `You are a world-class 3D Technical Animator and Creative Motion Director specializing in Three.js and WebGL animations.
Given a 3D model's name, dimensions, sub-mesh parts, and a requested motion style or prompt (e.g. rhythm walk, breathing, driving, showcase, bounce), you synthesize high-quality keyframe animation tracks.

Available track types:
1. Root object tracks (apply to the whole model wrapper):
   - 'root.position' (array of x, y, z offset floats in normalized units for each timestamp)
   - 'root.rotation' (array of Euler x, y, z in radians for each timestamp)
   - 'root.scale' (array of scale multiplier x, y, z floats for each timestamp)
2. Sub-mesh tracks (apply to specific mesh names if provided in meshNames list):
   - '{meshName}.position'
   - '{meshName}.rotation'
   - '{meshName}.scale'

CRITICAL SAFETY & SCALE CONSTRAINTS (STRICT):
- Base scale is 1.0. The 'root.scale' values MUST strictly stay between 0.94 and 1.06 (subtle squash & stretch or breathing only). NEVER output extreme scale values like 0.1 or 2.0 or 10.0.
- For walking/marching/rhythm motions: translate in a loop with rhythmic Y-axis bounce (Y offset between 0 and 0.25 units) and subtle X-axis sway (±0.08 units) with forward/backward tilt (rotX ±0.06 rad), keeping scale near [1.0, 1.0, 1.0].
- 'root.position' offsets must be small local displacements: Y offset within [-0.05, 0.35], X offset within [-0.2, 0.2], Z offset within [-0.2, 0.2].
- Animation duration should be between 2.0 and 6.0 seconds (loopable).
- Use at least 5 to 9 keyframe timestamps (e.g. [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]).
- The first timestamp (0) and last timestamp (duration) MUST match for seamless looping.
- Return a creative Korean animation title and a 1-2 sentence AI insight explaining the motion artistry.`;

    const promptText = `Generate a 3D animation for this model:
Model Name: ${modelName || '3D Object'}
Model Dimensions (Bounding Box): Width(X)=${dimensions?.x || 1}, Height(Y)=${dimensions?.y || 1}, Depth(Z)=${dimensions?.z || 1}
Mesh Parts Available: ${Array.isArray(meshNames) && meshNames.length > 0 ? meshNames.slice(0, 15).join(', ') : 'Single Unified Mesh'}
Requested Motion / Style: ${userPrompt || motionStyle || 'Rhythmic natural motion'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clipName: {
              type: Type.STRING,
              description: 'Creative descriptive name of the animation in Korean (e.g., "리듬감 있는 경쾌한 보행", "신성한 명상 부유")',
            },
            duration: {
              type: Type.NUMBER,
              description: 'Total duration in seconds (e.g. 3.0 or 4.0)',
            },
            aiInsight: {
              type: Type.STRING,
              description: '1-2 sentence explanation of why this motion fits the model',
            },
            timestamps: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER },
              description: 'Array of keyframe timestamps in seconds from 0 to duration',
            },
            rootPositionTrack: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER },
              description: 'Flat array of [x,y,z, x,y,z, ...] for root position offsets at each timestamp',
            },
            rootRotationTrack: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER },
              description: 'Flat array of [rotX,rotY,rotZ, ...] in radians for root rotation at each timestamp',
            },
            rootScaleTrack: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER },
              description: 'Flat array of [scaleX,scaleY,scaleZ, ...] for root scale at each timestamp (safe range 0.95-1.05)',
            },
            partTracks: {
              type: Type.ARRAY,
              description: 'Optional animation tracks for sub-mesh parts',
              items: {
                type: Type.OBJECT,
                properties: {
                  targetMeshName: { type: Type.STRING },
                  trackType: { type: Type.STRING, description: '"position" or "rotation" or "scale"' },
                  values: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: 'Flat array of [x,y,z,...] or [rotX,rotY,rotZ,...]',
                  },
                },
                required: ['targetMeshName', 'trackType', 'values'],
              },
            },
          },
          required: ['clipName', 'duration', 'aiInsight', 'timestamps', 'rootPositionTrack', 'rootRotationTrack'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      return res.status(500).json({ error: 'Empty response from Gemini model' });
    }

    const parsedData = JSON.parse(responseText);

    // Hard Safety Post-Processing: Clamp all scales and positions to prevent model distortion
    if (Array.isArray(parsedData.rootScaleTrack)) {
      parsedData.rootScaleTrack = parsedData.rootScaleTrack.map((val: number) =>
        Math.max(0.92, Math.min(1.08, Number.isFinite(val) ? val : 1.0))
      );
    }
    if (Array.isArray(parsedData.rootPositionTrack)) {
      parsedData.rootPositionTrack = parsedData.rootPositionTrack.map((val: number, idx: number) => {
        const axis = idx % 3;
        if (!Number.isFinite(val)) return 0;
        if (axis === 1) return Math.max(-0.05, Math.min(0.4, val)); // Y axis
        return Math.max(-0.25, Math.min(0.25, val)); // X, Z axis
      });
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating AI animation:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate AI animation',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`3D Studio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
