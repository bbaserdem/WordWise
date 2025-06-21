/**
 * @fileoverview Custom hook for monitoring Firestore connection status.
 *
 * This hook provides utilities for monitoring Firestore connections
 * and handling connection issues gracefully. It's useful for showing
 * connection status to users and handling offline scenarios.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { firestore, firestoreConnectionUtils } from '@/lib/firebase/config';

/**
 * Firestore connection status.
 *
 * @since 1.0.0
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

/**
 * Hook for monitoring Firestore connection status.
 *
 * This hook monitors the Firestore connection and provides utilities
 * for handling connection issues. It's particularly useful for showing
 * connection status to users and handling offline scenarios.
 *
 * @returns Object containing connection status and utilities
 *
 * @example
 * ```tsx
 * const { status, isConnected, enableConnection, disableConnection } = useFirestoreConnection();
 * 
 * if (status === 'disconnected') {
 *   return <div>You're offline. Some features may be limited.</div>;
 * }
 * ```
 *
 * @since 1.0.0
 */
export function useFirestoreConnection() {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const [connectionErrors, setConnectionErrors] = useState<Error[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const monitorConnection = async () => {
      try {
        setStatus('connecting');

        // Create a dummy document reference to monitor connection
        const dummyDoc = doc(firestore, '_connection_monitor', 'status');
        
        // Set up a listener to monitor connection status
        unsubscribe = onSnapshot(
          dummyDoc,
          () => {
            // Successfully connected
            setStatus('connected');
            setLastConnected(new Date());
            setConnectionErrors([]);
          },
          (error) => {
            // Connection error
            console.warn('Firestore connection error:', error);
            setStatus('error');
            setConnectionErrors(prev => [...prev, error]);
          }
        );

        // Set a timeout to mark as disconnected if no response
        const timeout = setTimeout(() => {
          if (status === 'connecting') {
            setStatus('disconnected');
          }
        }, 5000);

        return () => clearTimeout(timeout);
      } catch (error) {
        console.error('Failed to monitor Firestore connection:', error);
        setStatus('error');
        setConnectionErrors(prev => [...prev, error as Error]);
      }
    };

    monitorConnection();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const enableConnection = async () => {
    try {
      setStatus('connecting');
      await firestoreConnectionUtils.enableConnection();
      setStatus('connected');
      setLastConnected(new Date());
    } catch (error) {
      setStatus('error');
      setConnectionErrors(prev => [...prev, error as Error]);
    }
  };

  const disableConnection = async () => {
    try {
      await firestoreConnectionUtils.disableConnection();
      setStatus('disconnected');
    } catch (error) {
      setConnectionErrors(prev => [...prev, error as Error]);
    }
  };

  return {
    status,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isDisconnected: status === 'disconnected',
    hasError: status === 'error',
    lastConnected,
    connectionErrors,
    enableConnection,
    disableConnection,
  };
} 