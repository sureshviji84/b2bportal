import { gql } from '@apollo/client';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    companyName: String!
    businessType: BusinessType!
    firstName: String!
    lastName: String!
    phone: String!
    address: Address!
    taxId: String
    verificationStatus: VerificationStatus!
    createdAt: String!
    updatedAt: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    sku: String!
    category: String!
    subCategory: String
    brand: String!
    images: [String!]!
    price: Price!
    inventory: Inventory!
    specifications: Specifications!
    packaging: Packaging!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Order {
    id: ID!
    user: User!
    orderNumber: String!
    items: [OrderItem!]!
    status: OrderStatus!
    shippingAddress: Address!
    billingAddress: Address!
    paymentStatus: PaymentStatus!
    paymentMethod: String!
    subtotal: Float!
    tax: Float!
    shippingCost: Float!
    total: Float!
    notes: String
    expectedDeliveryDate: String
    createdAt: String!
    updatedAt: String!
  }

  type Address {
    street: String!
    city: String!
    state: String!
    postalCode: String!
    country: String!
  }

  type Price {
    base: Float!
    bulk: [BulkPrice!]!
    currency: String!
  }

  type BulkPrice {
    quantity: Int!
    price: Float!
  }

  type Inventory {
    available: Int!
    reserved: Int!
    minimum: Int!
  }

  type Specifications {
    weight: Float!
    dimensions: Dimensions!
    shelfLife: Int
    storageInstructions: String
  }

  type Dimensions {
    length: Float!
    width: Float!
    height: Float!
  }

  type Packaging {
    unitsPerBox: Int!
    boxesPerPallet: Int!
  }

  type OrderItem {
    product: Product!
    quantity: Int!
    unitPrice: Float!
    totalPrice: Float!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  enum BusinessType {
    RETAILER
    WHOLESALER
    DISTRIBUTOR
  }

  enum VerificationStatus {
    PENDING
    VERIFIED
    REJECTED
  }

  enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  enum PaymentStatus {
    PENDING
    PAID
    FAILED
  }

  input AddressInput {
    street: String!
    city: String!
    state: String!
    postalCode: String!
    country: String!
  }

  input CreateUserInput {
    email: String!
    password: String!
    companyName: String!
    businessType: BusinessType!
    firstName: String!
    lastName: String!
    phone: String!
    address: AddressInput!
    taxId: String
  }

  input UpdateUserInput {
    companyName: String
    firstName: String
    lastName: String
    phone: String
    address: AddressInput
    taxId: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateProductInput {
    name: String!
    description: String!
    sku: String!
    category: String!
    subCategory: String
    brand: String!
    images: [String!]!
    price: PriceInput!
    inventory: InventoryInput!
    specifications: SpecificationsInput!
    packaging: PackagingInput!
  }

  input PriceInput {
    base: Float!
    bulk: [BulkPriceInput!]!
    currency: String!
  }

  input BulkPriceInput {
    quantity: Int!
    price: Float!
  }

  input InventoryInput {
    available: Int!
    minimum: Int!
  }

  input SpecificationsInput {
    weight: Float!
    dimensions: DimensionsInput!
    shelfLife: Int
    storageInstructions: String
  }

  input DimensionsInput {
    length: Float!
    width: Float!
    height: Float!
  }

  input PackagingInput {
    unitsPerBox: Int!
    boxesPerPallet: Int!
  }

  input CreateOrderInput {
    items: [OrderItemInput!]!
    shippingAddress: AddressInput!
    billingAddress: AddressInput!
    paymentMethod: String!
    notes: String
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  type Query {
    me: User
    user(id: ID!): User
    users: [User!]!
    
    product(id: ID!): Product
    products(
      category: String
      brand: String
      search: String
      minPrice: Float
      maxPrice: Float
      inStock: Boolean
      skip: Int
      limit: Int
    ): [Product!]!
    
    order(id: ID!): Order
    myOrders(
      status: OrderStatus
      skip: Int
      limit: Int
    ): [Order!]!
  }

  type Mutation {
    # Auth
    register(input: CreateUserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    
    # User
    updateUser(input: UpdateUserInput!): User!
    verifyUser(id: ID!, status: VerificationStatus!): User!
    
    # Product
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: CreateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    
    # Order
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
    cancelOrder(id: ID!): Order!
  }
`;

export default typeDefs; 