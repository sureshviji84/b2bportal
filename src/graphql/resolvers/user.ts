import { User } from '@/models/User';
import { generateToken } from '@/lib/auth';
import type { Context } from '@/pages/api/graphql';

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const user = await User.findById(context.user.userId);
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },
    user: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },
    users: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      return User.find({});
    },
  },
  Mutation: {
    register: async (_: any, { input }: { input: any }) => {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const user = new User({
        ...input,
        verificationStatus: 'pending',
      });

      await user.save();

      const token = generateToken(user);

      return {
        token,
        user,
      };
    },
    login: async (_: any, { input }: { input: { email: string; password: string } }) => {
      const user = await User.findOne({ email: input.email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = await user.comparePassword(input.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      const token = generateToken(user);

      return {
        token,
        user,
      };
    },
    updateUser: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const user = await User.findById(context.user.userId);
      if (!user) {
        throw new Error('User not found');
      }

      Object.assign(user, input);
      await user.save();

      return user;
    },
    verifyUser: async (_: any, { id, status }: { id: string; status: string }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      user.verificationStatus = status;
      await user.save();

      return user;
    },
  },
}; 