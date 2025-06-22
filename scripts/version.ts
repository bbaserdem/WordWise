#!/usr/bin/env tsx

/**
 * @fileoverview Version management script for the WordWise application.
 *
 * This script provides utilities for displaying version information,
 * checking version status, and managing version updates.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import {
  APP_VERSION,
  PHASE_INFO,
  VERSION_UTILS,
  VERSION_BADGES,
  ENV_VERSION,
  FEATURE_FLAGS,
  getCurrentVersionInfo,
  VERSION_HISTORY,
} from '../lib/constants/version';

/**
 * Display current version information.
 *
 * @since 1.0.0
 */
function displayCurrentVersion() {
  const currentInfo = getCurrentVersionInfo();
  
  console.log('\n🚀 WordWise Version Information\n');
  console.log(`📦 Version: ${VERSION_UTILS.getDisplayVersion(true)}`);
  console.log(`🎯 Phase: ${VERSION_UTILS.getPhaseDisplay()}`);
  console.log(`🏷️  Status: ${VERSION_BADGES.getBadgeText()}`);
  console.log(`🌍 Environment: ${ENV_VERSION.environment}`);
  console.log(`🔥 Firebase: ${ENV_VERSION.firebaseEnv}`);
  
  if (currentInfo) {
    console.log(`\n📝 Description: ${currentInfo.description}`);
    console.log(`📅 Date: ${currentInfo.date}`);
    console.log('\n✨ Features:');
    currentInfo.features.forEach(feature => {
      console.log(`   • ${feature}`);
    });
  }
  
  console.log('\n🔧 Feature Flags:');
  Object.entries(FEATURE_FLAGS).forEach(([feature, enabled]) => {
    const status = enabled ? '✅' : '❌';
    console.log(`   ${status} ${feature}`);
  });
}

/**
 * Display version history.
 *
 * @since 1.0.0
 */
function displayVersionHistory() {
  console.log('\n📚 Version History\n');
  
  VERSION_HISTORY.forEach((version, index) => {
    const isCurrent = version.version === APP_VERSION.version;
    const prefix = isCurrent ? '🟢' : '⚪';
    
    console.log(`${prefix} ${version.version} - ${version.name}`);
    console.log(`   Phase ${version.phase}.${version.task} - ${version.description}`);
    console.log(`   Date: ${version.date}`);
    
    if (version.features.length > 0) {
      console.log('   Features:');
      version.features.forEach(feature => {
        console.log(`     • ${feature}`);
      });
    }
    
    if (index < VERSION_HISTORY.length - 1) {
      console.log('');
    }
  });
}

/**
 * Display environment information.
 *
 * @since 1.0.0
 */
function displayEnvironmentInfo() {
  console.log('\n🌍 Environment Information\n');
  console.log(`Node Environment: ${ENV_VERSION.environment}`);
  console.log(`Firebase Environment: ${ENV_VERSION.firebaseEnv}`);
  console.log(`Is Development: ${ENV_VERSION.isDevelopment}`);
  console.log(`Is Production: ${ENV_VERSION.isProduction}`);
  console.log(`Is Test: ${ENV_VERSION.isTest}`);
  console.log(`Build Number: ${APP_VERSION.build}`);
  console.log(`Build Date: ${new Date(APP_VERSION.buildDate).toLocaleString()}`);
  console.log(`Commit Hash: ${APP_VERSION.commitHash}`);
}

/**
 * Check version status and provide recommendations.
 *
 * @since 1.0.0
 */
function checkVersionStatus() {
  console.log('\n🔍 Version Status Check\n');
  
  const isPreRelease = VERSION_UTILS.isPreRelease();
  const isProductionReady = VERSION_UTILS.isProductionReady();
  
  if (isPreRelease) {
    console.log('⚠️  This is a pre-release version (major = 0)');
    console.log('   • Not ready for production deployment');
    console.log('   • Still in active development');
    console.log('   • Features may be incomplete or unstable');
  }
  
  if (isProductionReady) {
    console.log('✅ This version is production ready (major >= 1)');
    console.log('   • Safe for production deployment');
    console.log('   • All features are stable');
    console.log('   • Ready for public release');
  }
  
  console.log(`\n📊 Current Progress:`);
  console.log(`   • Phase: ${PHASE_INFO.current}/${PHASE_INFO.isComplete ? 'Complete' : 'In Progress'}`);
  console.log(`   • Task: ${PHASE_INFO.task}`);
  console.log(`   • Next Phase: ${PHASE_INFO.nextPhase.number} - ${PHASE_INFO.nextPhase.name}`);
}

/**
 * Main function to handle command line arguments.
 *
 * @since 1.0.0
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'current';
  
  switch (command) {
    case 'current':
    case 'info':
      displayCurrentVersion();
      break;
      
    case 'history':
      displayVersionHistory();
      break;
      
    case 'env':
    case 'environment':
      displayEnvironmentInfo();
      break;
      
    case 'status':
    case 'check':
      checkVersionStatus();
      break;
      
    case 'all':
      displayCurrentVersion();
      displayVersionHistory();
      displayEnvironmentInfo();
      checkVersionStatus();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      console.log('\n📖 WordWise Version Management Script\n');
      console.log('Usage: npm run version [command]\n');
      console.log('Commands:');
      console.log('  current, info    - Display current version information');
      console.log('  history          - Display version history');
      console.log('  env, environment - Display environment information');
      console.log('  status, check    - Check version status and recommendations');
      console.log('  all              - Display all information');
      console.log('  help, --help, -h - Show this help message');
      break;
      
    default:
      console.log(`❌ Unknown command: ${command}`);
      console.log('Run "npm run version help" for available commands');
      process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
} 