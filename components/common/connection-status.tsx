/**
 * @fileoverview Connection status component for the WordWise application.
 *
 * This component displays the current Firestore connection status
 * and provides options for users to manage their connection.
 * It's useful for showing users when they're offline or experiencing
 * connection issues.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React from 'react';
import { Wifi, WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestoreConnection } from '@/hooks/use-firestore-connection';
import { cn } from '@/lib/utils/cn';

/**
 * Connection status component props interface.
 *
 * @since 1.0.0
 */
interface ConnectionStatusProps {
  /** Whether to show the component */
  show?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show detailed connection information */
  showDetails?: boolean;
}

/**
 * Connection status component.
 *
 * This component displays the current Firestore connection status
 * and provides utilities for managing the connection. It's particularly
 * useful for showing users when they're offline or experiencing
 * connection issues.
 *
 * @param show - Whether to show the component
 * @param className - Additional CSS classes
 * @param showDetails - Whether to show detailed connection information
 * @returns The connection status component
 *
 * @example
 * ```tsx
 * <ConnectionStatus show={true} showDetails={false} />
 * ```
 *
 * @since 1.0.0
 */
export function ConnectionStatus({
  show = true,
  className,
  showDetails = false,
}: ConnectionStatusProps) {
  const {
    status,
    isConnected,
    isConnecting,
    isDisconnected,
    hasError,
    lastConnected,
    connectionErrors,
    enableConnection,
  } = useFirestoreConnection();

  // Don't render if not showing or if connected and not showing details
  if (!show || (isConnected && !showDetails)) {
    return null;
  }

  const getStatusIcon = () => {
    if (isConnected) return <Wifi className="w-4 h-4 text-green-600" />;
    if (isConnecting) return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
    if (hasError) return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <WifiOff className="w-4 h-4 text-gray-600" />;
  };

  const getStatusText = () => {
    if (isConnected) return 'Connected';
    if (isConnecting) return 'Connecting...';
    if (hasError) return 'Connection Error';
    return 'Disconnected';
  };

  const getStatusColor = () => {
    if (isConnected) return 'bg-green-50 border-green-200 text-green-800';
    if (isConnecting) return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    if (hasError) return 'bg-red-50 border-red-200 text-red-800';
    return 'bg-gray-50 border-gray-200 text-gray-800';
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 p-3 rounded-lg border shadow-lg',
        getStatusColor(),
        className
      )}
    >
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        
        {!isConnected && (
          <Button
            size="sm"
            variant="outline"
            onClick={enableConnection}
            disabled={isConnecting}
            className="ml-2"
          >
            {isConnecting ? 'Connecting...' : 'Reconnect'}
          </Button>
        )}
      </div>

      {showDetails && (
        <div className="mt-2 text-xs">
          {lastConnected && (
            <p>Last connected: {lastConnected.toLocaleTimeString()}</p>
          )}
          {connectionErrors.length > 0 && (
            <p className="text-red-600">
              {connectionErrors.length} connection error(s)
            </p>
          )}
        </div>
      )}
    </div>
  );
} 