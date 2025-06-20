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

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease create a .env.local file with these variables.');
    return false;
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
    execSync('npm install', { stdio: 'inherit' });
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