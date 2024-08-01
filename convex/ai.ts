"use node";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// import OpenAI from "openai";

const TOGETHER_API_KEY = process.env.OPENAI_API_KEY!;
// const apiKey = process.env.OPENAI_API_KEY!;
// const openai = new OpenAI({ apiKey });

export const chat = action({
  args: {
    author: v.string(),
    messageBody: v.string(),
  },
  handler: async (ctx, args) => {
    const res = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3-8b-chat-hf",
        messages: [
          {
            role: "system",
            content:
              "You are a terse bot in a group chat responding to questions with 1-sentence answers.",
          },
          {
            role: "user",
            content: args.messageBody,
          },
        ],
      }),
    });

    const json = await res.json();
    const messageContent = json.choices[0].message?.content;

    await ctx.runMutation(api.messages.send, {
      author: args.author,
      body: messageContent || "Sorry, I don't have an answer for that.",
    });
  },
});

