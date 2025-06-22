/**
 * @fileoverview Custom hook for managing Firestore connection state.
 *
 * This hook provides utilities for managing the Firestore connection,
 * including enabling/disabling the connection and monitoring connection status.
 * It's useful for implementing offline functionality and connection management.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { firestoreConnectionUtils } from '@/lib/firebase/config';

/**
 * Hook for managing Firestore connection state.
 *
 * This hook provides state and utilities for managing the Firestore connection,
 * including connection status, enabling/disabling the connection, and
 * automatic connection monitoring.
 *
 * @returns Object containing connection state and management functions
 *
 * @example
 * ```tsx
 * const { isConnected, enableConnection, disableConnection } = useFirestoreConnection();
 * ```
 *
 * @since 1.0.0
 */
export function useFirestoreConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Check connection status.
   */
  const checkConnection = useCallback(async () => {
    try {
      const status = await firestoreConnectionUtils.isConnected();
      setIsConnected(status);
    } catch (error) {
      console.error('Failed to check connection status:', error);
      setIsConnected(false);
    }
  }, []);

  /**
   * Enable Firestore connection.
   */
  const enableConnection = useCallback(async () => {
    setIsLoading(true);
    try {
      await firestoreConnectionUtils.enableConnection();
      await checkConnection();
    } catch (error) {
      console.error('Failed to enable connection:', error);
    } finally {
      setIsLoading(false);
    }
  }, [checkConnection]);

  /**
   * Disable Firestore connection (offline mode).
   */
  const disableConnection = useCallback(async () => {
    setIsLoading(true);
    try {
      await firestoreConnectionUtils.disableConnection();
      setIsConnected(false);
    } catch (error) {
      console.error('Failed to disable connection:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check connection status on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    isConnected,
    isLoading,
    enableConnection,
    disableConnection,
    checkConnection,
  };
} 