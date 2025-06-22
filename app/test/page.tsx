/**
 * @fileoverview Test page to verify basic functionality and styling.
 *
 * This page is used to test if the basic components, styling, and
 * Firebase configuration are working correctly.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React from 'react';

/**
 * Test page component for debugging.
 *
 * @returns A simple test page with basic styling
 */
export default function TestPage() {
  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-8">
          WordWise Test Page
        </h1>
        
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Environment Variables Debug</h2>
              <p className="card-description">
                Testing if environment variables are loaded in the browser.
              </p>
            </div>
            <div className="card-content">
              <div className="space-y-2 text-sm font-mono">
                <p><strong>NEXT_PUBLIC_FIREBASE_API_KEY:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '❌ Missing'}</p>
                <p><strong>NEXT_PUBLIC_FIREBASE_PROJECT_ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Missing'}</p>
                <p><strong>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ Missing'}</p>
                <p><strong>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:</strong> {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '❌ Missing'}</p>
                <p><strong>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '❌ Missing'}</p>
                <p><strong>NEXT_PUBLIC_FIREBASE_APP_ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '❌ Missing'}</p>
                <p><strong>NEXT_PUBLIC_USE_FIREBASE_EMULATORS:</strong> {process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS || '❌ Missing'}</p>
                <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || '❌ Missing'}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Basic Styling Test</h2>
              <p className="card-description">
                This section tests if the basic Tailwind classes are working.
              </p>
            </div>
            <div className="card-content">
              <p className="text-text-secondary mb-4">
                If you can see this text in a gray color, Tailwind is working.
              </p>
              <div className="flex gap-4">
                <button className="btn btn-primary">
                  Primary Button
                </button>
                <button className="btn btn-outline">
                  Outline Button
                </button>
                <button className="btn btn-secondary">
                  Secondary Button
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Color Test</h2>
              <p className="card-description">
                Testing custom color classes.
              </p>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary-50 text-primary-900 rounded">
                  Primary 50
                </div>
                <div className="p-4 bg-primary-100 text-primary-900 rounded">
                  Primary 100
                </div>
                <div className="p-4 bg-primary-600 text-white rounded">
                  Primary 600
                </div>
                <div className="p-4 bg-accent-success text-white rounded">
                  Success
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 