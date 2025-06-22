/**
 * @fileoverview Development environment setup script for WordWise.
 *
 * This script helps developers set up their local development environment
 * by checking dependencies, setting up Firebase emulators, and importing
 * test data.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Check if a command is available in the system.
 *
 * @param command - Command to check
 * @returns True if command is available
 * @since 1.0.0
 */
function isCommandAvailable(command: string): boolean {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if required environment variables are set.
 *
 * @returns True if all required variables are set
 * @since 1.0.0
 */
function checkEnvironmentVariables(): boolean {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  const optionalVars = [
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    'NEXT_PUBLIC_USE_AUTH_EMULATOR',
    'NEXT_PUBLIC_USE_FIRESTORE_EMULATOR',
    'NEXT_PUBLIC_USE_STORAGE_EMULATOR',
    'NEXT_PUBLIC_ENABLE_ANALYTICS',
    'NEXT_PUBLIC_ENABLE_ERROR_TRACKING',
    'NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING',
    'NEXT_PUBLIC_LOG_LEVEL',
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_VERSION',
  ];

  const missingRequired = requiredVars.filter(varName => !process.env[varName]);
  const missingOptional = optionalVars.filter(varName => !process.env[varName]);

  if (missingRequired.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingRequired.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease create a .env.local file with these variables.');
    return false;
  }

  if (missingOptional.length > 0) {
    console.warn('⚠️  Missing optional environment variables:');
    missingOptional.forEach(varName => console.warn(`   - ${varName}`));
    console.warn('\nThese variables will use default values.');
  }

  return true;
}

/**
 * Check if required dependencies are installed.
 *
 * @returns True if all dependencies are available
 * @since 1.0.0
 */
function checkDependencies(): boolean {
  const requiredCommands = ['node', 'npm', 'firebase'];
  const missingCommands = requiredCommands.filter(cmd => !isCommandAvailable(cmd));

  if (missingCommands.length > 0) {
    console.error('❌ Missing required commands:');
    missingCommands.forEach(cmd => console.error(`   - ${cmd}`));
    console.error('\nPlease install the missing dependencies.');
    return false;
  }

  return true;
}

/**
 * Check if required files exist.
 *
 * @returns True if all required files exist
 * @since 1.0.0
 */
function checkRequiredFiles(): boolean {
  const requiredFiles = [
    'package.json',
    'firebase.json',
    'firestore.rules',
    'firestore.indexes.json',
    '.env.local',
  ];

  const missingFiles = requiredFiles.filter(file => !existsSync(file));

  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    return false;
  }

  return true;
}

/**
 * Install project dependencies.
 *
 * @since 1.0.0
 */
function installDependencies(): void {
  console.log('📦 Installing dependencies...');
  try {
    execSync('pnpm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error);
    process.exit(1);
  }
}

/**
 * Set up Firebase emulators.
 *
 * @since 1.0.0
 */
function setupFirebaseEmulators(): void {
  console.log('🔥 Setting up Firebase emulators...');
  try {
    // Check if Firebase CLI is logged in
    execSync('firebase projects:list', { stdio: 'ignore' });
    console.log('✅ Firebase CLI is configured');
  } catch {
    console.log('⚠️  Firebase CLI not configured. Please run:');
    console.log('   firebase login');
    console.log('   firebase use --add');
  }
}

/**
 * Import test data.
 *
 * @since 1.0.0
 */
function importTestData(): void {
  console.log('📚 Importing test data...');
  try {
    execSync('npm run import:test-data', { stdio: 'inherit' });
    console.log('✅ Test data imported successfully');
  } catch (error) {
    console.error('❌ Failed to import test data:', error);
    console.log('You can import test data later with: npm run import:test-data');
  }
}

/**
 * Run type checking.
 *
 * @since 1.0.0
 */
function runTypeCheck(): void {
  console.log('🔍 Running type check...');
  try {
    execSync('npm run type-check', { stdio: 'inherit' });
    console.log('✅ Type check passed');
  } catch (error) {
    console.error('❌ Type check failed:', error);
    process.exit(1);
  }
}

/**
 * Run linting.
 *
 * @since 1.0.0
 */
function runLinting(): void {
  console.log('🧹 Running linting...');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('✅ Linting passed');
  } catch (error) {
    console.error('❌ Linting failed:', error);
    console.log('You can fix linting issues with: npm run lint:fix');
  }
}

/**
 * Validate environment configuration using the new validation system.
 *
 * @since 1.0.0
 */
async function validateEnvironmentConfiguration(): Promise<void> {
  console.log('🔍 Validating environment configuration...');
  try {
    const { validateEnvironmentVariables, getEnvironmentSummary } = await import('@/lib/config');
    
    const result = validateEnvironmentVariables();
    const summary = getEnvironmentSummary();
    
    if (result.success) {
      console.log('✅ Environment configuration is valid');
      console.log(`   Environment: ${summary.environment}`);
      console.log(`   Firebase: ${summary.firebase.isConfigured ? '✅' : '❌'}`);
      console.log(`   Emulators: Auth=${summary.emulators.auth ? '✅' : '❌'}, Firestore=${summary.emulators.firestore ? '✅' : '❌'}, Storage=${summary.emulators.storage ? '✅' : '❌'}`);
      console.log(`   Monitoring: Analytics=${summary.monitoring.analytics ? '✅' : '❌'}, ErrorTracking=${summary.monitoring.errorTracking ? '✅' : '❌'}, Performance=${summary.monitoring.performanceMonitoring ? '✅' : '❌'}`);
      console.log(`   Log Level: ${summary.monitoring.logLevel}`);
    } else {
      console.error('❌ Environment configuration validation failed:');
      if (result.error) {
        console.error(`   Message: ${result.error.message}`);
        if (result.error.missing.length > 0) {
          console.error(`   Missing: ${result.error.missing.join(', ')}`);
        }
        if (result.error.invalid.length > 0) {
          console.error(`   Invalid: ${result.error.invalid.join(', ')}`);
        }
      }
      console.error('\nPlease fix the environment configuration issues.');
    }
  } catch (error) {
    console.error('❌ Failed to validate environment configuration:', error);
  }
}

/**
 * Main setup function.
 *
 * @since 1.0.0
 */
async function main() {
  console.log('🚀 WordWise Development Environment Setup');
  console.log('==========================================\n');

  // Check prerequisites
  console.log('🔍 Checking prerequisites...');
  
  if (!checkDependencies()) {
    process.exit(1);
  }

  if (!checkRequiredFiles()) {
    process.exit(1);
  }

  if (!checkEnvironmentVariables()) {
    process.exit(1);
  }

  console.log('✅ All prerequisites met\n');

  // Install dependencies
  installDependencies();
  console.log('');

  // Set up Firebase
  setupFirebaseEmulators();
  console.log('');

  // Run checks
  runTypeCheck();
  console.log('');

  runLinting();
  console.log('');

  // Import test data
  importTestData();
  console.log('');

  // Validate environment configuration
  await validateEnvironmentConfiguration();
  console.log('');

  // Success message
  console.log('🎉 Development environment setup complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Start Firebase emulators: npm run emulators');
  console.log('3. Open http://localhost:3000 in your browser');
  console.log('');
  console.log('Useful commands:');
  console.log('- npm run dev          # Start development server');
  console.log('- npm run emulators    # Start Firebase emulators');
  console.log('- npm run build        # Build for production');
  console.log('- npm run test         # Run tests');
  console.log('- npm run lint:fix     # Fix linting issues');
}

// Run the setup if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as setupDev }; 