import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className="h-screen">
        <div className="grid grid-cols-1">
            <div className="justify-center items-center flex">
                <span className=" bg-white rounded-md p-4 text-xl font-semibold mt-60">Welcome..Please Register or Login to continue...</span>
            </div>
        </div>
    </div>
  )
}
