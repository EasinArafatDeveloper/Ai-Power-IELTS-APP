import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import QueryProvider from '@/components/providers/query-provider';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI IELTS Coach - Premium IELTS Preparation',
  description: 'Personalized AI Coach to guide you from your current level to your target IELTS band.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500/10 selection:text-indigo-900">
        <QueryProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'bg-slate-900 border border-slate-800 text-slate-100 rounded-xl',
                duration: 4000,
              }}
            />
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
