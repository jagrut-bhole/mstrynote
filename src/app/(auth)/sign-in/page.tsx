'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function SignInPage() {
    const { data: session } = useSession()

    if (session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
                    <p className="mb-4">Signed in as: <strong>{session.user.email}</strong></p>
                    <button 
                        onClick={() => signOut()}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Sign In</h1>
                <p className="mb-4 text-gray-600">You are not signed in</p>
                <button 
                    onClick={() => signIn()}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Sign In
                </button>
            </div>
        </div>
    )
}
