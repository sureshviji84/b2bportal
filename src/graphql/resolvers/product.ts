import { Product } from '@/models/Product';
import type { Context } from '@/pages/api/graphql';

export const productResolvers = {
  Query: {
    product: async (_: any, { id }: { id: string }) => {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    },
    products: async (_: any, {
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      inStock,
      skip = 0,
      limit = 20,
    }: {
      category?: string;
      brand?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      skip?: number;
      limit?: number;
    }) => {
      const query: any = { isActive: true };

      if (category) {
        query.category = category;
      }

      if (brand) {
        query.brand = brand;
      }

      if (search) {
        query.$text = { $search: search };
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        query['price.base'] = {};
        if (minPrice !== undefined) {
          query['price.base'].$gte = minPrice;
        }
        if (maxPrice !== undefined) {
          query['price.base'].$lte = maxPrice;
        }
      }

      if (inStock) {
        query['inventory.available'] = { $gt: 0 };
      }

      return Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    },
  },
  Mutation: {
    createProduct: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const product = new Product(input);
      await product.save();

      return product;
    },
    updateProduct: async (_: any, { id, input }: { id: string; input: any }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      Object.assign(product, input);
      await product.save();

      return product;
    },
    deleteProduct: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      await product.deleteOne();
      return true;
    },
  },
}; 