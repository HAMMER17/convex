import { internalMutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";


// Create a new task with the given text
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) { throw new ConvexError('Error User') }

    const newUser = await ctx.db.query("users").collect();
    return newUser.filter(user => user.tokenIdentifier !== identity?.tokenIdentifier);
  },
});
export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      email: args.email,
      name: args.name,
      image: args.image,
      isOnline: true,
    });
  },
});
export const updateUser = internalMutation({
  args: { tokenIdentifier: v.string(), image: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users')
      .withIndex('by_tokenIdentifier', q => q.eq('tokenIdentifier', args.tokenIdentifier))
      .unique()
    if (!user) {
      throw new ConvexError('Error User')
    }
    await ctx.db.patch(user._id, { image: args.image, name: args.name })
  }
})
export const setUserOnline = internalMutation({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users')
      .withIndex('by_tokenIdentifier', q => q.eq('tokenIdentifier', args.tokenIdentifier))
      .unique()
    if (!user) {
      throw new ConvexError('Error User')
    }
    await ctx.db.patch(user._id, { isOnline: true })
  }
})
export const setUserOffline = internalMutation({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users')
      .withIndex('by_tokenIdentifier', q => q.eq('tokenIdentifier', args.tokenIdentifier))
      .unique()
    if (!user) {
      throw new ConvexError('Error User')
    }
    await ctx.db.patch(user._id, { isOnline: false })
  }
})
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Error User')

    const user = await ctx.db
      .query('users')
      .withIndex('by_tokenIdentifier', q => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique()
    if (!user) {
      throw new ConvexError('Error User')
    }
    return user;
  },
});