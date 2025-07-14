import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira',
});

export const metadata: Metadata = {
  title: 'Babar Ali | Portfolio',
  description: 'Babar Ali Portfolio',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Babar Ali | Portfolio',
    description: 'Explore my work in AI, medical computer vision, and intelligent systems.',
    url: 'https://babar-ali-portfolio.vercel.app',
    siteName: 'Babar Ali Portfolio',
    images: [
      {
        url: 'https://babar-ali-portfolio.vercel.app/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Client Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Babar Ali | Portfolio',
    description: 'Explore my work in AI, medical computer vision, and intelligent systems.',
    images: ['https://babar-ali-portfolio.vercel.app/logo.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={`${inter.variable} ${firaCode.variable} font-sans bg-background text-foreground min-h-screen`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={true}
          storageKey="theme"
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
