'use client'

import { User } from 'next-auth';
import { useSession , signOut } from 'next-auth/react'
import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { MessageCircleIcon } from 'lucide-react';

function NavBar() {

    const {data:session} = useSession();
    const user : User = session?.user;

  return (
    <header className={cn(
        'sticky top-5 z-50 mt-6',
		'mx-auto w-full max-w-3xl rounded-lg border shadow',
		'bg-background/95 supports-backdrop-filter:bg-background/80 backdrop-blur-lg',
    )}>
        <nav className='mx-auto flex items-center justify-between p-1.5'>
            <div className=" flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100">
				<MessageCircleIcon className="size-5" />
				<p className="font-mono text-base font-bold">MSTRYNOTE</p>
			</div>
            <div className='flex gap-2'>
                {
                session ? 
                (
                    <>
                        <span className="mr-4">
                            Welcome, {user.username || user.email}
                        </span>
                        <Button size="sm" onClick={() => signOut()} className='w-full md:w-auto bg-slate-100 text-black hover:bg-slate-200 hover:cursor-pointer' variant='outline'>
                            Logout
                        </Button>
                    </>
                )
                :
                (
                    <>
                    <Link href='/login'>
                        <Button size="sm" className="w-full md:w-auto text-white bg-black hover:cursor-pointer" variant='default'>Login</Button>
                    </Link>
                    <Link href='/register'>
                        <Button className='hover:cursor-pointer' size="sm" variant='outline'>Register</Button>
                    </Link>
                    </>
                )
            }
            </div>
        </nav>
    </header>
  )
}

export default NavBar
