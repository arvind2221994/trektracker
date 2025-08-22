# TrekTracker - Personalized Trekking Recommendation Platform

## Overview

TrekTracker is a full-stack web application that provides personalized trekking recommendations based on user preferences, fitness levels, and experience. The platform allows users to discover treks worldwide, manage wishlists, create detailed trek plans, and receive customized recommendations through an intelligent matching system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight React router alternative)
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom color palette (forest green, sage, warm orange, slate gray, warm beige)
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod for validation and type safety

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript throughout the entire stack
- **API Design**: RESTful API with organized route handlers
- **Storage Interface**: Abstract storage layer with in-memory implementation for development
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot module replacement via Vite integration

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Development Storage**: In-memory storage implementation for rapid prototyping

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Authentication**: Server-side session-based authentication
- **User Management**: User profiles with detailed preferences for trek recommendations

### Data Models
- **Users**: Basic authentication and account management
- **User Profiles**: Comprehensive preference system (age, fitness, experience, climate preferences, travel radius)
- **Treks**: Detailed trek information (difficulty, duration, location, climate, elevation, requirements)
- **Wishlists**: User-specific trek collections
- **Trek Plans**: Detailed planning with timelines, checklists, and preparation guidance

### Recommendation Engine
- **Matching Algorithm**: Profile-based recommendation system considering user fitness level, experience, preferred durations, climate preferences, and travel radius
- **Search Functionality**: Multi-criteria search with filters for difficulty, duration, climate, country, and text search
- **Personalization**: Dynamic recommendations based on user profile completeness and preferences

### UI/UX Design Decisions
- **Design System**: Nature-inspired color palette reflecting outdoor adventure themes
- **Component Architecture**: Reusable component library with consistent styling patterns
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **User Experience**: Progressive disclosure with profile setup guiding new users to personalized recommendations

## External Dependencies

### Core Framework Dependencies
- **@vitejs/plugin-react**: React integration for Vite build system
- **wouter**: Lightweight routing library for React applications
- **@tanstack/react-query**: Server state management and caching

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for component styling
- **clsx**: Conditional className utility

### Database and Backend
- **drizzle-orm**: Type-safe PostgreSQL ORM
- **@neondatabase/serverless**: Neon Database serverless driver
- **connect-pg-simple**: PostgreSQL session store for Express
- **express**: Web application framework for Node.js

### Development and Build Tools
- **tsx**: TypeScript execution environment
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment

### Form and Validation
- **react-hook-form**: Performant forms library
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation

### Additional Utilities
- **date-fns**: Date manipulation and formatting
- **lucide-react**: Icon library with React components
- **embla-carousel-react**: Carousel component for image galleries
- **cmdk**: Command palette component for enhanced UX