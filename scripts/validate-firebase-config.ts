/**
 * @fileoverview Firebase configuration validation script.
 *
 * This script validates the Firebase configuration for different environments
 * and provides helpful feedback about the setup. It checks environment variables,
 * project configurations, and provides deployment guidance.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Set NODE_ENV first
(process.env as any).NODE_ENV = process.env.NODE_ENV || 'development';

import { config } from 'dotenv';
import { 
  getCurrentFirebaseEnvironment, 
  getCurrentFirebaseProject, 
  getAllFirebaseProjects,
  validateFirebaseProjectConfig,
  getFirebaseProjectCommand,
  getFirebaseDeployCommand,
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
  console.log('\n' + '='.repeat(50));
  console.log(`📋 ${title}`);
  console.log('='.repeat(50));
}

/**
 * Validate environment variables.
 *
 * @returns Validation result
 *
 * @since 1.0.0
 */
function validateEnvironmentVariables(): {
  isValid: boolean;
  missing: string[];
  present: string[];
} {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  const optionalVars = [
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    'NEXT_PUBLIC_USE_AUTH_EMULATOR',
    'NEXT_PUBLIC_USE_FIRESTORE_EMULATOR',
    'NEXT_PUBLIC_USE_STORAGE_EMULATOR',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  const present = requiredVars.filter(varName => process.env[varName]);

  return {
    isValid: missing.length === 0,
    missing,
    present,
  };
}

/**
 * Display Firebase project information.
 *
 * @since 1.0.0
 */
function displayProjectInfo(): void {
  displaySection('Firebase Project Configuration');

  const allProjects = getAllFirebaseProjects();
  const currentEnv = getCurrentFirebaseEnvironment();
  const currentProject = getCurrentFirebaseProject();

  console.log(`Current Environment: ${currentEnv}`);
  console.log(`Current Project: ${currentProject.projectId}`);
  console.log(`Is Default: ${currentProject.isDefault ? 'Yes' : 'No'}`);

  console.log('\nAvailable Projects:');
  Object.entries(allProjects).forEach(([env, project]) => {
    const isCurrent = env === currentEnv;
    const status = isCurrent ? ' (current)' : '';
    console.log(`  ${env}: ${project.projectId}${status}`);
  });
}

/**
 * Display environment variable status.
 *
 * @since 1.0.0
 */
function displayEnvironmentVariables(): void {
  displaySection('Environment Variables');

  const validation = validateEnvironmentVariables();

  if (validation.isValid) {
    displayMessage('All required environment variables are set', 'success');
  } else {
    displayMessage('Missing required environment variables', 'error');
    validation.missing.forEach(varName => {
      console.log(`  ❌ ${varName}`);
    });
  }

  console.log('\nPresent Variables:');
  validation.present.forEach(varName => {
    const value = process.env[varName];
    const maskedValue = value ? `${value.substring(0, 8)}...` : 'undefined';
    console.log(`  ✅ ${varName}: ${maskedValue}`);
  });

  // Check optional variables
  const optionalVars = [
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    'NEXT_PUBLIC_USE_AUTH_EMULATOR',
    'NEXT_PUBLIC_USE_FIRESTORE_EMULATOR',
    'NEXT_PUBLIC_USE_STORAGE_EMULATOR',
  ];

  console.log('\nOptional Variables:');
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`  ℹ️  ${varName}: ${value}`);
    } else {
      console.log(`  ⚪ ${varName}: not set (will use default)`);
    }
  });
}

/**
 * Display Firebase configuration validation.
 *
 * @since 1.0.0
 */
function displayFirebaseValidation(): void {
  displaySection('Firebase Configuration Validation');

  const validation = validateFirebaseProjectConfig();

  if (validation.isValid) {
    displayMessage('Firebase configuration is valid', 'success');
    console.log(`  Environment: ${validation.environment}`);
    console.log(`  Project: ${validation.project.projectId}`);
  } else {
    displayMessage('Firebase configuration has issues', 'error');
    validation.errors.forEach(error => {
      console.log(`  ❌ ${error}`);
    });
  }
}

