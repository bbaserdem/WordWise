/**
 * @fileoverview Version constants and utilities for the WordWise application.
 *
 * This file defines the application version, phase information, and utilities
 * for displaying version information throughout the application.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

/**
 * Application version information.
 *
 * Version format: X.Y.Z
 * - X: Major version (0 = pre-release, 1+ = production)
 * - Y: Phase number (current development phase)
 * - Z: Task number within the phase
 *
 * @since 1.0.0
 */
export const APP_VERSION = {
  /** Full version string */
  version: '0.2.1',
  /** Major version number */
  major: 0,
  /** Minor version number (phase) */
  minor: 2,
  /** Patch version number (task) */
  patch: 1,
  /** Build number (optional) */
  build: process.env.NEXT_PUBLIC_BUILD_NUMBER || 'dev',
  /** Build date */
  buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
  /** Git commit hash (optional) */
  commitHash: process.env.NEXT_PUBLIC_COMMIT_HASH || 'unknown',
} as const;

/**
 * Development phase information.
 *
 * @since 1.0.0
 */
export const PHASE_INFO = {
  /** Current phase number */
  current: 2,
  /** Current phase name */
  name: 'MVP - Core Writing Assistant',
  /** Current phase description */
  description: 'Real-time grammar and spell checking with confidence scores',
  /** Current task number */
  task: 1,
  /** Current task name */
  taskName: 'Real-Time Grammar & Spell Checking',
  /** Task description */
  taskDescription: 'Implement comprehensive writing assistance with real-time feedback and confidence scoring',
  /** Phase completion status */
  isComplete: false,
  /** Next phase information */
  nextPhase: {
    number: 2,
    name: 'Enhanced Writing Assistant',
    description: 'AI-powered suggestions and advanced features',
  },
} as const;

/**
 * Version comparison utilities.
 *
 * @since 1.0.0
 */
export const VERSION_UTILS = {
  /**
   * Check if current version is a pre-release.
   *
   * @returns True if version is pre-release (major = 0)
   * @since 1.0.0
   */
  isPreRelease: (): boolean => APP_VERSION.major === 0,

  /**
   * Check if current version is production ready.
   *
   * @returns True if version is production ready (major >= 1)
   * @since 1.0.0
   */
  isProductionReady: (): boolean => APP_VERSION.major >= 1,

  /**
   * Get version display string.
   *
   * @param includeBuild - Whether to include build information
   * @returns Formatted version string
   * @since 1.0.0
   */
  getDisplayVersion: (includeBuild: boolean = false): string => {
    const base = `v${APP_VERSION.version}`;
    if (includeBuild && APP_VERSION.build !== 'dev') {
      return `${base} (build ${APP_VERSION.build})`;
    }
    return base;
  },

  /**
   * Get phase display string.
   *
   * @returns Formatted phase string
   * @since 1.0.0
   */
  getPhaseDisplay: (): string => {
    return `Phase ${PHASE_INFO.current}.${PHASE_INFO.task} - ${PHASE_INFO.taskName}`;
  },

  /**
   * Get full version information for display.
   *
   * @returns Complete version information object
   * @since 1.0.0
   */
  getFullVersionInfo: () => ({
    version: APP_VERSION.version,
    phase: PHASE_INFO.current,
    task: PHASE_INFO.task,
    phaseName: PHASE_INFO.name,
    taskName: PHASE_INFO.taskName,
    isPreRelease: VERSION_UTILS.isPreRelease(),
    build: APP_VERSION.build,
    buildDate: APP_VERSION.buildDate,
    commitHash: APP_VERSION.commitHash,
  }),
} as const;

/**
 * Version badges and styling.
 *
 * @since 1.0.0
 */
export const VERSION_BADGES = {
  /**
   * Get version badge styling based on version type.
   *
   * @returns CSS classes for version badge
   * @since 1.0.0
   */
  getBadgeClasses: (): string => {
    if (VERSION_UTILS.isPreRelease()) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    if (VERSION_UTILS.isProductionReady()) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  },

  /**
   * Get version badge text.
   *
   * @returns Badge text
   * @since 1.0.0
   */
  getBadgeText: (): string => {
    if (VERSION_UTILS.isPreRelease()) {
      return 'Pre-release';
    }
    if (VERSION_UTILS.isProductionReady()) {
      return 'Production';
    }
    return 'Development';
  },
} as const;

/**
 * Environment-specific version information.
 *
 * @since 1.0.0
 */
export const ENV_VERSION = {
  /** Environment name */
  environment: process.env.NODE_ENV || 'development',
  /** Whether this is a development build */
  isDevelopment: process.env.NODE_ENV === 'development',
  /** Whether this is a production build */
  isProduction: process.env.NODE_ENV === 'production',
  /** Whether this is a test build */
  isTest: process.env.NODE_ENV === 'test',
  /** Firebase environment */
  firebaseEnv: process.env.FIREBASE_ENV || 'development',
} as const;

/**
 * Feature flags based on version.
 *
 * @since 1.0.0
 */
export const FEATURE_FLAGS = {
  /** Whether confidence scores are enabled */
  confidenceScores: true, // Enabled in 0.2.1
  /** Whether real-time grammar checking is enabled */
  realtimeGrammarChecking: true, // Enabled in 0.2.1
  /** Whether AI suggestions are enabled */
  aiSuggestions: false, // Will be enabled in Phase 2.2
  /** Whether advanced collaboration is enabled */
  advancedCollaboration: false, // Will be enabled in Phase 3
  /** Whether export to LaTeX is enabled */
  latexExport: false, // Will be enabled in Phase 2.3
} as const;

/**
 * Version history for reference.
 *
 * @since 1.0.0
 */
export const VERSION_HISTORY = [
  {
    version: '0.1.0',
    phase: 1,
    task: 0,
    name: 'Foundation',
    description: 'Basic setup and authentication',
    date: '2024-01-01',
    features: ['User authentication', 'Basic project management', 'Document creation'],
  },
  {
    version: '0.2.0',
    phase: 2,
    task: 0,
    name: 'MVP Setup',
    description: 'MVP foundation and basic writing editor',
    date: '2024-01-15',
    features: ['Writing editor', 'Basic grammar checking', 'Project organization'],
  },
  {
    version: '0.2.1',
    phase: 2,
    task: 1,
    name: 'Real-Time Grammar & Spell Checking',
    description: 'Enhanced grammar checking with confidence scores',
    date: '2024-01-20',
    features: ['Real-time grammar checking', 'Confidence scores', 'Visual suggestion system'],
  },
] as const;

/**
 * Get version information for a specific version.
 *
 * @param version - Version string to look up
 * @returns Version information or null if not found
 * @since 1.0.0
 */
export function getVersionInfo(version: string) {
  return VERSION_HISTORY.find(v => v.version === version) || null;
}

/**
 * Get current version information.
 *
 * @returns Current version information
 * @since 1.0.0
 */
export function getCurrentVersionInfo() {
  return getVersionInfo(APP_VERSION.version);
}

/**
 * Check if a feature is enabled in the current version.
 *
 * @param feature - Feature name to check
 * @returns True if feature is enabled
 * @since 1.0.0
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
} 