/**
 * @fileoverview API route to test environment variable loading.
 *
 * This route helps debug environment variable issues by returning
 * the current environment variables that are available to the server.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    FIREBASE_ENV: process.env.FIREBASE_ENV,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'MISSING',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'SET' : 'MISSING',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'SET' : 'MISSING',
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'SET' : 'MISSING',
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? 'SET' : 'MISSING',
    NEXT_PUBLIC_USE_FIREBASE_EMULATORS: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS,
    NEXT_PUBLIC_USE_AUTH_EMULATOR: process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR,
    NEXT_PUBLIC_USE_FIRESTORE_EMULATOR: process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR,
    NEXT_PUBLIC_USE_STORAGE_EMULATOR: process.env.NEXT_PUBLIC_USE_STORAGE_EMULATOR,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET' : 'MISSING',
  };

  return NextResponse.json({
    message: 'Environment variables test',
    timestamp: new Date().toISOString(),
    environment: envVars,
  });
} 