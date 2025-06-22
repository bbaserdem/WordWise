/**
 * @fileoverview Simple test page to check basic rendering.
 *
 * This is a temporary test page to verify that basic rendering
 * is working without authentication dependencies.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-black mb-4">
          Test Page - Basic Rendering
        </h1>
        <p className="text-gray-700">
          If you can see this page, basic rendering is working.
        </p>
        <div className="mt-4 p-4 bg-blue-100 rounded">
          <p className="text-blue-800">
            This should have a blue background and blue text.
          </p>
        </div>
      </div>
    </div>
  );
} 