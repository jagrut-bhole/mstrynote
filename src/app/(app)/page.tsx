'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    const date = new Date().getFullYear();
    return (
        <>
            <main className="grow flex flex-col items-center justify-center text-black min-h-screen">
                <section className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold">
                        Dive into the World of Anonymous Feedback
                    </h1>
                    <p className="mt-4 md:mt-4 text-base md:text-lg">
                        MstryNote - Where your identity remains a secret.
                    </p>
                    <Link  href='/register'>
                        <Button className="mt-4 hover:cursor-pointer">Get Started</Button>
                    </Link>
                </section>
            </main>

              <footer className="text-center w-full py-10 text-sm bg-slate-50 text-gray-800/70">
                <p className="mt-4 text-center">Copyright © {date} <a className="font-bold" href="https://prebuiltui.com">MstryNote</a>. All rights reservered.</p>
            </footer>
        </>
    )
}