# Absence Report Auto-Print System (결석계 자동 출력 시스템)

## Overview

A web application for Korean middle schools (specifically 군산제일중학교) to automate the generation and printing of student absence report forms. The system allows staff to input absence data in a table format and generates official Korean absence report documents (질병결석신고서 for sick leave, 특별결석신고서 for special leave) ready for printing.

The application replaces a previous Python/Word-based workflow with a modern web interface that provides real-time preview and batch printing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query (@tanstack/react-query) for server state, React useState for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Korean typography (Noto Sans KR)
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Pattern**: REST API with `/api` prefix
- **Static Serving**: Express serves built frontend assets in production

### Data Storage
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Current Storage**: In-memory storage (MemStorage class) for development
- **Schema Location**: `shared/schema.ts` contains database table definitions
- **Migration**: Drizzle Kit for database migrations (`db:push` command)

### Key Design Decisions

1. **Monorepo Structure**: Client (`client/`) and server (`server/`) share types via `shared/` directory
2. **Korean Document Templates**: Two distinct form templates matching official Korean school document formats
3. **Print-Optimized CSS**: Special print styles with `@media print` rules for accurate document output
4. **No Authentication Yet**: Basic user schema exists but auth is not implemented
5. **Client-Side Form State**: Absence records are managed entirely in React state (not persisted to database yet)

### Component Architecture
- `AbsenceFormInput`: Table-based bulk data entry (Excel-like experience)
- `SickAbsenceForm` / `SpecialAbsenceForm`: Print-ready document templates
- `PreviewModal`: Document preview before printing
- `DatePicker`: Korean-localized date selection

## External Dependencies

### UI Framework
- **Radix UI**: Full suite of accessible UI primitives (dialogs, selects, popovers, etc.)
- **shadcn/ui**: Pre-styled component variants using Radix + Tailwind

### Database
- **PostgreSQL**: Target database (requires DATABASE_URL environment variable)
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: PostgreSQL session store (available but not actively used)

### Fonts & Styling
- **Google Fonts**: Noto Sans KR for Korean text display
- **Tailwind CSS**: Utility-first styling with custom design tokens

### Date Handling
- **date-fns**: Date formatting and manipulation with Korean locale support

### Development Tools
- **Vite**: Development server with HMR
- **Replit Plugins**: Error overlay, cartographer, dev banner for Replit environment

### Assets
- Stamp image (`삽입이미지_1765541637616.png`) for special absence form approval section
- Reference Python script showing original Word document generation logic