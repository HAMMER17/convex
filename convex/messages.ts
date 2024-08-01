import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const setTextMessages = mutation({
  args: {
    sender: v.string(),
    content: v.string(),
    conversation: v.id('conversations')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Error Identity')

    const user = await ctx.db.query('users')
      .withIndex('by_tokenIdentifier', q => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique()
    if (!user) throw new ConvexError('Error User')

    const conversation = await ctx.db.query('conversations')
      .filter(q => q.eq(q.field('_id'), args.conversation)).first()
    if (!conversation) throw new ConvexError('Error Identity')
    if (!conversation.participants.includes(user._id)) throw new ConvexError('Error Identity')

    await ctx.db.insert("messages", {
      sender: args.sender,
      content: args.content,
      conversation: args.conversation,
      messageType: "text",
    })

  }
})
export const getMessages = query({
  args: {
    conversation: v.id('conversations')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversation", args.conversation))
      .collect();
    const userProfileCache = new Map();
    const messagesWithSender = await Promise.all(
      messages.map(async (message) => {
        if (message.sender === "ChatGPT") {
          const image = message.messageType === "text" ? "/gpt.png" : "dall-e.png";
          return { ...message, sender: { name: "ChatGPT", image } };
        }
        let sender;
        // Check if sender profile is in cache
        if (userProfileCache.has(message.sender)) {
          sender = userProfileCache.get(message.sender);
        } else {
          // Fetch sender profile from the database
          sender = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), message.sender))
            .first();
          // Cache the sender profile
          userProfileCache.set(message.sender, sender);
        }

        return { ...message, sender };
      })
    );
    return messagesWithSender;
  }
})
export const sendImage = mutation({
  args: { imgId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const content = (await ctx.storage.getUrl(args.imgId)) as string;

    await ctx.db.insert("messages", {
      content: content,
      sender: args.sender,
      messageType: "image",
      conversation: args.conversation,
    });
  },
});
export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, { body, author }) => {
    // Send a new message.
    await ctx.db.insert("gpt", { body, author });
    if (body.startsWith("@ai")) {
      // Schedule the chat action to run immediately
      await ctx.scheduler.runAfter(0, api.ai.chat, {

        messageBody: body,
        author: 'ChatGPT'
      });

    }
  },
});
export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("gpt").order("desc").take(100);
    // Reverse the list so that it's in a chronological order.
    return messages;
  },
});
