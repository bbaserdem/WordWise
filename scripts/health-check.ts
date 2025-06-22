/**
 * @fileoverview Health check script for the WordWise application.
 *
 * This script performs comprehensive health checks on the application
 * environment, Firebase connectivity, and system resources.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { performHealthCheck, quickHealthCheck } from '@/lib/config';

/**
 * Display health check results in a formatted way.
 *
 * @param healthStatus - Health status to display
 * @since 1.0.0
 */
function displayHealthResults(healthStatus: any): void {
  console.log('\n🏥 Health Check Results');
  console.log('========================');
  console.log(`Overall Status: ${healthStatus.healthy ? '✅ Healthy' : '❌ Unhealthy'}`);
  console.log(`Environment: ${healthStatus.environment}`);
  console.log(`Timestamp: ${healthStatus.timestamp}`);
  
  if (healthStatus.summary) {
    console.log(`\nSummary:`);
    console.log(`  Total Components: ${healthStatus.summary.total}`);
    console.log(`  Healthy: ${healthStatus.summary.healthy} ✅`);
    console.log(`  Unhealthy: ${healthStatus.summary.unhealthy} ❌`);
  }
  
  if (healthStatus.components) {
    console.log(`\nComponent Details:`);
    healthStatus.components.forEach((component: any) => {
      const status = component.healthy ? '✅' : '❌';
      const responseTime = component.responseTime ? ` (${component.responseTime}ms)` : '';
      console.log(`  ${status} ${component.component}: ${component.message}${responseTime}`);
      
      if (component.error) {
        console.log(`    Error: ${component.error}`);
      }
      
      if (component.details) {
        Object.entries(component.details).forEach(([key, value]) => {
          console.log(`    ${key}: ${value}`);
        });
      }
    });
  }
}

/**
 * Main health check function.
 *
 * @since 1.0.0
 */
async function main(): Promise<void> {
  console.log('🔍 WordWise Health Check');
  console.log('========================\n');
  
  try {
    // Quick health check
    console.log('Performing quick health check...');
    const quickStatus = await quickHealthCheck();
    
    if (quickStatus.healthy) {
      console.log('✅ Quick health check passed');
      console.log(`   Message: ${quickStatus.message}`);
    } else {
      console.log('❌ Quick health check failed');
      console.log(`   Message: ${quickStatus.message}`);
    }
    
    console.log('\nPerforming detailed health check...');
    const detailedStatus = await performHealthCheck();
    
    displayHealthResults(detailedStatus);
    
    // Exit with appropriate code
    if (detailedStatus.healthy) {
      console.log('\n🎉 All health checks passed!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some health checks failed. Please review the details above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Health check failed with error:', error);
    process.exit(1);
  }
}

// Run the health check if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error during health check:', error);
    process.exit(1);
  });
} 