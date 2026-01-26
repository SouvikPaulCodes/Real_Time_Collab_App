import { Viewport, type Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import { geistSans, geistMono } from './lib/fonts'
import {ThemeProvider} from 'next-themes'
import ThemeSetter from './components/themeSetter'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0
}

export const metadata: Metadata = {
  title: 'WeWork',
  description: 'A Real-Time Collaborative Editing App',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme='dark' className='h-full' suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full relative`}>
          <ThemeProvider attribute={`data-theme`} enableSystem={false} defaultTheme='dark' themes={['light', 'dark']} enableColorScheme={true}>
            <ThemeSetter children={children} />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
