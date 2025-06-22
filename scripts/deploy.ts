/**
 * @fileoverview Firebase deployment script with multi-environment support.
 *
 * This script handles deployment to different Firebase environments
 * (development and production) with proper validation, error handling,
 * and user confirmation for production deployments.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Set NODE_ENV first
(process.env as any).NODE_ENV = process.env.NODE_ENV || 'development';

import { execSync } from 'child_process';
import { config } from 'dotenv';
import { 
  getCurrentFirebaseEnvironment, 
  getCurrentFirebaseProject, 
  validateFirebaseProjectConfig,
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
  console.log(`🚀 ${title}`);
  console.log('='.repeat(50));
}

/**
 * Validate deployment prerequisites.
 *
 * @param environment - Target environment
 * @returns Validation result
 *
 * @since 1.0.0
 */
function validateDeploymentPrerequisites(environment: FirebaseEnvironment): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if we're building for production
  if (environment === 'production') {
    if (process.env.NODE_ENV !== 'production') {
      errors.push('Production deployment requires NODE_ENV=production');
    }
  }

  // Validate Firebase configuration
  const firebaseValidation = validateFirebaseProjectConfig();
  if (!firebaseValidation.isValid) {
    errors.push(...firebaseValidation.errors);
  }

  // Check if build directory exists (for hosting deployments)
  try {
    const fs = require('fs');
    if (!fs.existsSync('public')) {
      errors.push('Public directory "public" not found. This is required for hosting deployment.');
    }
  } catch (error) {
    errors.push('Unable to check public directory');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Build the application.
 *
 * @returns Success status
 *
 * @since 1.0.0
 */
function buildApplication(): boolean {
  try {
    displayMessage('Building application...', 'info');
    // For hosting-only deployments, we don't need to build Next.js
    // since we're using static files in the public directory
    displayMessage('Using static files from public directory', 'info');
    displayMessage('Application ready for deployment', 'success');
    return true;
  } catch (error) {
    displayMessage('Build failed', 'error');
    return false;
  }
}

/**
 * Confirm production deployment.
 *
 * @returns True if user confirms
 *
 * @since 1.0.0
 */
function confirmProductionDeployment(): Promise<boolean> {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<boolean>((resolve) => {
    console.log('\n⚠️  PRODUCTION DEPLOYMENT WARNING ⚠️');
    console.log('You are about to deploy to PRODUCTION environment.');
    console.log('This will affect live users and data.');
    console.log('');
    
    rl.question('Are you sure you want to continue? (yes/no): ', (answer: string) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Deploy to Firebase.
 *
 * @param environment - Target environment
 * @param target - Optional deployment target
 * @returns Success status
 *
 * @since 1.0.0
 */
function deployToFirebase(environment: FirebaseEnvironment, target?: string): boolean {
  try {
    const project = getCurrentFirebaseProject();
    const deployCommand = getFirebaseDeployCommand(target);
    
    displayMessage(`Deploying to ${environment} environment (${project.projectId})...`, 'info');
    
    if (target) {
      displayMessage(`Target: ${target}`, 'info');
    }
    
    execSync(deployCommand, { stdio: 'inherit' });
    
    displayMessage(`Deployment to ${environment} completed successfully`, 'success');
    return true;
  } catch (error) {
    displayMessage(`Deployment to ${environment} failed`, 'error');
    return false;
  }
}

/**
 * Display deployment summary.
 *
 * @param environment - Target environment
 * @param target - Optional deployment target
 *
 * @since 1.0.0
 */
function displayDeploymentSummary(environment: FirebaseEnvironment, target?: string): void {
  displaySection('Deployment Summary');
  
  const project = getCurrentFirebaseProject();
  
  console.log(`Environment: ${environment}`);
  console.log(`Project: ${project.projectId}`);
  if (target) {
    console.log(`Target: ${target}`);
  }
  
  // Display URLs based on environment
  if (environment === 'production') {
    console.log(`Production URL: https://${project.projectId}.web.app`);
  } else {
    console.log(`Development URL: https://${project.projectId}.web.app`);
  }
  
  console.log(`Firebase Console: https://console.firebase.google.com/project/${project.projectId}`);
}

/**
 * Main deployment function.
 *
 * @param environment - Target environment
 * @param target - Optional deployment target
 * @param skipBuild - Skip build step
 * @param skipConfirmation - Skip production confirmation
 *
 * @since 1.0.0
 */
async function main(
  environment: FirebaseEnvironment = 'development',
  target?: string,
  skipBuild: boolean = false,
  skipConfirmation: boolean = false
): Promise<void> {
  displaySection('Firebase Deployment');
  
  console.log(`Target Environment: ${environment}`);
  console.log(`Target Project: ${getCurrentFirebaseProject().projectId}`);
  if (target) {
    console.log(`Target Service: ${target}`);
  }

  try {
    // Validate prerequisites
    displayMessage('Validating deployment prerequisites...', 'info');
    const validation = validateDeploymentPrerequisites(environment);
    
    if (!validation.isValid) {
      displayMessage('Deployment prerequisites not met:', 'error');
      validation.errors.forEach(error => {
        console.log(`  ❌ ${error}`);
      });
      process.exit(1);
    }
    
    displayMessage('Deployment prerequisites validated', 'success');

    // Confirm production deployment
    if (environment === 'production' && !skipConfirmation) {
      const confirmed = await confirmProductionDeployment();
      if (!confirmed) {
        displayMessage('Deployment cancelled by user', 'warning');
        process.exit(0);
      }
    }

    // Build application (if not skipped)
    if (!skipBuild) {
      const buildSuccess = buildApplication();
      if (!buildSuccess) {
        process.exit(1);
      }
    } else {
      displayMessage('Build step skipped', 'info');
    }

    // Deploy to Firebase
    const deploySuccess = deployToFirebase(environment, target);
    if (!deploySuccess) {
      process.exit(1);
    }

    // Display summary
    displayDeploymentSummary(environment, target);

  } catch (error) {
    displayMessage(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const environment = (args[0] as FirebaseEnvironment) || 'development';
const target = args[1] || undefined;
const skipBuild = args.includes('--skip-build');
const skipConfirmation = args.includes('--skip-confirmation');

// Validate environment argument
if (environment !== 'development' && environment !== 'production') {
  displayMessage('Invalid environment. Use "development" or "production"', 'error');
  process.exit(1);
}

// Run deployment
main(environment, target, skipBuild, skipConfirmation).catch(error => {
  displayMessage(`Script execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
  process.exit(1);
}); 