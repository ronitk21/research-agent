# 🤖 AI Research Agent

An intelligent research automation system that uses AI to gather, analyze, and summarize information from multiple sources including Hacker News, News API, and Wikipedia.

## ✨ Features

- **🔍 Intelligent Topic Expansion**: Uses OpenAI to expand research topics into relevant keywords
- **📰 Multi-Source Data Collection**: Fetches articles from Hacker News, News API, and Wikipedia
- **🧠 AI-Powered Summarization**: Generates concise summaries and extracts key insights
- **⚡ Real-time Processing**: Background job processing with Redis queue management
- **📊 Smart Ranking**: Scores and ranks articles by relevance to the research topic
- **🔄 Progress Tracking**: Real-time job status updates and detailed logging
- **🎨 Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## 🏗️ Architecture



## 🚀 Quick Start

### Prerequisites

- **Bun** (recommended) or Node.js 18+
- **Docker** and **Docker Compose**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **News API Key** ([Get one here](https://newsapi.org/))

### 1. Clone and Setup

```bash
git clone https://github.com/ronitk21/research-agent.git
cd research-agent
```

### 2. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
nano .env
```

**Required Environment Variables:**
```env
# API Keys
OPENAI_API_KEY="sk-your-openai-api-key-here"
NEWS_API_KEY="your-news-api-key-here"

# Database
DATABASE_URL="postgresql://research_user:your_password@localhost:5432/research_agent"

# Redis
REDIS_URL="redis://localhost:6379"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Start with Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Manual Setup (Alternative)

#### Backend Setup
```bash
cd backend
bun install
bun run migrate:dev
bun run dev
```

#### Frontend Setup
```bash
cd frontend
bun install
bun run dev
```

#### Start Worker (in another terminal)
```bash
cd backend
bun run worker
```

### 5. Access the Application

- **Frontend**: https://research-agent-five.vercel.app/
- **Backend API**: http://localhost:3000

## 📖 API Documentation

### Research Endpoints

#### Start Research
```http
POST /api/v1/research
Content-Type: application/json

{
  "topic": "Artificial Intelligence in healthcare"
}
```

#### Get Research Status
```http
GET /api/v1/research/{id}
```

#### Get All Research Jobs
```http
GET /api/v1/research
```

### Response Format

```json
{
  "id": "clx123456789",
  "topic": "Artificial Intelligence in healthcare",
  "status": "COMPLETED",
  "result": [
    {
      "source": "newsapi",
      "title": "AI Revolutionizes Medical Diagnosis",
      "url": "https://example.com/article",
      "summary": "AI systems are transforming healthcare...",
      "keywords": ["AI", "healthcare", "diagnosis"]
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

## 🛠️ Development

### Project Structure

```
research-agent/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── lib/            # Utilities (Prisma, Queue)
│   │   ├── routes/         # API routes
│   │   └── workers/        # Background job processors
│   ├── prisma/             # Database schema and migrations
│   └── Dockerfile          # Container configuration
├── frontend/               # Next.js React application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable UI components
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
├── docker-compose.yml      # Multi-service orchestration
└── .env.example           # Environment template
```

### Available Scripts

#### Backend
```bash
bun run dev          # Start development server
bun run start        # Start production server
bun run worker       # Start background worker
bun run migrate:dev  # Run database migrations
bun run generate     # Generate Prisma client
```

#### Frontend
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
```

### Database Management

```bash
# Create and apply migrations
bun run migrate:dev

# Reset database (development only)
bunx prisma migrate reset

# View database in Prisma Studio
bunx prisma studio
```

## 🚀 Deployment

### Production Environment Variables

```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@host:5432/db"
REDIS_URL="redis://host:6379"
OPENAI_API_KEY="sk-..."
NEWS_API_KEY="..."
CORS_ORIGIN="https://your-frontend-domain.com"
NEXT_PUBLIC_API_URL="https://your-backend-domain.com"
```

### Docker Production Deployment

1. **Update docker-compose.yml** for production:
   - Use managed database services
   - Configure proper secrets management
   - Set up reverse proxy (nginx/traefik)

2. **Deploy with Docker Compose:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Platform-Specific Deployment

#### Railway
- Connect your GitHub repository
- Set environment variables in Railway dashboard
- Deploy backend and frontend as separate services

#### Vercel (Frontend)
- Connect GitHub repository
- Set build command: `cd frontend && bun run build`
- Set output directory: `frontend/.next`
- Configure environment variables

#### Render (Backend)
- Connect GitHub repository
- Set build command: `cd backend && bun install`
- Set start command: `cd backend && bun run start`
- Configure environment variables

## 🔧 Configuration

### Worker Configuration

The research worker processes jobs in the following sequence:

1. **Topic Expansion**: Uses OpenAI to generate related keywords
2. **Data Collection**: Fetches articles from multiple sources
3. **Deduplication**: Removes duplicate articles by URL
4. **Ranking**: Scores articles by relevance to the topic
5. **Summarization**: Generates AI summaries for top articles
6. **Storage**: Saves results to database

### Queue Management

```bash
# View queue status (requires Redis CLI)
redis-cli monitor

# Check worker logs
docker-compose logs worker
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.