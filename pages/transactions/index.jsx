import { useSession } from 'next-auth/client'
import React from 'react'
import { signOut } from 'next-auth/client';

 const isSessionValid = (session) => {
    if (typeof session !== typeof undefined && session !== null && typeof session.user !== typeof undefined)
    {
        return true;
    }
    else
    {
        return false;
    }
}

export default function index() {
    const [session , loading] = useSession()
    // return (
    //     <div>
    //         <h2>Transactions</h2>
    //     </div>
    // )
    
    if (!loading)
    {
        if (isSessionValid(session))
        {
            return (
                <div className='wrapper'>
                    Welcome {session.user.names}
                    <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000' })}>Sign out</button>
                </div>
            )
        }
        else
        {
            return (
                <div className='wrapper'>
                    <p>You are not logged in</p>
                </div>
            )
        }
    }
    else
    {
        return null;
    }
}
