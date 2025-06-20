/**
 * @fileoverview Home page component for the WordWise application.
 *
 * This component serves as the landing page, providing an overview
 * of the WordWise writing assistant and navigation to key features.
 * It includes a hero section, feature highlights, and call-to-action
 * elements for user engagement.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import Link from 'next/link';
import { CheckCircle, Zap, Shield } from 'lucide-react';

/**
 * Home page component that displays the landing page content.
 *
 * @returns The home page with hero section and feature highlights
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-24 sm:py-32">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-6xl">
                Write with <span className="text-primary-600">Confidence</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-text-secondary">
                WordWise is your AI-powered writing assistant designed
                specifically for STEM graduate students. Get real-time grammar,
                clarity, and citation feedback in a distraction-free academic
                environment.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/register"
                  className="btn btn-primary px-8 py-3 text-base font-semibold"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="btn btn-outline px-8 py-3 text-base font-semibold"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-primary-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]">
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <pattern
                  id="hero-pattern"
                  width="200"
                  height="200"
                  x="50%"
                  y="-1"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M.5 200V.5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y="-1" className="overflow-visible fill-primary-50">
                <path
                  d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                  strokeWidth="0"
                />
              </svg>
              <rect
                width="100%"
                height="100%"
                strokeWidth="0"
                fill="url(#hero-pattern)"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Everything you need for academic writing
            </h2>
            <p className="mt-6 text-lg leading-8 text-text-secondary">
              From grammar checking to AI-powered suggestions, WordWise provides
              the tools you need to write better academic papers and
              dissertations.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-text-primary">
                  <CheckCircle className="h-5 w-5 flex-none text-accent-success" />
                  Real-time Grammar Checking
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-text-secondary">
                  <p className="flex-auto">
                    Get instant feedback on grammar, spelling, and punctuation
                    as you write. Our advanced algorithms catch errors that
                    traditional spell checkers miss.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-text-primary">
                  <Zap className="h-5 w-5 flex-none text-accent-info" />
                  AI-Powered Suggestions
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-text-secondary">
                  <p className="flex-auto">
                    Receive intelligent writing suggestions that improve
                    clarity, style, and academic tone. Our AI understands
                    context and provides relevant recommendations.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-text-primary">
                  <Shield className="h-5 w-5 flex-none text-accent-warning" />
                  Academic Focus
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-text-secondary">
                  <p className="flex-auto">
                    Designed specifically for STEM students and researchers. Get
                    suggestions tailored to academic writing standards and
                    citation requirements.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to improve your writing?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Join thousands of STEM students who are already writing better
              papers with WordWise. Start your free trial today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="btn bg-white px-8 py-3 text-base font-semibold text-primary-600 hover:bg-primary-50"
              >
                Start Writing Now
              </Link>
              <Link
                href="/about"
                className="btn btn-ghost px-8 py-3 text-base font-semibold text-white hover:bg-primary-500"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
