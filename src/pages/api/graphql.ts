import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextApiRequest, NextApiResponse } from 'next';
import typeDefs from '@/graphql/schemas/schema';
import dbConnect from '@/lib/db';
import { authenticateRequest, JWTPayload } from '@/lib/auth';
import { userResolvers } from '@/graphql/resolvers/user';
import { productResolvers } from '@/graphql/resolvers/product';
import { orderResolvers } from '@/graphql/resolvers/order';

export interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
  user: JWTPayload | null;
}

// Merge resolvers
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...productResolvers.Query,
    ...orderResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...productResolvers.Mutation,
    ...orderResolvers.Mutation,
  },
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const user = await authenticateRequest(req);
    return { req, res, user };
  },
});

export default handler; 