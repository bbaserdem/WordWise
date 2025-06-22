/**
 * @fileoverview Version display component for the WordWise application.
 *
 * This component displays the current application version, phase information,
 * and build details in a user-friendly format throughout the application.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, GitBranch, Calendar, Hash } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import {
  APP_VERSION,
  PHASE_INFO,
  VERSION_UTILS,
  VERSION_BADGES,
  ENV_VERSION,
  getCurrentVersionInfo,
} from '@/lib/constants/version';

/**
 * Version display component props interface.
 *
 * @since 1.0.0
 */
interface VersionDisplayProps {
  /** Display mode for the version information */
  mode?: 'compact' | 'detailed' | 'full';
  /** Whether to show the component */
  show?: boolean;
  /** Whether to show in development mode only */
  devOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Position of the component */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline';
  /** Whether to show build information */
  showBuild?: boolean;
  /** Whether to show phase information */
  showPhase?: boolean;
}

/**
 * Version display component.
 *
 * This component displays the current application version, phase information,
 * and build details in various formats depending on the mode and context.
 *
 * @param mode - Display mode for the version information
 * @param show - Whether to show the component
 * @param devOnly - Whether to show in development mode only
 * @param className - Additional CSS classes
 * @param position - Position of the component
 * @param showBuild - Whether to show build information
 * @param showPhase - Whether to show phase information
 * @returns The version display component
 *
 * @example
 * ```tsx
 * <VersionDisplay mode="compact" position="bottom-right" />
 * <VersionDisplay mode="detailed" showPhase={true} />
 * ```
 *
 * @since 1.0.0
 */
export function VersionDisplay({
  mode = 'compact',
  show = true,
  devOnly = false,
  className,
  position = 'inline',
  showBuild = false,
  showPhase = false,
}: VersionDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentVersionInfo = getCurrentVersionInfo();

  // Don't render if not showing or if dev-only and not in development
  if (!show || (devOnly && !ENV_VERSION.isDevelopment)) {
    return null;
  }

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'fixed top-4 left-4 z-50';
      case 'top-right':
        return 'fixed top-4 right-4 z-50';
      case 'bottom-left':
        return 'fixed bottom-4 left-4 z-50';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50';
      case 'inline':
      default:
        return '';
    }
  };

  const renderCompact = () => (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-text-secondary">
        {VERSION_UTILS.getDisplayVersion(showBuild)}
      </span>
      <div
        className={cn(
          'px-2 py-0.5 text-xs rounded-full border',
          VERSION_BADGES.getBadgeClasses()
        )}
      >
        {VERSION_BADGES.getBadgeText()}
      </div>
    </div>
  );

  const renderDetailed = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-text-primary">
            {VERSION_UTILS.getDisplayVersion(showBuild)}
          </span>
          <div
            className={cn(
              'px-2 py-0.5 text-xs rounded-full border',
              VERSION_BADGES.getBadgeClasses()
            )}
          >
            {VERSION_BADGES.getBadgeText()}
          </div>
        </div>
        <button
          onClick={toggleExpanded}
          className="text-text-secondary hover:text-text-primary transition-colors"
          aria-label={isExpanded ? 'Collapse version details' : 'Expand version details'}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {showPhase && (
        <div className="text-xs text-text-secondary">
          <div className="flex items-center space-x-1">
            <Info className="w-3 h-3" />
            <span>{VERSION_UTILS.getPhaseDisplay()}</span>
          </div>
          {currentVersionInfo && (
            <p className="mt-1 text-xs text-text-tertiary">
              {currentVersionInfo.description}
            </p>
          )}
        </div>
      )}

      {isExpanded && (
        <div className="pt-2 border-t border-primary-200 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-text-secondary">
            <GitBranch className="w-3 h-3" />
            <span>Environment: {ENV_VERSION.environment}</span>
          </div>
          {APP_VERSION.build !== 'dev' && (
            <div className="flex items-center space-x-2 text-xs text-text-secondary">
              <Hash className="w-3 h-3" />
              <span>Build: {APP_VERSION.build}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-xs text-text-secondary">
            <Calendar className="w-3 h-3" />
            <span>Built: {new Date(APP_VERSION.buildDate).toLocaleDateString()}</span>
          </div>
          {currentVersionInfo && (
            <div className="pt-1">
              <p className="text-xs font-medium text-text-secondary mb-1">Features:</p>
              <ul className="text-xs text-text-tertiary space-y-0.5">
                {currentVersionInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-1">
                    <span className="w-1 h-1 bg-primary-400 rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderFull = () => (
    <div className="bg-background-primary border border-primary-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Version Information</h3>
          <div
            className={cn(
              'px-2 py-1 text-xs rounded-full border',
              VERSION_BADGES.getBadgeClasses()
            )}
          >
            {VERSION_BADGES.getBadgeText()}
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-lg font-bold text-text-primary">
              {VERSION_UTILS.getDisplayVersion(true)}
            </p>
            <p className="text-xs text-text-secondary">
              {VERSION_UTILS.getPhaseDisplay()}
            </p>
          </div>

          {currentVersionInfo && (
            <div>
              <p className="text-sm text-text-secondary mb-2">
                {currentVersionInfo.description}
              </p>
              <div>
                <p className="text-xs font-medium text-text-secondary mb-1">Features:</p>
                <ul className="text-xs text-text-tertiary space-y-1">
                  {currentVersionInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-primary-200 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1 text-text-secondary">
                <GitBranch className="w-3 h-3" />
                <span>{ENV_VERSION.environment}</span>
              </div>
              <div className="flex items-center space-x-1 text-text-secondary">
                <Calendar className="w-3 h-3" />
                <span>{new Date(APP_VERSION.buildDate).toLocaleDateString()}</span>
              </div>
            </div>
            {APP_VERSION.build !== 'dev' && (
              <div className="flex items-center space-x-1 text-xs text-text-secondary">
                <Hash className="w-3 h-3" />
                <span>Build {APP_VERSION.build}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (mode) {
      case 'compact':
        return renderCompact();
      case 'detailed':
        return renderDetailed();
      case 'full':
        return renderFull();
      default:
        return renderCompact();
    }
  };

  return (
    <div
      className={cn(
        'font-mono',
        getPositionClasses(),
        className
      )}
    >
      {renderContent()}
    </div>
  );
}

/**
 * Compact version badge component.
 *
 * This is a simplified version display that shows just the version number
 * and status badge in a compact format.
 *
 * @param className - Additional CSS classes
 * @returns The compact version badge component
 *
 * @since 1.0.0
 */
export function VersionBadge({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <span className="text-xs text-text-secondary">
        {VERSION_UTILS.getDisplayVersion()}
      </span>
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          VERSION_UTILS.isPreRelease() && 'bg-yellow-500',
          VERSION_UTILS.isProductionReady() && 'bg-green-500',
          !VERSION_UTILS.isPreRelease() && !VERSION_UTILS.isProductionReady() && 'bg-gray-500'
        )}
        title={VERSION_BADGES.getBadgeText()}
      />
    </div>
  );
} 