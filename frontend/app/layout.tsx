import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Quiz Builder',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-gray-50 text-gray-900'>
        <nav className='border-b bg-white'>
          <div className='mx-auto flex max-w-6xl items-center gap-6 px-6 py-4'>
            <Link
              href='/create'
              className='text-sm font-medium text-gray-700 transition-colors hover:text-gray-900'
            >
              Create new Quiz
            </Link>

            <Link
              href='/quizzes'
              className='text-sm font-medium text-gray-700 transition-colors hover:text-gray-900'
            >
              See all quizzes
            </Link>
          </div>
        </nav>

        <main className='mx-auto max-w-6xl px-6 py-8'>{children}</main>
      </body>
    </html>
  );
}
