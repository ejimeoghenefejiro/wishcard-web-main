# Deploy WishCard to Vercel (Integrated Frontend + Backend)

Your WishCard app is now a unified Next.js application with integrated API routes. Everything deploys together on Vercel!

## ✅ What's Integrated

- **Frontend**: React/Next.js web app
- **Backend API**: Next.js API routes
  - `/api/auth/*` - Auth0 authentication
  - `/api/generate-card` - AI card generation
  - `/api/stripe-webhook` - Stripe payment webhooks

## 🚀 Deploy to Vercel

### Step 1: Push to GitHub

Your code is already on GitHub at: https://github.com/ejimeoghenefejiro/wishcard-web

Just push the latest changes:
```bash
git add .
git commit -m "Integrate backend API routes"
git push
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import `ejimeoghenefejiro/wishcard-web`
4. Vercel will auto-detect Next.js
5. Click "Deploy"

### Step 3: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

#### Auth0 (Already configured)
```
NEXT_PUBLIC_AUTH0_DOMAIN=dev-qxy1h5yr5zhwve5o.us.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=1x1Kj4HUKbbHZ5d1i2ge2TK6kcgUyMWq
NEXT_PUBLIC_AUTH0_AUDIENCE=https://dev-qxy1h5yr5zhwve5o.us.auth0.com/api/v2/
AUTH0_CLIENT_SECRET=Fb5fyhWRlpox8jVksCNDbYLD3U5oj9amIEORFvj3rslNysVrjS1ueC
```

#### Manus FORGE API
```
MANUS_FORGE_API_KEY=your_manus_api_key_here
```

**Where to get it:**
- Contact Manus support or check your Manus dashboard
- This is required for AI card generation

#### Stripe (Optional - for payments)
```
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_FREE=price_...
STRIPE_PRICE_ID_PLUS=price_...
STRIPE_PRICE_ID_PRO=price_...
```

**Where to get them:**
1. Go to https://dashboard.stripe.com
2. Get API keys from Developers → API keys
3. Create products/prices for each tier
4. Configure webhook (see Step 5)

### Step 4: Update Auth0 Callback URLs

1. Go to Auth0 Dashboard: https://manage.auth0.com
2. Navigate to Applications → WishApp
3. Update these URLs (replace with your Vercel domain):

**Allowed Callback URLs:**
```
https://wishcard-web.vercel.app,
https://wishcard-web.vercel.app/api/auth/callback
```

**Allowed Logout URLs:**
```
https://wishcard-web.vercel.app
```

**Allowed Web Origins:**
```
https://wishcard-web.vercel.app
```

### Step 5: Configure Stripe Webhook (Optional)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://wishcard-web.vercel.app/api/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret
6. Add it to Vercel as `STRIPE_WEBHOOK_SECRET`
7. Redeploy on Vercel

## 🧪 Testing

After deployment:

1. **Visit your app**: https://wishcard-web.vercel.app
2. **Test sign in**: Click "Sign In" button
3. **Test card creation**: 
   - Select an occasion
   - Customize your card
   - Generate (requires MANUS_FORGE_API_KEY)

## 🔧 Troubleshooting

### Auth0 Login Doesn't Work
- Verify callback URLs in Auth0 match your Vercel domain exactly
- Check Auth0 environment variables in Vercel
- Look at browser console for errors

### Card Generation Fails
- Verify `MANUS_FORGE_API_KEY` is set in Vercel
- Check Vercel function logs for errors
- Ensure API key has sufficient credits

### Stripe Webhooks Not Working
- Verify webhook URL matches your Vercel domain
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Test webhook in Stripe Dashboard → Webhooks → Test

## 📝 Environment Variables Checklist

- [ ] `NEXT_PUBLIC_AUTH0_DOMAIN`
- [ ] `NEXT_PUBLIC_AUTH0_CLIENT_ID`
- [ ] `NEXT_PUBLIC_AUTH0_AUDIENCE`
- [ ] `AUTH0_CLIENT_SECRET`
- [ ] `MANUS_FORGE_API_KEY` (required for card generation)
- [ ] `STRIPE_SECRET_KEY` (optional, for payments)
- [ ] `STRIPE_WEBHOOK_SECRET` (optional, for payments)

## 🎉 Benefits of This Approach

✅ **Simpler**: One deployment instead of two
✅ **Faster**: No separate backend to manage
✅ **Cheaper**: Free on Vercel's hobby plan
✅ **Easier**: Automatic deployments from GitHub
✅ **Better**: No CORS issues, no cold starts

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Auth0 Next.js Guide](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

---

**Need Help?** Check Vercel function logs in your dashboard for detailed error messages.
