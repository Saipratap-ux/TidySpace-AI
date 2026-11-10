import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Allow large payloads for base64 room photos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to get Gemini client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
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

// POST /api/analyze-room
app.post('/api/analyze-room', async (req: Request, res: Response) => {
  try {
    const { image, mimeType = 'image/jpeg', roomType = 'general', methodology = '3_box', painPoints = [], constraints = '' } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Strip data URL prefix if present
    const base64Data = image.includes(',') ? image.split(',')[1] : image;

    const ai = getGenAI();

    const promptText = `Analyze this room photo thoroughly as an expert professional home organizer and spatial decluttering architect.
Room category provided by user: "${roomType}".
Decluttering methodology preference: "${methodology}" (e.g. 3-Box Keep/Donate/Trash, KonMari category sorting, 15-Minute Micro-Sprints, or Minimalist Zones).
Specific user pain points: ${painPoints.length > 0 ? painPoints.join(', ') : 'General clutter and lack of organization'}.
Constraints & preferences: ${constraints || 'None specified; provide practical, budget-conscious solutions'}.

Tasks:
1. Detect distinct clutter zones in the image with approximate bounding boxes (ymin, xmin, ymax, xmax in 0-1000 scale, where (0,0) is top-left and (1000,1000) is bottom-right). Identify the specific bottleneck, why it accumulated, and the targeted remedy.
2. Formulate a 3-Pile Sorting Guide (Keep, Donate, Discard/Recycle) listing specific physical items clearly visible or inferred from this room photo.
3. Provide high-impact Quick Wins (3-4 micro-tasks that take 5 minutes or less to build immediate momentum).
4. Outline a sequential, chronological Step-by-Step Action Plan with realistic time estimates.
5. Recommend smart, practical storage solutions (including both commercial items and budget/DIY zero-cost alternatives).
6. Give 3-4 sustainable daily maintenance habits to prevent this specific clutter pattern from returning.
7. Paint a vivid, motivating transformation vision of how the space will feel and function once organized.

Be constructive, empathetic, non-judgmental, and exceptionally practical.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction: `You are TidySpace AI, a world-class professional home organizer, spatial designer, and decluttering coach.
You examine room photos with keen spatial awareness. You notice floor bottlenecks, surface pileups, tangled electronics, paper creep, and underutilized vertical space.
You provide encouraging, structured, actionable advice formatted strictly according to the JSON schema.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roomTypeDetected: {
              type: Type.STRING,
              description: 'The identified room type (e.g. Home Office, Bedroom, Living Room, Closet, Kitchen, etc.)',
            },
            roomSummary: {
              type: Type.STRING,
              description: '2-3 sentence overview assessing the current layout, clutter concentration, and natural potential.',
            },
            clutterScore: {
              type: Type.INTEGER,
              description: 'Clutter severity score from 1 (minimal clutter) to 10 (extreme overflow).',
            },
            totalEstimatedMinutes: {
              type: Type.INTEGER,
              description: 'Estimated total time in minutes required to declutter and organize this space.',
            },
            quickWins: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 immediate 2-to-5 minute tasks for instant visual breathing room.',
            },
            zones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  box: {
                    type: Type.OBJECT,
                    properties: {
                      ymin: { type: Type.INTEGER, description: '0 to 1000' },
                      xmin: { type: Type.INTEGER, description: '0 to 1000' },
                      ymax: { type: Type.INTEGER, description: '0 to 1000' },
                      xmax: { type: Type.INTEGER, description: '0 to 1000' },
                    },
                    required: ['ymin', 'xmin', 'ymax', 'xmax'],
                  },
                  severity: { type: Type.STRING, description: 'high, medium, or low' },
                  currentProblem: { type: Type.STRING },
                  proposedSolution: { type: Type.STRING },
                  recommendedAction: { type: Type.STRING },
                },
                required: ['id', 'name', 'box', 'severity', 'currentProblem', 'proposedSolution', 'recommendedAction'],
              },
            },
            threePileSorting: {
              type: Type.OBJECT,
              properties: {
                keep: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      whereToPut: { type: Type.STRING },
                      rationale: { type: Type.STRING },
                    },
                    required: ['item', 'whereToPut', 'rationale'],
                  },
                },
                donate: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      recipientSuggestion: { type: Type.STRING },
                      rationale: { type: Type.STRING },
                    },
                    required: ['item', 'recipientSuggestion', 'rationale'],
                  },
                },
                discardOrRecycle: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      ecoDisposalTip: { type: Type.STRING },
                      rationale: { type: Type.STRING },
                    },
                    required: ['item', 'ecoDisposalTip', 'rationale'],
                  },
                },
              },
              required: ['keep', 'donate', 'discardOrRecycle'],
            },
            storageRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  recommendedPlacement: { type: Type.STRING },
                  diyOrBudgetAlternative: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                },
                required: ['category', 'title', 'description', 'recommendedPlacement', 'diyOrBudgetAlternative', 'estimatedCost'],
              },
            },
            actionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  zone: { type: Type.STRING },
                  title: { type: Type.STRING },
                  details: { type: Type.STRING },
                  durationMinutes: { type: Type.INTEGER },
                  priority: { type: Type.STRING, description: 'high, medium, or low' },
                },
                required: ['stepNumber', 'zone', 'title', 'details', 'durationMinutes', 'priority'],
              },
            },
            sustainableHabits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            transformationVision: {
              type: Type.STRING,
              description: 'Vivid description of how peaceful, functional, and clean the space will look and feel after following this plan.',
            },
          },
          required: [
            'roomTypeDetected',
            'roomSummary',
            'clutterScore',
            'totalEstimatedMinutes',
            'quickWins',
            'zones',
            'threePileSorting',
            'storageRecommendations',
            'actionPlan',
            'sustainableHabits',
            'transformationVision',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text returned from Gemini API.');
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error('Error analyzing room:', error);
    const errorMessage = error?.message || 'Failed to analyze room photo';
    return res.status(500).json({
      error: errorMessage,
      details: error?.toString(),
    });
  }
});

