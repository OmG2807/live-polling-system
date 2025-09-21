# Deployment Guide

## Frontend (Netlify) - ✅ Fixed

The Netlify build issue has been resolved. The configuration now properly installs dependencies before building.

### Netlify Configuration
- **Base Directory**: `client`
- **Publish Directory**: `client/build`
- **Build Command**: `npm install && npm run build`

### Environment Variables for Netlify
Set these in your Netlify dashboard under Site Settings > Environment Variables:

```
REACT_APP_SERVER_URL=https://your-server-url.herokuapp.com
```

## Backend Server Deployment

You'll need to deploy your server to a platform that supports Node.js and WebSockets. Here are the recommended options:

### Option 1: Heroku (Recommended)
1. Create a new Heroku app
2. Add a `Procfile` in the server directory:
   ```
   web: node index.js
   ```
3. Deploy using Heroku CLI or GitHub integration

### Option 2: Railway
1. Connect your GitHub repository
2. Set the root directory to `server`
3. Railway will automatically detect the Node.js app

### Option 3: Render
1. Create a new Web Service
2. Set the root directory to `server`
3. Use the build command: `npm install`
4. Use the start command: `npm start`

## Important Notes

1. **CORS Configuration**: Update the server's CORS settings to allow your Netlify domain
2. **Environment Variables**: Set the production server URL in Netlify's environment variables
3. **Socket.IO**: Ensure your hosting platform supports WebSockets (most modern platforms do)

## Testing the Deployment

1. Deploy the server first
2. Update the `REACT_APP_SERVER_URL` environment variable in Netlify
3. Redeploy the frontend
4. Test the connection between frontend and backend

## Current Status
- ✅ Netlify build configuration fixed
- ✅ Environment variable setup added
- ✅ Local build tested and working
- ⏳ Server deployment needed
- ⏳ Environment variables configuration needed
