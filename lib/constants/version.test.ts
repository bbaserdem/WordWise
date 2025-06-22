/**
 * @fileoverview Tests for version constants and utilities.
 *
 * This file contains unit tests for the version system, including
 * version parsing, phase information, and utility functions.
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
  getVersionInfo,
  getCurrentVersionInfo,
  isFeatureEnabled,
} from './version';

describe('Version Constants', () => {
  describe('APP_VERSION', () => {
    it('should have correct version structure', () => {
      expect(APP_VERSION.version).toBe('0.2.1');
      expect(APP_VERSION.major).toBe(0);
      expect(APP_VERSION.minor).toBe(2);
      expect(APP_VERSION.patch).toBe(1);
    });

    it('should have build information', () => {
      expect(APP_VERSION.build).toBeDefined();
      expect(APP_VERSION.buildDate).toBeDefined();
      expect(APP_VERSION.commitHash).toBeDefined();
    });
  });

  describe('PHASE_INFO', () => {
    it('should have correct phase information', () => {
      expect(PHASE_INFO.current).toBe(2);
      expect(PHASE_INFO.task).toBe(1);
      expect(PHASE_INFO.name).toBe('MVP - Core Writing Assistant');
      expect(PHASE_INFO.taskName).toBe('Real-Time Grammar & Spell Checking');
    });

    it('should indicate phase is not complete', () => {
      expect(PHASE_INFO.isComplete).toBe(false);
    });
  });

  describe('VERSION_UTILS', () => {
    it('should correctly identify pre-release status', () => {
      expect(VERSION_UTILS.isPreRelease()).toBe(true);
    });

    it('should correctly identify production readiness', () => {
      expect(VERSION_UTILS.isProductionReady()).toBe(false);
    });

    it('should format display version correctly', () => {
      expect(VERSION_UTILS.getDisplayVersion()).toBe('v0.2.1');
      expect(VERSION_UTILS.getDisplayVersion(true)).toContain('v0.2.1');
    });

    it('should format phase display correctly', () => {
      expect(VERSION_UTILS.getPhaseDisplay()).toBe('Phase 2.1 - Real-Time Grammar & Spell Checking');
    });

    it('should return full version info', () => {
      const info = VERSION_UTILS.getFullVersionInfo();
      expect(info.version).toBe('0.2.1');
      expect(info.phase).toBe(2);
      expect(info.task).toBe(1);
      expect(info.isPreRelease).toBe(true);
    });
  });

  describe('VERSION_BADGES', () => {
    it('should return correct badge classes for pre-release', () => {
      const classes = VERSION_BADGES.getBadgeClasses();
      expect(classes).toContain('bg-yellow-100');
      expect(classes).toContain('text-yellow-800');
    });

    it('should return correct badge text for pre-release', () => {
      expect(VERSION_BADGES.getBadgeText()).toBe('Pre-release');
    });
  });

  describe('ENV_VERSION', () => {
    it('should have environment information', () => {
      expect(ENV_VERSION.environment).toBeDefined();
      expect(ENV_VERSION.isDevelopment).toBeDefined();
      expect(ENV_VERSION.isProduction).toBeDefined();
      expect(ENV_VERSION.isTest).toBeDefined();
    });
  });

  describe('FEATURE_FLAGS', () => {
    it('should have correct feature flags for current version', () => {
      expect(FEATURE_FLAGS.confidenceScores).toBe(true);
      expect(FEATURE_FLAGS.realtimeGrammarChecking).toBe(true);
      expect(FEATURE_FLAGS.aiSuggestions).toBe(false);
      expect(FEATURE_FLAGS.advancedCollaboration).toBe(false);
      expect(FEATURE_FLAGS.latexExport).toBe(false);
    });
  });

  describe('Version Info Functions', () => {
    it('should get version info for current version', () => {
      const info = getVersionInfo('0.2.1');
      expect(info).toBeDefined();
      expect(info?.version).toBe('0.2.1');
      expect(info?.phase).toBe(2);
      expect(info?.task).toBe(1);
    });

    it('should return null for non-existent version', () => {
      const info = getVersionInfo('999.999.999');
      expect(info).toBeNull();
    });

    it('should get current version info', () => {
      const info = getCurrentVersionInfo();
      expect(info).toBeDefined();
      expect(info?.version).toBe('0.2.1');
    });

    it('should check feature flags correctly', () => {
      expect(isFeatureEnabled('confidenceScores')).toBe(true);
      expect(isFeatureEnabled('aiSuggestions')).toBe(false);
    });
  });
}); 