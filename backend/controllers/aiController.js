import { GoogleGenAI } from "@google/genai";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getAIInsights = async (req, res) => {
  try {
    // Fetch workspace data from MongoDB
    const [tasks, projects] = await Promise.all([
      Task.find().lean(),
      Project.find().lean(),
    ]);

    // Handle empty workspace
    if (tasks.length === 0 && projects.length === 0) {
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

    // Prepare workspace data
    const workspaceData = {
      projects,
      tasks,
    };

    // AI prompt
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
8. Return ONLY valid JSON.
`;

    // Expected AI response structure
    const responseSchema = {
      type: "object",
      properties: {
        summary: {
          type: "string",
        },

        focusTask: {
          type: "object",
          nullable: true,
          properties: {
            title: {
              type: "string",
            },
            reason: {
              type: "string",
            },
          },
          required: ["title", "reason"],
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
            required: ["title", "reason", "priority"],
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
            required: ["title", "description"],
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

    // Generate AI analysis
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("AI returned an empty response");
    }

    // Parse AI response
    let insights;

    try {
      insights = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid response format",
      });
    }

    // Send response
    return res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error("AI analysis failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI insights",
      error: error.message,
    });
  }
};

export { getAIInsights };