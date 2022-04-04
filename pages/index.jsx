import FormInput from '../components/Form/FormInput'
import FormButton from '../components/Form/FormButton'
import Header from '../components/Head/Header'
import FormErrorMessage from '../components/Form/FormErrorMessage'
import { signIn } from "next-auth/client"
import { useRouter } from 'next/router'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';


export default function Home() {
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [hasError , setHasError] = useState(false)
  const [errorMessage , setErrorMessage] = useState('')
  const [isLoading , setIsLoading] = useState(false)
  const router = useRouter();

  function hideMessage(){
    setHasError(false)
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true)
    if(email.trim() === "" || password.trim() === ""){
      setIsLoading(false)
      setHasError(true)
      setErrorMessage("Please provide all fields..");
      return;
    }
    signIn("credentials",{
      email,
      password,
      callbackUrl:`${window.location.origin}/transactions`,
      redirect:false
    }).then(function(result){
      if (result.error !== null)
            {
                if (result.status === 401)
                {
                  setIsLoading(false)
                    setHasError(true)
                    setErrorMessage("Invalid Credentials..");
                }
                else
                {
                   setIsLoading(false)
                    setHasError(true)
                    setErrorMessage(result.error);
                }
            }
            else
            {
                router.push(result.url);
            }
    })
  }

  return (
    <>
    <Header title="Home" />
     <div className="h-screen">
        <div className="grid grid-cols-1">
            <div className="justify-center items-center flex">
              <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-20">
                <span className="text-2xl font-bold mb-4">AMALU Money Transfer app</span>
                {
                     hasError &&
                    <FormErrorMessage hideMessage={hideMessage} errorMessage={errorMessage} />
                 }
                <div className="mt-8">

                <FormInput
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                />

                <FormInput
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                />

                <FormButton
                buttonLabel={isLoading ? "Please wait...":"Sign In"}
                link="/register"
                linkLabel="No Account Yet?"
                isLoading = {isLoading}
                />

                </div>
              </form>
            </div>
            </div>
    </div>
    <footer className="flex p-3 bg-indigo-500 justify-between">
      <p className="text-white ml-2 mt-2"><b>Amalu Emmanuel Chinedu [2017030180423]</b></p>
      <p className="text-white ml-2 mt-2">Supervisor <b>Mr Mbah David</b></p>
      <p className="text-white ml-2 mt-2">Powered by ESUT Computer Science Department 2022</p>
      <Link href="https://portal.esut.edu.ng/">
          <a className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" >
            <Image src="/images/logo.png" className="rounded-full bg-transparent" width={35} height={20}/>
          </a>
      </Link>
    </footer>
    </>
  )
}
