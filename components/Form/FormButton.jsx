import React from 'react'
import Link from 'next/link'
export default function FormButton({buttonLabel , link , linkLabel}) {
    return (
        <div className="flex items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          {buttonLabel}
        </button>
        <Link href={link}>
          <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
            {linkLabel}
          </a>
        </Link>
      </div>
    )
}
