import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import type { Context } from '@/pages/api/graphql';

export const orderResolvers = {
  Query: {
    order: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const order = await Order.findById(id).populate('user').populate('items.product');
      if (!order) {
        throw new Error('Order not found');
      }

      // Check if the order belongs to the user
      if (order.user._id.toString() !== context.user.userId) {
        throw new Error('Not authorized');
      }

      return order;
    },
    myOrders: async (_: any, {
      status,
      skip = 0,
      limit = 20,
    }: {
      status?: string;
      skip?: number;
      limit?: number;
    }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const query: any = { user: context.user.userId };
      if (status) {
        query.status = status;
      }

      return Order.find(query)
        .populate('user')
        .populate('items.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    },
  },
  Mutation: {
    createOrder: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      // Calculate order totals and validate inventory
      let subtotal = 0;
      const items = await Promise.all(
        input.items.map(async (item: { productId: string; quantity: number }) => {
          const product = await Product.findById(item.productId);
          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }

          if (product.inventory.available < item.quantity) {
            throw new Error(`Insufficient inventory for product: ${product.name}`);
          }

          // Calculate price based on quantity (bulk pricing)
          let unitPrice = product.price.base;
          for (const bulk of product.price.bulk) {
            if (item.quantity >= bulk.quantity) {
              unitPrice = bulk.price;
            }
          }

          const totalPrice = unitPrice * item.quantity;
          subtotal += totalPrice;

          // Update inventory
          product.inventory.available -= item.quantity;
          product.inventory.reserved += item.quantity;
          await product.save();

          return {
            product: product._id,
            quantity: item.quantity,
            unitPrice,
            totalPrice,
          };
        })
      );

      // Calculate tax and shipping
      const tax = subtotal * 0.1; // 10% tax
      const shippingCost = 15; // Fixed shipping cost
      const total = subtotal + tax + shippingCost;

      const order = new Order({
        user: context.user.userId,
        items,
        shippingAddress: input.shippingAddress,
        billingAddress: input.billingAddress,
        paymentMethod: input.paymentMethod,
        subtotal,
        tax,
        shippingCost,
        total,
        notes: input.notes,
        status: 'pending',
        paymentStatus: 'pending',
      });

      await order.save();
      return order.populate('user').populate('items.product');
    },
    updateOrderStatus: async (_: any, { id, status }: { id: string; status: string }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const order = await Order.findById(id);
      if (!order) {
        throw new Error('Order not found');
      }

      order.status = status;

      // If order is cancelled, return items to inventory
      if (status === 'cancelled') {
        await Promise.all(
          order.items.map(async (item) => {
            const product = await Product.findById(item.product);
            if (product) {
              product.inventory.available += item.quantity;
              product.inventory.reserved -= item.quantity;
              await product.save();
            }
          })
        );
      }

      await order.save();
      return order.populate('user').populate('items.product');
    },
    cancelOrder: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const order = await Order.findById(id);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'pending') {
        throw new Error('Cannot cancel order in current status');
      }

      // Return items to inventory
      await Promise.all(
        order.items.map(async (item) => {
          const product = await Product.findById(item.product);
          if (product) {
            product.inventory.available += item.quantity;
            product.inventory.reserved -= item.quantity;
            await product.save();
          }
        })
      );

      order.status = 'cancelled';
      await order.save();

      return order.populate('user').populate('items.product');
    },
  },
}; 