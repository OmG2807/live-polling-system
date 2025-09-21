# Deployment Guide

## Quick Deployment Options

### Option 1: Railway (Recommended for Full-Stack)

1. **Backend Deployment:**
   - Connect your GitHub repository to Railway
   - Set the root directory to `/server`
   - Add environment variables:
     - `PORT=5000`
     - `NODE_ENV=production`
   - Deploy

2. **Frontend Deployment:**
   - Build the React app: `cd client && npm run build`
   - Deploy the `build` folder to Netlify or Vercel
   - Update the Socket.io server URL in the client code to your Railway backend URL

### Option 2: Heroku

1. **Backend:**
   ```bash
   cd server
   heroku create your-app-name-backend
   git subtree push --prefix server heroku main
   ```

2. **Frontend:**
   ```bash
   cd client
   npm run build
   # Deploy build folder to Netlify/Vercel
   ```

### Option 3: Vercel (Frontend) + Railway (Backend)

1. **Backend on Railway:**
   - Deploy the `server` folder
   - Get the deployment URL

2. **Frontend on Vercel:**
   - Connect GitHub repository
   - Set build command: `cd client && npm run build`
   - Set output directory: `client/build`
   - Add environment variable: `REACT_APP_SERVER_URL=your-railway-backend-url`

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env)
```
REACT_APP_SERVER_URL=https://your-backend-domain.com
```

## Build Commands

```bash
# Install all dependencies
npm run install-all

# Build frontend
cd client && npm run build

# Start production server
cd server && npm start
```

## Testing Deployment

1. Deploy backend first
2. Update frontend with backend URL
3. Deploy frontend
4. Test with multiple browser tabs
5. Verify real-time functionality works across domains
