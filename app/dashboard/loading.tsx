/**
 * @fileoverview Loading component for dashboard pages.
 *
 * This component provides a loading state for dashboard pages
 * while content is being loaded.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { LoadingSpinner } from '@/components/common';

/**
 * Loading component for dashboard pages.
 *
 * Displays a loading spinner while dashboard content is being loaded.
 *
 * @returns The loading component
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-secondary">
      <LoadingSpinner
        size="xl"
        variant="primary"
        showText={true}
        text="Loading dashboard..."
      />
    </div>
  );
} 