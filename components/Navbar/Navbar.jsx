import React from 'react'
import { signOut  } from 'next-auth/client';

export default function Navbar({session}) {
    return (
        <div className="flex p-4 bg-indigo-500 justify-between">
            <h2 className="text-white">Logged in as {session.user.names}</h2>
            <button onClick={signOut} className="bg-white text-indigo-500 active:bg-indigo-600 text-xs font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">Sign Out</button>
        </div>
    )
}
