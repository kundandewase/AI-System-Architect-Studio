const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const Type = {
  OBJECT: 'object',
  STRING: 'string',
  ARRAY: 'array',
  BOOLEAN: 'boolean'
};

function normalizeMermaidDiagram(diagram) {
  let clean = String(diagram || '').trim();

  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:mermaid)?\s*/i, '').replace(/\s*```$/, '');
  }

  clean = clean.replace(/\r\n?/g, '\n');
  clean = clean.replace(/^flowChart\b/i, 'flowchart');

  const headerMatch = clean.match(/^(graph|flowchart)\s+(\w+)\s+/i);
  if (headerMatch) {
    clean = clean.replace(/^(graph|flowchart)\s+(\w+)\s+/i, `${headerMatch[1]} ${headerMatch[2]}\n`);
  }

  clean = clean.replace(
    /\b([A-Za-z_][\w-]*)\s*(-->|---|==>|-\.->|--|==|-\.\-?)\s*([A-Za-z_][\w-]*(?:\[[^\n\r\]]*\]|\([^\n\r\)]*\)|\{[^\n\r\}]*\}))\s*:\s*"([^"]+)"/g,
    (_match, sourceNode, connector, targetNode, label) => `${sourceNode} ${connector}|${label}| ${targetNode}`
  );

  let inQuotes = false;
  let normalized = '';
  for (let index = 0; index < clean.length; index += 1) {
    const char = clean[index];
    if (char === '"') {
      inQuotes = !inQuotes;
      normalized += char;
      continue;
    }

    if (inQuotes && char === '\n') {
      normalized += ' ';
      continue;
    }

    normalized += char;
  }

  clean = normalized.replace(/"([^"]*)"/g, (_match, labelText) => {
    const normalizedLabel = String(labelText).replace(/\s{2,}/g, ' ').trim();
    return `"${normalizedLabel}"`;
  });

  clean = clean.replace(/([\]\)\}])\s+(?=[A-Za-z_][\w-]*\s*(?:-->|---|==>|-\.->|--|==|-\.\-?|\[[^\n\r]*\]|\([^\n\r]*\)|\{[^\n\r]*\}))/g, '$1\n');
  clean = clean.replace(/\b([A-Za-z_][\w-]*)\s+(?=[A-Za-z_][\w-]*\s*(?:\[[^\n\r]*\]|\([^\n\r]*\)|\{[^\n\r]*\}))/g, '$1\n');
  clean = clean.replace(/\n{3,}/g, '\n\n');

  return clean;
}

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Check if Gemini API key exists
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY environment variable is not defined. Please add it to your .env file.');
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    systemArchitecture: {
      type: Type.STRING,
      description: "Mermaid.js flowchart diagram source code. Must start with graph TD or flowChart TD. Clean connection syntax. Do NOT wrap in markdown code blocks like ```mermaid. Return just the raw Mermaid code string.",
    },
    databaseSchema: {
      type: Type.ARRAY,
      description: "Database tables list with fields and relationships",
      items: {
        type: Type.OBJECT,
        properties: {
          tableName: { type: Type.STRING },
          columns: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                isPrimary: { type: Type.BOOLEAN },
                isForeign: { type: Type.BOOLEAN },
                notes: { type: Type.STRING }
              },
              required: ["name", "type", "isPrimary", "isForeign"]
            }
          },
          relationships: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Relationships from this table to other tables, e.g. Users.id -> Orders.user_id (1:N)"
          }
        },
        required: ["tableName", "columns"]
      }
    },
    apiEndpoints: {
      type: Type.ARRAY,
      description: "REST API endpoints mapping the key operations of the application",
      items: {
        type: Type.OBJECT,
        properties: {
          method: { type: Type.STRING, description: "GET, POST, PUT, or DELETE" },
          path: { type: Type.STRING },
          description: { type: Type.STRING },
          requestBody: { type: Type.STRING, description: "Description or JSON sample of request body. Null if none." },
          responseBody: { type: Type.STRING, description: "Description or JSON sample of response body" }
        },
        required: ["method", "path", "description", "responseBody"]
      }
    },
    techStack: {
      type: Type.OBJECT,
      properties: {
        frontend: {
          type: Type.OBJECT,
          properties: {
            technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
            reason: { type: Type.STRING }
          },
          required: ["technologies", "reason"]
        },
        backend: {
          type: Type.OBJECT,
          properties: {
            technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
            reason: { type: Type.STRING }
          },
          required: ["technologies", "reason"]
        },
        database: {
          type: Type.OBJECT,
          properties: {
            technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
            reason: { type: Type.STRING }
          },
          required: ["technologies", "reason"]
        },
        other: {
          type: Type.OBJECT,
          properties: {
            technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
            reason: { type: Type.STRING }
          },
          required: ["technologies", "reason"]
        }
      },
      required: ["frontend", "backend", "database", "other"]
    },
    deployment: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          purpose: { type: Type.STRING },
          cost: { type: Type.STRING },
          details: { type: Type.STRING }
        },
        required: ["platform", "purpose", "cost", "details"]
      }
    },
    costEstimation: {
      type: Type.OBJECT,
      properties: {
        small: {
          type: Type.OBJECT,
          properties: {
            users: { type: Type.STRING },
            monthlyCost: { type: Type.STRING },
            breakdown: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING }
          },
          required: ["users", "monthlyCost", "breakdown", "recommendation"]
        },
        medium: {
          type: Type.OBJECT,
          properties: {
            users: { type: Type.STRING },
            monthlyCost: { type: Type.STRING },
            breakdown: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING }
          },
          required: ["users", "monthlyCost", "breakdown", "recommendation"]
        },
        large: {
          type: Type.OBJECT,
          properties: {
            users: { type: Type.STRING },
            monthlyCost: { type: Type.STRING },
            breakdown: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING }
          },
          required: ["users", "monthlyCost", "breakdown", "recommendation"]
        }
      },
      required: ["small", "medium", "large"]
    }
  },
  required: ["systemArchitecture", "databaseSchema", "apiEndpoints", "techStack", "deployment", "costEstimation"]
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    apiKeyConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Generation API Endpoint
app.post('/api/generate', async (req, res) => {
  const { idea } = req.body;

  if (!idea || typeof idea !== 'string' || idea.trim() === '') {
    return res.status(400).json({ error: 'App idea is required.' });
  }

  const currentApiKey = process.env.GEMINI_API_KEY;
  if (!currentApiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please add it to your .env file in the backend directory.'
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(currentApiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const prompt = `You are a system architecture expert. Based on the following application idea, generate the architecture diagram, database schema, API endpoints, technology stack, deployment suggestions, and cost estimation:

Application Idea: "${idea}"

Generate a complete and cohesive architecture design for this idea, ensuring all 6 outputs fit together perfectly and reflect a production-grade (yet simple) setup.

For the System Architecture Diagram, output valid Mermaid.js syntax using "graph TD" flow.
CRITICAL MERMAID.JS RULES:
1. Every node description containing parentheses, brackets, slashes, or special characters MUST be wrapped in double quotes. For example, use A["User (Web/Mobile)"] or B["API Gateway (Express)"], NOT A[User (Web/Mobile)] or B[API Gateway (Express)].
2. Avoid nesting brackets or using special characters outside of double quotes.
3. Keep connections clean and simple, e.g. A --> B.`;

    console.log(`Generating system architecture for: "${idea.substring(0, 50)}..."`);
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON response
    const parsedData = JSON.parse(responseText);
    if (parsedData && typeof parsedData.systemArchitecture === 'string') {
      parsedData.systemArchitecture = normalizeMermaidDiagram(parsedData.systemArchitecture);
    }
    res.json(parsedData);
  } catch (err) {
    console.error('Error generating architecture:', err);
    res.status(500).json({
      error: 'Failed to generate architecture using Gemini. Please verify your API key and try again.',
      details: err.message
    });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`Port ${PORT} is already in use. Another backend instance is likely already running.`);
    process.exit(0);
  }

  console.error('Failed to start server:', err);
  process.exit(1);
});
