import { GoogleGenAI } from "@google/genai";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

const PRIMARY_MODEL = "gemini-3.6-flash";
const FALLBACK_MODEL = "gemini-3.7-flash";

const MAX_RETRIES = 2;
const INITIAL_RETRY_DELAY = 1000;

// ---------------------------------------
// Wait helper
// ---------------------------------------
const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------
// Check whether an error is temporary
// ---------------------------------------
const isRetryableError = (error) => {
  const status = error?.status || error?.code;

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
};

// ---------------------------------------
// Generate Gemini response with retries
// ---------------------------------------
const generateWithRetry = async (
  ai,
  model,
  prompt,
  responseJsonSchema
) => {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `Generating AI insights using ${model} (attempt ${
          attempt + 1
        }/${MAX_RETRIES + 1})`
      );

      const response = await ai.models.generateContent({
        model,

        contents: prompt,

        config: {
          responseMimeType: "application/json",
          responseJsonSchema,
        },
      });

      return response;
    } catch (error) {
      lastError = error;

      // Do not retry permanent/client errors
      if (!isRetryableError(error)) {
        throw error;
      }

      // No retry after final attempt
      if (attempt === MAX_RETRIES) {
        break;
      }

      const delay =
        INITIAL_RETRY_DELAY * Math.pow(2, attempt);

      console.warn(
        `${model} temporarily unavailable. ` +
          `Retrying in ${delay}ms...`
      );

      await wait(delay);
    }
  }

  throw lastError;
};

// ---------------------------------------
// GET /api/ai/insights
// ---------------------------------------
const getAIInsights = async (req, res) => {
  try {
    // ---------------------------------------
    // Authentication check
    // ---------------------------------------
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // ---------------------------------------
    // Gemini API key check
    // ---------------------------------------
    if (!process.env.GEMINI_API_KEY) {
      console.error(
        "GEMINI_API_KEY is not configured."
      );

      return res.status(500).json({
        success: false,
        message: "AI service is not configured",
      });
    }

    // ---------------------------------------
    // Initialize Gemini
    // ---------------------------------------
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // ---------------------------------------
    // Fetch user's workspace
    // ---------------------------------------
    const [tasks, projects] = await Promise.all([
      Task.find({
        user: req.user.id,
      }).lean(),

      Project.find({
        user: req.user.id,
      }).lean(),
    ]);

    // ---------------------------------------
    // Handle empty workspace
    // ---------------------------------------
    if (
      tasks.length === 0 &&
      projects.length === 0
    ) {
      return res.status(200).json({
        success: true,

        data: {
          summary:
            "There is not enough workspace data for an AI analysis yet.",

          focusTask: null,

          priorities: [],

          risks: [],

          recommendations: [
            "Create some projects and tasks to receive personalized productivity insights.",
          ],
        },
      });
    }

    // ---------------------------------------
    // Prepare workspace data
    // ---------------------------------------
    const workspaceData = {
      projects,
      tasks,
    };

    // ---------------------------------------
    // AI prompt
    // ---------------------------------------
    const prompt = `
You are an expert AI developer productivity coach.

Analyze the following developer workspace data.

Your analysis should identify:

- The most important task to work on next
- High-priority work
- Overdue or approaching-deadline tasks
- Projects with low progress
- Workload problems
- Productivity risks
- Specific actions the developer should take next

WORKSPACE DATA:
${JSON.stringify(workspaceData, null, 2)}

RULES:

1. Use ONLY the supplied workspace data.
2. Never invent tasks, projects, deadlines, priorities, or statistics.
3. Give practical and specific recommendations.
4. Consider task status, priority, due dates, project progress, and workload.
5. If there are no obvious risks, return an empty risks array.
6. If there are no tasks, focusTask must be null.
7. Keep the response concise.
8. Return ONLY valid JSON matching the supplied schema.
`;

    // ---------------------------------------
    // Gemini JSON schema
    // ---------------------------------------
    const responseJsonSchema = {
      type: "object",

      properties: {
        summary: {
          type: "string",
        },

        focusTask: {
          type: ["object", "null"],

          properties: {
            title: {
              type: "string",
            },

            reason: {
              type: "string",
            },
          },

          required: [
            "title",
            "reason",
          ],
        },

        priorities: {
          type: "array",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",
              },

              reason: {
                type: "string",
              },

              priority: {
                type: "string",
              },
            },

            required: [
              "title",
              "reason",
              "priority",
            ],
          },
        },

        risks: {
          type: "array",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",
              },

              description: {
                type: "string",
              },
            },

            required: [
              "title",
              "description",
            ],
          },
        },

        recommendations: {
          type: "array",

          items: {
            type: "string",
          },
        },
      },

      required: [
        "summary",
        "focusTask",
        "priorities",
        "risks",
        "recommendations",
      ],
    };

    // ---------------------------------------
    // Try primary model
    // ---------------------------------------
    let response;

    try {
      response = await generateWithRetry(
        ai,
        PRIMARY_MODEL,
        prompt,
        responseJsonSchema
      );
    } catch (primaryError) {
      console.error(
        `${PRIMARY_MODEL} failed after retries:`,
        primaryError
      );

      // ---------------------------------------
      // Try fallback model only for temporary
      // service errors
      // ---------------------------------------
      if (!isRetryableError(primaryError)) {
        throw primaryError;
      }

      console.warn(
        `Trying fallback model: ${FALLBACK_MODEL}`
      );

      response = await generateWithRetry(
        ai,
        FALLBACK_MODEL,
        prompt,
        responseJsonSchema
      );
    }

    // ---------------------------------------
    // Read response
    // ---------------------------------------
    const responseText = response?.text;

    if (!responseText) {
      console.error(
        "Gemini returned an empty response."
      );

      return res.status(502).json({
        success: false,
        message:
          "AI service returned an empty response",
      });
    }

    // ---------------------------------------
    // Parse JSON
    // ---------------------------------------
    let insights;

    try {
      insights = JSON.parse(responseText);
    } catch (error) {
      console.error(
        "Failed to parse Gemini response:",
        error.message
      );

      return res.status(502).json({
        success: false,
        message:
          "AI service returned an invalid response",
      });
    }

    // ---------------------------------------
    // Send result
    // ---------------------------------------
    return res.status(200).json({
      success: true,
      data: insights,
    });
    } catch (error) {
    console.error("AI analysis failed:", error);

    // Gemini service temporarily unavailable
    if (error?.status === 503) {
      return res.status(503).json({
        success: false,
        message:
          "The AI service is temporarily unavailable because Gemini is experiencing high demand. Please try again in a few moments.",
      });
    }

    // Gemini rate limit
    if (error?.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "The AI service has reached its request limit. Please wait a little and try again.",
      });
    }

    // Authentication / API key problem
    if (
      error?.status === 401 ||
      error?.status === 403
    ) {
      return res.status(500).json({
        success: false,
        message:
          "The AI service could not be authenticated. Please check the Gemini API configuration.",
      });
    }

    // General Gemini/API error
    return res.status(500).json({
      success: false,
      message:
        "The AI service could not complete your request. Please try again later.",
    });
  }
};

export { getAIInsights };