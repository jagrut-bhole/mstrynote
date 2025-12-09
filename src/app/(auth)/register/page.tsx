'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Register() {
    const { data: session } = useSession()

    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br/>
                <button onClick={() => signOut()}>Sign Out</button>
            </>
        )
    }

    return (
        <>

            <h1>Not Signed In</h1>
            <button onClick={() => signIn()}>Sign In</button>
        </>
    )
}