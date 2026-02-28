import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI API Performance Regression Detector',
  description: 'Detects API latency regressions after deployments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-900 text-slate-50`}>
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded bg-indigo-500 animate-pulse" />
                </div>
                <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  AI PerfGuard
                </span>
              </div>
              <div className="flex space-x-4">
                <a href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition">Dashboard</a>
                <a href="/endpoints" className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">Endpoints</a>
                <a href="/deployments" className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">Deployments</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
