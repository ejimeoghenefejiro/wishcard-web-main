# WishCard Web App

A responsive web application for creating AI-generated greeting cards. Built with Next.js 16, React 19, and Tailwind CSS.

## 🌐 Live Demo

**Web App**: https://3001-in5fypoi3ismwjf5dje32-d1a72f33.us2.manus.computer  
**Backend API**: https://3000-inn7pp81usvihey98q5f7-d3b0b107.us2.manus.computer

## ✨ Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **AI-Powered Card Generation**: Create unique, beautiful cards using Manus FORGE
- **Full Customization**: Choose fonts, colors, text positions, and effects
- **User Authentication**: Google OAuth integration
- **Subscription Management**: Free, Plus, and Pro tiers
- **Instant Sharing**: Download or share generated cards

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS 4
- **State Management**: React Query (TanStack Query)
- **Authentication**: Connected to existing backend OAuth system
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📁 Project Structure

```
wishcard-web/
├── app/
│   ├── page.tsx              # Home page with occasion selector
│   ├── create/page.tsx       # Card creation interface
│   ├── profile/page.tsx      # User profile and subscription
│   ├── oauth/callback/page.tsx # OAuth callback handler
│   ├── layout.tsx            # Root layout
│   ├── providers.tsx         # Client-side providers
│   └── globals.css           # Global styles
├── lib/
│   ├── api.ts                # Axios API client
│   ├── auth-context.tsx      # Authentication context
│   ├── card-generator.ts     # Card generation service
│   └── utils.ts              # Utility functions
└── .env.local                # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Access to the WishCard backend API

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The app will be available at `http://localhost:3001`

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://3000-inn7pp81usvihey98q5f7-d3b0b107.us2.manus.computer
```

## 🔗 Backend Integration

This web app connects to the existing WishCard backend for:

- User authentication (`/api/auth/*`)
- Card generation (`/api/generate-card`)
- Subscription management (`/api/payments/*`)
- User data (`/api/auth/me`)

## 📱 Responsive Design

Mobile-first approach with breakpoints:

- **Mobile** (< 640px): Single column, simplified UI
- **Tablet** (640px - 1024px): Two-column grids
- **Desktop** (> 1024px): Full multi-column layouts

## 🎨 Key Pages

### Home Page (`/`)
- Hero section with gradient background
- Occasion selector cards
- Features showcase
- Authentication buttons

### Create Card (`/create`)
- Customization form (message, recipient, sender)
- Style selection (Modern, Classic, Playful, Elegant, Minimalist)
- Font, color, position, and effect controls
- Real-time preview
- Download and share options

### Profile (`/profile`)
- User account information
- Subscription tier display
- Upgrade options
- Sign out

## 📦 Deployment

### Build for Production

```bash
pnpm build
pnpm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

## 🔧 Development Notes

- Runs on port 3001 (backend uses 3000)
- Uses HTTP-only cookies for authentication
- All API requests include `withCredentials: true`
- Image generation takes 5-10 seconds

## 🎯 Future Enhancements

- Card gallery page
- Social sharing with Open Graph
- PWA support
- Offline mode
- Card templates library
- Advanced customization

## 📄 License

Proprietary - WishCard 2026
