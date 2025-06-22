/**
 * @fileoverview Test script to validate all three workflows.
 *
 * This script tests local development, development deployment,
 * and production deployment configurations.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { config } from 'dotenv';
import { 
  getCurrentFirebaseEnvironment, 
  getCurrentFirebaseProject, 
  getAllFirebaseProjects,
  validateFirebaseProjectConfig,
  type FirebaseEnvironment 
} from '../lib/firebase/environment';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

/**
 * Display colored output for better readability.
 *
 * @param message - Message to display
 * @param type - Type of message (success, error, warning, info)
 *
 * @since 1.0.0
 */
function displayMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
  const colors = {
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    info: '\x1b[36m',    // Cyan
    reset: '\x1b[0m'     // Reset
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  console.log(`${colors[type]}${icons[type]} ${message}${colors.reset}`);
}

/**
 * Display section header.
 *
 * @param title - Section title
 *
 * @since 1.0.0
 */
function displaySection(title: string): void {
  console.log('\n' + '='.repeat(60));
  console.log(`🧪 ${title}`);
  console.log('='.repeat(60));
}

/**
 * Test local development configuration.
 *
 * @since 1.0.0
 */
function testLocalDevelopment(): void {
  displaySection('Local Development Workflow Test');

  // Check emulator settings
  const emulatorSettings = {
    auth: process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === 'true',
    firestore: process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === 'true',
    storage: process.env.NEXT_PUBLIC_USE_STORAGE_EMULATOR === 'true',
  };

  console.log('Emulator Configuration:');
  console.log(`  Auth Emulator: ${emulatorSettings.auth ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`  Firestore Emulator: ${emulatorSettings.firestore ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`  Storage Emulator: ${emulatorSettings.storage ? '✅ Enabled' : '❌ Disabled'}`);

  if (emulatorSettings.auth && emulatorSettings.firestore && emulatorSettings.storage) {
    displayMessage('Local development configuration is correct', 'success');
    console.log('\nTo start local development:');
    console.log('  Terminal 1: npm run dev');
    console.log('  Terminal 2: npm run emulators');
    console.log('  URL: http://localhost:3000');
  } else {
    displayMessage('Local development configuration needs adjustment', 'warning');
    console.log('\nMake sure these are set in .env.local:');
    console.log('  NEXT_PUBLIC_USE_AUTH_EMULATOR=true');
    console.log('  NEXT_PUBLIC_USE_FIRESTORE_EMULATOR=true');
    console.log('  NEXT_PUBLIC_USE_STORAGE_EMULATOR=true');
  }
}

/**
 * Test development deployment configuration.
 *
 * @since 1.0.0
 */
function testDevelopmentDeployment(): void {
  displaySection('Development Deployment Workflow Test');

  // Set environment to development
  process.env.FIREBASE_ENV = 'development';
  
  const environment = getCurrentFirebaseEnvironment();
  const project = getCurrentFirebaseProject();
  const validation = validateFirebaseProjectConfig();

  console.log(`Environment: ${environment}`);
  console.log(`Project: ${project.projectId}`);
  console.log(`Is Default: ${project.isDefault ? 'Yes' : 'No'}`);

  if (validation.isValid) {
    displayMessage('Development deployment configuration is valid', 'success');
    console.log('\nTo deploy to development:');
    console.log('  npm run deploy:dev');
    console.log('  URL: https://wordwise-thesis-dev.web.app');
  } else {
    displayMessage('Development deployment configuration has issues', 'error');
    validation.errors.forEach(error => {
      console.log(`  ❌ ${error}`);
    });
  }
}

/**
 * Test production deployment configuration.
 *
 * @since 1.0.0
 */
function testProductionDeployment(): void {
  displaySection('Production Deployment Workflow Test');

  // Set environment to production
  process.env.FIREBASE_ENV = 'production';
  
  const environment = getCurrentFirebaseEnvironment();
  const project = getCurrentFirebaseProject();
  const validation = validateFirebaseProjectConfig();

  console.log(`Environment: ${environment}`);
  console.log(`Project: ${project.projectId}`);
  console.log(`Is Default: ${project.isDefault ? 'Yes' : 'No'}`);

  if (validation.isValid) {
    displayMessage('Production deployment configuration is valid', 'success');
    console.log('\nTo deploy to production:');
    console.log('  FIREBASE_ENV=production npm run deploy:prod');
    console.log('  URL: https://wordwise-thesis-prod.web.app');
  } else {
    displayMessage('Production deployment configuration has issues', 'error');
    validation.errors.forEach(error => {
      console.log(`  ❌ ${error}`);
    });
  }
}

/**
 * Display workflow summary.
 *
 * @since 1.0.0
 */
function displayWorkflowSummary(): void {
  displaySection('Workflow Summary');

  const allProjects = getAllFirebaseProjects();

  console.log('Available Workflows:');
  console.log('');
  console.log('1. 🏠 Local Development (Emulators)');
  console.log('   - Uses: Local Firebase emulators');
  console.log('   - Data: Stored locally in ./firebase-data/');
  console.log('   - URL: http://localhost:3000');
  console.log('   - Commands: npm run dev + npm run emulators');
  console.log('');
  console.log('2. 🧪 Development Deployment');
  console.log('   - Uses: wordwise-thesis-dev Firebase project');
  console.log('   - Data: Stored in Firebase development project');
  console.log('   - URL: https://wordwise-thesis-dev.web.app');
  console.log('   - Command: npm run deploy:dev');
  console.log('');
  console.log('3. 🚀 Production Deployment');
  console.log('   - Uses: wordwise-thesis-prod Firebase project');
  console.log('   - Data: Stored in Firebase production project');
  console.log('   - URL: https://wordwise-thesis-prod.web.app');
  console.log('   - Command: FIREBASE_ENV=production npm run deploy:prod');
  console.log('');
  console.log('Environment Variables:');
  console.log('  - Same Firebase config for all environments');
  console.log('  - Project ID switches automatically based on FIREBASE_ENV');
  console.log('  - Emulators enabled for local development');
  console.log('  - Production variables stored in CI/CD secrets');
}

/**
 * Main test function.
 *
 * @since 1.0.0
 */
async function main(): Promise<void> {
  console.log('🧪 Workflow Testing Suite');
  console.log('==========================');

  try {
    // Test all three workflows
    testLocalDevelopment();
    testDevelopmentDeployment();
    testProductionDeployment();
    displayWorkflowSummary();

    displayMessage('All workflow tests completed!', 'success');

  } catch (error) {
    displayMessage(`Testing failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    process.exit(1);
  }
}

// Run the tests
main().catch(error => {
  displayMessage(`Script execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
  process.exit(1);
}); 