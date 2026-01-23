#!/bin/bash

# Production Deployment Script
# This script prepares and deploys the application to production

set -e  # Exit on error

echo "🚀 Starting Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if .env.production exists
if [ ! -f .env.production ]; then
    print_error ".env.production file not found!"
    echo "Please create .env.production with your production environment variables"
    echo "You can copy .env.example as a template"
    exit 1
fi

print_success ".env.production found"

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false
print_success "Dependencies installed"

# Run security audit
echo "🔒 Running security audit..."
if npm audit --audit-level=high; then
    print_success "No high-severity vulnerabilities found"
else
    print_warning "Security vulnerabilities detected. Review and fix before deploying."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build the application
echo "🏗️  Building application..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed!"
    exit 1
fi

# Check build size
BUILD_SIZE=$(du -sh .next | cut -f1)
print_success "Build size: $BUILD_SIZE"

# Ask for deployment platform
echo ""
echo "Select deployment platform:"
echo "1) Vercel"
echo "2) Railway"
echo "3) AWS EC2"
echo "4) Manual (just build)"
read -p "Enter choice (1-4): " PLATFORM

case $PLATFORM in
    1)
        echo "🚀 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
            print_success "Deployed to Vercel!"
        else
            print_error "Vercel CLI not installed. Install with: npm i -g vercel"
            exit 1
        fi
        ;;
    2)
        echo "🚀 Deploying to Railway..."
        if command -v railway &> /dev/null; then
            railway up
            print_success "Deployed to Railway!"
        else
            print_error "Railway CLI not installed. Install with: npm i -g @railway/cli"
            exit 1
        fi
        ;;
    3)
        echo "📋 AWS EC2 Deployment Instructions:"
        echo "1. SSH into your EC2 instance"
        echo "2. Pull latest code: git pull origin main"
        echo "3. Install dependencies: npm ci"
        echo "4. Build: npm run build"
        echo "5. Restart PM2: pm2 restart ecommerce"
        print_warning "Manual deployment required for AWS EC2"
        ;;
    4)
        print_success "Build completed. Ready for manual deployment."
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Post-deployment checks
echo ""
echo "📋 Post-Deployment Checklist:"
echo "- [ ] Verify site is accessible"
echo "- [ ] Test user registration"
echo "- [ ] Test user login"
echo "- [ ] Test product browsing"
echo "- [ ] Test cart functionality"
echo "- [ ] Test checkout flow"
echo "- [ ] Test admin dashboard"
echo "- [ ] Check SSL certificate"
echo "- [ ] Run Lighthouse audit"
echo "- [ ] Monitor error logs"

print_success "Deployment script completed!"
