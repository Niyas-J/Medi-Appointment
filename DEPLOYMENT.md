# 🚀 Deployment Guide - Futuristic Appointment Scheduler

This guide provides step-by-step instructions for deploying the application to various hosting platforms.

## 📋 Table of Contents
- [Heroku Deployment](#heroku-deployment)
- [Render Deployment](#render-deployment)
- [Vercel + Railway Deployment](#vercel--railway-deployment)
- [DigitalOcean Deployment](#digitalocean-deployment)
- [Environment Variables](#environment-variables)
- [Production Checklist](#production-checklist)

---

## 🟣 Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git initialized in project

### Backend Deployment

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set EMAIL_SERVICE=gmail
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASSWORD=your-app-password
   heroku config:set TWILIO_ACCOUNT_SID=your-twilio-sid
   heroku config:set TWILIO_AUTH_TOKEN=your-twilio-token
   heroku config:set TWILIO_PHONE_NUMBER=+1234567890
   heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Create Procfile** in `backend` folder:
   ```
   web: node server.js
   ```

5. **Deploy to Heroku**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

6. **Open Your App**
   ```bash
   heroku open
   ```

### Frontend Deployment

1. **Update API URL**
   
   Create `frontend/.env.production`:
   ```env
   REACT_APP_API_URL=https://your-app-name-backend.herokuapp.com/api
   ```

2. **Deploy to Vercel** (recommended for React)
   ```bash
   cd frontend
   npm install -g vercel
   vercel login
   vercel --prod
   ```

---

## 🟢 Render Deployment

Render is a modern alternative to Heroku with easier configuration.

### Backend on Render

1. **Create Account** at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select `backend` folder
   - Set build command: `npm install`
   - Set start command: `node server.js`

3. **Configure Environment Variables** in Render Dashboard:
   ```
   NODE_ENV=production
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   TWILIO_ACCOUNT_SID=your-sid
   TWILIO_AUTH_TOKEN=your-token
   TWILIO_PHONE_NUMBER=+1234567890
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

4. **Deploy** - Render will automatically deploy on push

### Frontend on Render

1. **Create New Static Site**
   - Connect repository
   - Select `frontend` folder
   - Set build command: `npm install && npm run build`
   - Set publish directory: `build`

2. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```

---

## 🔵 Vercel + Railway Deployment

Perfect combination: Vercel for frontend, Railway for backend.

### Backend on Railway

1. **Create Account** at [railway.app](https://railway.app)

2. **Create New Project**
   - Connect GitHub repo
   - Select `backend` folder
   - Railway auto-detects Node.js

3. **Add Environment Variables** in Railway Dashboard

4. **Generate Domain** in Railway settings

### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Set Environment Variable** in Vercel Dashboard:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

---

## 🔷 DigitalOcean Deployment

For full control with a VPS.

### 1. Create Droplet

1. Create Ubuntu 22.04 droplet
2. SSH into server:
   ```bash
   ssh root@your-server-ip
   ```

### 2. Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install nginx
apt install -y nginx

# Install PM2
npm install -g pm2
```

### 3. Setup Application

```bash
# Clone repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Setup backend
cd backend
npm install
```

### 4. Create .env File

```bash
nano .env
```

Add your environment variables.

### 5. Start Backend with PM2

```bash
pm2 start server.js --name appointment-backend
pm2 save
pm2 startup
```

### 6. Setup Nginx for Backend

```bash
nano /etc/nginx/sites-available/backend
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 7. Setup Frontend

```bash
cd ../frontend
npm install
npm run build
```

### 8. Setup Nginx for Frontend

```bash
nano /etc/nginx/sites-available/frontend
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/frontend/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 9. Setup SSL with Let's Encrypt

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## 🔐 Environment Variables

### Required Variables

#### Backend
```env
# Server
PORT=5000
NODE_ENV=production

# Database
DB_PATH=./database.sqlite

# Email (Required)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Frontend
FRONTEND_URL=https://your-frontend-url.com
```

#### Frontend
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Optional Variables

#### Backend (for SMS)
```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Backend (for Google Calendar - Future Feature)
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-backend-url.com/auth/google/callback
```

---

## ✅ Production Checklist

### Before Deployment

- [ ] Update all `localhost` URLs to production URLs
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for your frontend domain
- [ ] Test email notifications
- [ ] Test SMS notifications (if enabled)
- [ ] Verify database is accessible
- [ ] Check all environment variables are set
- [ ] Remove console.logs from production code
- [ ] Enable error logging
- [ ] Setup monitoring (e.g., PM2, New Relic)

### Security

- [ ] Use HTTPS for both frontend and backend
- [ ] Set secure CORS policy
- [ ] Use strong app passwords
- [ ] Never commit `.env` files
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Setup firewall rules
- [ ] Regular security updates

### Performance

- [ ] Enable gzip compression
- [ ] Optimize images and assets
- [ ] Setup CDN for static files
- [ ] Enable caching headers
- [ ] Database indexing
- [ ] Monitor response times

### Monitoring

- [ ] Setup error tracking (Sentry, LogRocket)
- [ ] Configure uptime monitoring
- [ ] Setup log aggregation
- [ ] Monitor database size
- [ ] Track notification delivery rates

---

## 🔧 Troubleshooting

### Common Issues

**502 Bad Gateway**
- Check if backend is running
- Verify port configuration
- Check nginx configuration

**CORS Errors**
- Add frontend URL to CORS whitelist
- Verify FRONTEND_URL environment variable
- Check credentials in CORS config

**Email Not Sending**
- Verify Gmail app password
- Check email service configuration
- Enable "Less secure app access" if needed

**Database Locked**
- SQLite doesn't support high concurrency
- Consider PostgreSQL for production
- Check file permissions

### Getting Help

1. Check application logs
2. Review environment variables
3. Test API endpoints individually
4. Check network connectivity
5. Review deployment platform logs

---

## 📊 Database Migration (SQLite to PostgreSQL)

For production, consider PostgreSQL:

1. **Install PostgreSQL adapter**
   ```bash
   npm install pg
   ```

2. **Update database.js** to use PostgreSQL

3. **Create PostgreSQL database** on your platform

4. **Update connection string** in environment variables

---

## 🎉 Post-Deployment

After successful deployment:

1. **Test all features** in production
2. **Monitor logs** for errors
3. **Setup automated backups**
4. **Configure alerts** for downtime
5. **Document your deployment**
6. **Share your app!** 🚀

---

**Need help?** Create an issue on GitHub or contact support.

**Happy Deploying! 🚀**

