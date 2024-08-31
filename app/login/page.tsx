import LoginForm from '@/components/forms/auth/login-form';
import { cn } from '@/lib/utils';

import Link from 'next/link';
import { ArrowLeft, UserIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';

export default function Page() {
  return (
    <main>
      <div className='mx-auto w-full max-w-5xl flex flex-col min-h-screen h-full items-center justify-between py-10'>
        {/* top */}
        {/* back absolute top */}
        <Link
          href={'/'}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            ' space-x-2 absolute top-20 left-4 group inline-flex w-max items-center justify-center text-gray-600 hover:text-black rounded-full text-sm font-medium transition-colors focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50'
          )}
        >
          <span>
            <ArrowLeft className=' w-[18px] h-[18px]' />
          </span>
          <span className='text-sm font-semibold'>Back</span>
        </Link>
        <section className='w-full flex flex-col items-center flex-1 justify-center p-6'>
          <div className='flex flex-col items-center justify-center pb-4 pt-2 w-full'>
            {/* icon */}
            {/* message */}
            <div className={cn('text-center space-y-1')}>
              <h2 className='text-2xl font-semibold'>Login to your account</h2>
              <p className='text-gray-400'>Enter your details to login.</p>
            </div>
          </div>
          <LoginForm />
          <div>
            <div className='flex flex-row items-center space-x-1 text-sm'>
              <p>Don&apos;t have an account,</p>
              <Link
                href={'/create-account'}
                className='text-neutral-500 hover:text-black hover:underline'
              >
                Create Account Here!
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
