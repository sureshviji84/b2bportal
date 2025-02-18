import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  sku: string;
  category: string;
  subCategory?: string;
  brand: string;
  images: string[];
  price: {
    base: number;
    bulk: {
      quantity: number;
      price: number;
    }[];
    currency: string;
  };
  inventory: {
    available: number;
    reserved: number;
    minimum: number;
  };
  specifications: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    shelfLife?: number;
    storageInstructions?: string;
  };
  packaging: {
    unitsPerBox: number;
    boxesPerPallet: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    price: {
      base: {
        type: Number,
        required: true,
        min: 0,
      },
      bulk: [{
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      }],
      currency: {
        type: String,
        required: true,
        default: 'USD',
      },
    },
    inventory: {
      available: {
        type: Number,
        required: true,
        min: 0,
      },
      reserved: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      minimum: {
        type: Number,
        required: true,
        default: 10,
        min: 0,
      },
    },
    specifications: {
      weight: {
        type: Number,
        required: true,
        min: 0,
      },
      dimensions: {
        length: {
          type: Number,
          required: true,
          min: 0,
        },
        width: {
          type: Number,
          required: true,
          min: 0,
        },
        height: {
          type: Number,
          required: true,
          min: 0,
        },
      },
      shelfLife: {
        type: Number,
        min: 0,
      },
      storageInstructions: String,
    },
    packaging: {
      unitsPerBox: {
        type: Number,
        required: true,
        min: 1,
      },
      boxesPerPallet: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ 'price.base': 1 });
productSchema.index({ isActive: 1 });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product; 