// POST /api/organizer-chat
app.post('/api/organizer-chat', async (req: Request, res: Response) => {
  try {
    const { message, roomContext, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();

    const systemPrompt = `You are TidySpace AI Organizer, an empathetic, highly experienced professional organizer and interior decluttering advisor.
The user is currently organizing a room.
Context of their room analysis:
Room Type: ${roomContext?.roomTypeDetected || 'Home room'}
Summary: ${roomContext?.roomSummary || 'Analyzing space'}
Clutter Score: ${roomContext?.clutterScore || 'Moderate'}/10
Key Zones Identified: ${roomContext?.zones?.map((z: any) => z.name).join(', ') || 'General space'}

Answer the user's specific organization question concisely, with warmth, practical steps, item storage tips, or decluttering motivation.
Avoid generic lectures; give concrete, actionable advice with numbered or bulleted tips where appropriate.`;

    const chatMessages: string[] = [];
    if (history && Array.isArray(history)) {
      history.slice(-6).forEach((h: any) => {
        chatMessages.push(`${h.role === 'user' ? 'User' : 'Organizer'}: ${h.text}`);
      });
    }
    chatMessages.push(`User: ${message}`);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatMessages.join('\n\n'),
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in organizer chat:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process organizer advice',
    });
  }
});

// POST /api/generate-clean-layout
app.post('/api/generate-clean-layout', async (req: Request, res: Response) => {
  try {
    const { roomType, zones, storageRecommendations } = req.body;
    const ai = getGenAI();

    const prompt = `Based on this room (${roomType}) and its zones (${zones?.map((z: any) => z.name).join(', ')}), provide a comprehensive "After Transformation Blueprint".
Outline:
1. Exact zoned layout (Active Zone, Storage Zone, Clear Negative Space)
2. Aesthetic styling tips (lighting, plants, surface clearing rules)
3. "One-Touch Rule" guidelines tailored to this room type.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an architectural interior organizer. Provide clear, inspiring layout blueprints.',
      },
    });

    return res.json({ blueprint: response.text });
  } catch (error: any) {
    console.error('Error generating clean layout:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate layout' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
