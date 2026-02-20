# WishCard Web App - Production Deployment

## 🚀 Deployment Information

**Production URL**: https://3002-in5fypoi3ismwjf5dje32-d1a72f33.us2.manus.computer  
**Backend API**: https://3000-inn7pp81usvihey98q5f7-d3b0b107.us2.manus.computer  
**Build Date**: February 18, 2026  
**Status**: ✅ Live and Running

## 📦 Build Configuration

- **Framework**: Next.js 16.1.6 with App Router
- **Node Version**: 22.13.0
- **Package Manager**: pnpm 9.12.0
- **Build Mode**: Production (optimized)
- **Rendering**: Dynamic server-side rendering (SSR)

## 🏗️ Build Process

```bash
# Production build
cd /home/ubuntu/wishcard-web
NODE_ENV=production pnpm build

# Start production server
NODE_ENV=production pnpm start -p 3002
```

## 📁 Production Files

- **Build Output**: `.next/` directory
- **Environment**: `.env.production`
- **Configuration**: `next.config.js`
- **Server Logs**: `/tmp/production.log`

## 🔧 Server Configuration

### Port Configuration
- **Production Port**: 3002
- **Backend API Port**: 3000
- **Mobile App Dev Port**: 8081

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://3000-inn7pp81usvihey98q5f7-d3b0b107.us2.manus.computer
NODE_ENV=production
```

## 🌐 Deployment Architecture

```
┌─────────────────────────────────────┐
│   WishCard Web App (Port 3002)     │
│   Next.js SSR + React 19            │
└──────────────┬──────────────────────┘
               │
               │ HTTPS API Calls
               │ (with credentials)
               ↓
┌─────────────────────────────────────┐
│   Backend API (Port 3000)           │
│   Express + tRPC + PostgreSQL       │
└─────────────────────────────────────┘
```

## ✅ Verified Features

- ✅ Home page loads with responsive design
- ✅ Occasion selector (Birthday, Love & Romance, Thank You, Celebration)
- ✅ Authentication flow (Sign In button)
- ✅ Mobile-responsive layout
- ✅ Features section displays correctly
- ✅ All routes accessible (/, /create, /profile, /oauth/callback)

## 🎨 Pages

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Home page with occasion selector | ✅ Live |
| `/create` | Card creation interface | ✅ Live |
| `/profile` | User profile and subscription | ✅ Live |
| `/oauth/callback` | OAuth authentication handler | ✅ Live |

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (single column)
- **Tablet**: 640px - 1024px (two columns)
- **Desktop**: > 1024px (multi-column)

## 🔒 Security

- HTTP-only cookies for authentication
- CORS enabled for backend API
- Environment variables for sensitive config
- Dynamic rendering (no static HTML exposure)

## 🚀 Deployment to External Hosting

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

**Environment Variables to Set:**
- `NEXT_PUBLIC_API_URL`: Your production backend URL

### Option 2: Docker

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3002
CMD ["pnpm", "start", "-p", "3002"]
```

### Option 3: PM2 (Current Setup)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start "pnpm start -p 3002" --name wishcard-web

# Save PM2 config
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

## 📊 Performance

- **Build Time**: ~3.3s (Turbopack)
- **Server Start**: ~277ms
- **Bundle Size**: Optimized with tree-shaking
- **Image Optimization**: Next.js Image component

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:3002 | xargs kill -9
```

### Build Errors
```bash
rm -rf .next
pnpm build
```

### Server Not Starting
```bash
# Check logs
tail -50 /tmp/production.log

# Verify Node version
node --version  # Should be 22.x
```

## 📝 Maintenance

### Update Dependencies
```bash
pnpm update
pnpm audit fix
```

### Rebuild
```bash
pnpm build
pm2 restart wishcard-web
```

### View Logs
```bash
tail -f /tmp/production.log
```

## 🔗 Related Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Backend API Documentation](../wishcard-app/server/README.md)
- [Mobile App](../wishcard-app/README.md)

## 📞 Support

For deployment issues or questions, refer to the main README.md or contact the development team.

---

**Last Updated**: February 18, 2026  
**Deployment Status**: ✅ Production Ready
