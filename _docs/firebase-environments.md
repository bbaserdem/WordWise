# Firebase Multi-Environment Configuration

## Overview

WordWise now supports multiple Firebase environments (development and production) with automatic environment detection and deployment management. This setup provides better isolation between development and production data while maintaining a smooth development workflow.

## Environment Structure

### Firebase Projects

- **Development**: `wordwise-dev`
- **Production**: `wordwise-prod`

### Environment Detection

The system automatically detects the environment based on:

1. **FIREBASE_ENV** environment variable (highest priority)
2. **NODE_ENV** environment variable (fallback)
3. **Development** as default

## Configuration

### Environment Variables

The same environment variables are used for both environments, but the project ID is automatically selected based on the current environment:

```bash
# Required for both environments
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
FIREBASE_ENV=development  # or production
```

### Environment-Specific Defaults

The system automatically applies environment-specific defaults:

**Development:**
- Emulators enabled
- Analytics disabled
- Debug logging
- Error tracking enabled

**Production:**
- Emulators disabled
- Analytics enabled
- Warning logging
- Performance monitoring enabled

## Deployment Commands

### Quick Deployment

```bash
# Deploy to development (with build)
npm run deploy:dev

# Deploy to production (with build and confirmation)
npm run deploy:prod

# Deploy only hosting to development
npm run deploy:dev:hosting

# Deploy only hosting to production
npm run deploy:prod:hosting

# Deploy only Firestore rules to development
npm run deploy:dev:firestore

# Deploy only Firestore rules to production
npm run deploy:prod:firestore
```

### Advanced Deployment

```bash
# Manual deployment with custom options
tsx scripts/deploy.ts development hosting --skip-build
tsx scripts/deploy.ts production --skip-confirmation

# Direct Firebase CLI commands
npm run firebase:deploy:dev
npm run firebase:deploy:prod
npm run firebase:use:dev
npm run firebase:use:prod
```

### Legacy Commands (Backward Compatible)

```bash
# These still work but use the current environment
npm run firebase:deploy
npm run firebase:deploy:hosting
npm run firebase:deploy:firestore
```

## Validation and Setup

### Validate Configuration

```bash
# Comprehensive validation
npm run firebase:validate

# Environment validation
npm run validate-env

# Health check
npm run health-check
```

### Setup New Environment

1. **Create Firebase Projects:**
   ```bash
   # Create development project
   firebase projects:create wordwise-dev
   
   # Create production project
   firebase projects:create wordwise-prod
   ```

2. **Configure Projects:**
   ```bash
   # Add projects to Firebase CLI
   firebase use --add wordwise-dev
   firebase use --add wordwise-prod
   ```

3. **Enable Services:**
   - Authentication
   - Firestore Database
   - Storage
   - Hosting

4. **Configure Environment Variables:**
   ```bash
   # Copy your Firebase config to .env.local
   cp .env.example .env.local
   # Edit .env.local with your Firebase project settings
   ```

5. **Validate Setup:**
   ```bash
   npm run firebase:validate
   ```

## Development Workflow

### Local Development

```bash
# Start development with emulators
npm run dev
npm run emulators

# Import test data
npm run import:test-data
```

### Testing Deployment

```bash
# Test deployment to development
npm run deploy:dev

# Validate deployment
npm run health-check
```

### Production Deployment

```bash
# Deploy to production (requires confirmation)
npm run deploy:prod

# Or skip confirmation for CI/CD
NODE_ENV=production tsx scripts/deploy.ts production --skip-confirmation
```

## Environment-Specific Features

### Development Environment

- **Emulators**: All Firebase services run locally
- **Test Data**: Automatic import of sample data
- **Debug Mode**: Detailed logging and error tracking
- **Hot Reload**: Fast development iteration

### Production Environment

- **Live Services**: All Firebase services run in production
- **Optimized Build**: Production-optimized Next.js build
- **Analytics**: Firebase Analytics enabled
- **Performance Monitoring**: Firebase Performance enabled
- **Security**: Strict security rules enforced

## Troubleshooting

### Common Issues

1. **Environment Not Detected:**
   ```bash
   # Set explicit environment
   export FIREBASE_ENV=development
   npm run firebase:validate
   ```

2. **Project Not Found:**
   ```bash
   # List available projects
   npm run firebase:projects:list
   
   # Switch to correct project
   npm run firebase:use:dev
   ```

3. **Build Failures:**
   ```bash
   # Clean and rebuild
   rm -rf .next out
   npm run build
   npm run deploy:dev
   ```

4. **Deployment Failures:**
   ```bash
   # Validate configuration
   npm run firebase:validate
   
   # Check Firebase CLI login
   firebase login
   firebase projects:list
   ```

### Validation Commands

```bash
# Check environment configuration
npm run validate-env

# Check Firebase configuration
npm run firebase:validate

# Check application health
npm run health-check

# Check build status
npm run type-check
npm run lint
```

## Migration from Single Environment

If you're migrating from a single Firebase project setup:

1. **Backup Current Data:**
   ```bash
   # Export current data
   firebase firestore:export ./backup-data
   ```

2. **Create New Projects:**
   ```bash
   # Create development and production projects
   firebase projects:create wordwise-dev
   firebase projects:create wordwise-prod
   ```

3. **Update Configuration:**
   ```bash
   # Update environment variables
   # Set FIREBASE_ENV=development for local development
   ```

4. **Test New Setup:**
   ```bash
   # Validate new configuration
   npm run firebase:validate
   
   # Test deployment
   npm run deploy:dev
   ```

## Security Considerations

### Environment Isolation

- **Data Separation**: Development and production data are completely isolated
- **Access Control**: Different Firebase projects have separate access controls
- **Security Rules**: Environment-specific security rules can be applied

### Best Practices

1. **Never deploy development data to production**
2. **Use different API keys for each environment**
3. **Regularly backup production data**
4. **Test security rules in development before production**
5. **Use Firebase Security Rules for data protection**

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Development
        if: github.ref == 'refs/heads/develop'
        run: |
          export FIREBASE_ENV=development
          npm run deploy:dev -- --skip-confirmation
          
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: |
          export FIREBASE_ENV=production
          npm run deploy:prod -- --skip-confirmation
```

This multi-environment setup provides a robust foundation for development and production deployments while maintaining backward compatibility with existing workflows. 