/**
 * Display deployment guidance.
 *
 * @since 1.0.0
 */
function displayDeploymentGuidance(): void {
  displaySection('Deployment Commands');

  const currentProject = getCurrentFirebaseProject();
  const currentEnv = getCurrentFirebaseEnvironment();

  console.log(`Current Environment: ${currentEnv}`);
  console.log(`Current Project: ${currentProject.projectId}`);

  console.log('\nAvailable Commands:');
  console.log('  Development:');
  console.log(`    npm run firebase:deploy:dev`);
  console.log(`    npm run firebase:deploy:dev:hosting`);
  console.log(`    npm run firebase:deploy:dev:firestore`);

  console.log('\n  Production:');
  console.log(`    npm run firebase:deploy:prod`);
  console.log(`    npm run firebase:deploy:prod:hosting`);
  console.log(`    npm run firebase:deploy:prod:firestore`);

  console.log('\n  Project Selection:');
  console.log(`    npm run firebase:use:dev`);
  console.log(`    npm run firebase:use:prod`);

  console.log('\n  Manual Commands:');
  console.log(`    ${getFirebaseProjectCommand()}`);
  console.log(`    ${getFirebaseDeployCommand()}`);
  console.log(`    ${getFirebaseDeployCommand('hosting')}`);
  console.log(`    ${getFirebaseDeployCommand('firestore')}`);
}

/**
 * Display setup recommendations.
 *
 * @since 1.0.0
 */
function displaySetupRecommendations(): void {
  displaySection('Setup Recommendations');

  const envValidation = validateEnvironmentVariables();
  const firebaseValidation = validateFirebaseProjectConfig();

  if (!envValidation.isValid) {
    displayMessage('Environment Setup Required', 'warning');
    console.log('1. Create .env.local file with required Firebase variables');
    console.log('2. Set up Firebase projects: wordwise-dev and wordwise-prod');
    console.log('3. Configure Firebase CLI with project access');
  }

  if (!firebaseValidation.isValid) {
    displayMessage('Firebase Setup Required', 'warning');
    console.log('1. Create Firebase projects in Firebase Console');
    console.log('2. Enable required services (Auth, Firestore, Storage)');
    console.log('3. Configure security rules');
    console.log('4. Set up hosting configuration');
  }

  if (envValidation.isValid && firebaseValidation.isValid) {
    displayMessage('Setup Complete - Ready for Deployment', 'success');
    console.log('✅ All configurations are valid');
    console.log('✅ Environment variables are set');
    console.log('✅ Firebase projects are configured');
  }
}

/**
 * Main validation function.
 *
 * @since 1.0.0
 */
async function main(): Promise<void> {
  console.log('🔥 Firebase Configuration Validator');
  console.log('=====================================');

  try {
    // Display current environment information
    displayProjectInfo();

    // Validate environment variables
    displayEnvironmentVariables();

    // Validate Firebase configuration
    displayFirebaseValidation();

    // Display deployment guidance
    displayDeploymentGuidance();

    // Display setup recommendations
    displaySetupRecommendations();

    // Summary
    const envValidation = validateEnvironmentVariables();
    const firebaseValidation = validateFirebaseProjectConfig();

    displaySection('Summary');

    if (envValidation.isValid && firebaseValidation.isValid) {
      displayMessage('All validations passed! Your Firebase configuration is ready.', 'success');
      process.exit(0);
    } else {
      displayMessage('Some validations failed. Please review the issues above.', 'error');
      process.exit(1);
    }

  } catch (error) {
    displayMessage(`Validation failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    process.exit(1);
  }
}

// Run the validation
main().catch(error => {
  displayMessage(`Script execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
  process.exit(1);
}); 