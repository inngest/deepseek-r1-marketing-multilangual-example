import "dotenv/config";
import express from "express";
import { serve } from "inngest/express";

import { Inngest } from "inngest";
import { OpenAI } from "openai";

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize Inngest client
const inngest = new Inngest({ id: "Marketing Campaign Generator" });

// Define the marketing expert system prompt
const MARKETING_EXPERT_PROMPT = `You are an expert marketing copywriter who specializes in creating engaging, culturally-appropriate content 
in multiple languages. You understand marketing psychology, cultural nuances, and how to adapt messaging 
across different markets while maintaining brand voice.`;

// Define the campaign generation function
const generateCampaign = inngest.createFunction(
  { id: "generate-multilingual-campaign" },
  { event: "marketing/campaign.requested" },
  async ({ event, step }) => {
    const {
      brandInfo,
      targetLanguages,
      campaignGoal,
      model = "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    } = event.data;

    const openai = new OpenAI({
      apiKey: model.includes("deepseek")
        ? process.env.DEEPSEEK_API_KEY
        : process.env.OPENAI_API_KEY,
      ...(model.includes("deepseek")
        ? { baseURL: process.env.DEEPSEEK_BASE_URL }
        : {}),
    });
    const createCompletion = openai.chat.completions.create.bind(
      openai.chat.completions
    );

    // Step 1: Generate campaign concept
    const campaignConcept: any = await step.ai.wrap(
      "generate-campaign-concept",
      createCompletion,
      {
        model: model,
        messages: [
          {
            role: "user",
            content: `
    ${MARKETING_EXPERT_PROMPT}
    Create a marketing campaign concept for the following brand:
    ${brandInfo}
    Campaign Goal: ${campaignGoal}
    
    The concept should be culturally adaptable across multiple markets.
    Provide the core message and key themes.
    `,
          },
        ],
        temperature: model.includes("deepseek") ? 0.6 : 1,
      }
    );

    // Step 2: Generate content for each language
    const localizedContent = targetLanguages.map(async (lang: string) =>
      step.ai.wrap("generate-campaign-concept", createCompletion, {
        model: model,
        messages: [
          {
            role: "user",
            content: `
            ${MARKETING_EXPERT_PROMPT}
            Adapt the following campaign concept for ${lang} market:
            ${campaignConcept.choices[0].message.content}
            
            Consider cultural nuances, local preferences, and idiomatic expressions.
            Provide:
            1. Headline
            2. Main copy
            3. Call to action
            4. Social media snippets (3 variations)
            
            Ensure the content feels native to ${lang} speakers while maintaining the core message and keeping technical terms in English.
          `,
          },
        ],
        temperature: model.includes("deepseek") ? 0.6 : 1,
      })
    );

    await Promise.all(localizedContent);

    return {
      campaign: {
        concept: campaignConcept,
        localizedContent,
      },
    };
  }
);

// Start the server
const PORT = process.env.PORT || 3000;

app.use(
  // Expose the middleware on our recommended path at `/api/inngest`.
  "/api/inngest",
  serve({ client: inngest, functions: [generateCampaign] })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
