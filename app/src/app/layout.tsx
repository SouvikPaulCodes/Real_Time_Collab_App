import { Viewport, type Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import { geistSans, geistMono, instrumentSerif } from './lib/fonts'
import {ThemeProvider} from 'next-themes'
import SiteHeader from './components/siteHeader'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#fbf8f3'},
    {media: '(prefers-color-scheme: dark)', color: '#1a1e29'},
  ],
}

export const metadata: Metadata = {
  title: 'WeWork',
  description: 'A Real-Time Collaborative Editing App',
}

// Point Clerk at the daisyUI theme variables so its components follow light/dark mode.
const clerkAppearance = {
  variables: {
    colorPrimary: 'var(--color-primary)',
    colorPrimaryForeground: 'var(--color-primary-content)',
    colorBackground: 'var(--color-base-100)',
    colorForeground: 'var(--color-base-content)',
    colorMutedForeground: 'color-mix(in oklch, var(--color-base-content) 62%, transparent)',
    colorNeutral: 'var(--color-base-content)',
    colorInput: 'var(--color-base-100)',
    colorInputForeground: 'var(--color-base-content)',
    colorDanger: 'var(--color-error)',
    colorSuccess: 'var(--color-success)',
    colorWarning: 'var(--color-warning)',
    fontFamily: 'var(--font-geist-sans)',
    borderRadius: '0.5rem',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full`} suppressHydrationWarning>
        <body className={`font-sans antialiased min-h-full bg-base-100 text-base-content`}>
          <ThemeProvider attribute={`data-theme`} enableSystem defaultTheme='system' themes={['light', 'dark']} enableColorScheme={true}>
            <div className="flex min-h-screen flex-col">
              <SiteHeader/>
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
