# B2B FMCG E-commerce Platform

A modern B2B e-commerce platform built for FMCG (Fast-Moving Consumer Goods) businesses, targeting shop owners and retailers. Built with Next.js, TypeScript, and a powerful GraphQL API.

## Tech Stack

### Frontend
- Next.js 14 (React Framework)
- TypeScript
- Tailwind CSS
- Apollo Client (GraphQL)
- HeadlessUI & HeroIcons
- Framer Motion
- React Hook Form with Zod

### Backend
- Node.js
- Express.js
- GraphQL
- MongoDB with Mongoose
- JWT Authentication

## Features

- Modern, responsive UI optimized for B2B customers
- Secure authentication and authorization
- Product catalog with advanced filtering and search
- Order management system
- Real-time inventory tracking
- Bulk ordering capabilities
- Analytics dashboard
- Customer account management

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_API_URL=your_api_url
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── lib/             # Utility functions and configurations
├── models/          # MongoDB models
├── graphql/         # GraphQL schemas and resolvers
├── hooks/           # Custom React hooks
├── styles/          # Global styles and Tailwind config
└── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
