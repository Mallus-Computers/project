import {React , useState} from 'react'
import { useSession } from 'next-auth/client'
import prisma from '../../lib/prisma';
import { signOut , getSession } from 'next-auth/client';
import axios from 'axios';
import { useRouter } from 'next/router'
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Header from '../../components/Head/Header';
import UserSelect from '../../components/Form/UserSelect';
import FormInput from '../../components/Form/FormInput';
import CurrencySelect from '../../components/Form/CurrencySelect';
import FormButton from '../../components/Form/FormButton';
import Navbar from '../../components/Navbar/Navbar'


export const getServerSideProps = async(context)=> {
    const session = await getSession(context)
    if (!session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    } 
    const [balances , availableUsers] = await Promise.all([
        await prisma.account.findMany({
            where:{
                userId:session.user.id
            },
            select:{
                amount:true,
                currency:true,
            }
        }),
        await prisma.user.findMany({
            where:{
             NOT:{
                 id:session.user.id
             }
            },
            select:{
                id:true,
                names:true,
                email:true
            }
        }) 

    ])
    return {
      props: {balances , availableUsers}
    }
}


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

    /** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
    export default function CreateTransaction({balances , availableUsers}) {
        const [receiver , setReceiver] = useState('')
        const [amount , setAmount] = useState('')
        const [fromCurrency , setFromCurrency] = useState('')
        const [toCurrency , setToCurrency] = useState('')
        const [hasError , setHasError] = useState(false)
        const [errorMessage , setErrorMessage] = useState('')
        const [session , loading] = useSession()
        const currencies = ['USD','EUR','NGN']

        const performTransaction = async(e) =>{
            e.preventDefault()
            e.stopPropagation();
            try {
                const response = await axios.post('/api/transactions/create',{
                    receiver:receiver,
                    amountToSend:amount,
                    fromCurrency:fromCurrency,
                    toCurrency:toCurrency,
                    authenticatedUser:session.user
                })
                if(response.data.status == 200){
                    router.push("/transactions");
                }
            } catch (error) {
              if(error.response.status !==200){
                let errorMessage = error.response.data.message
                setHasError(true)
                setErrorMessage(errorMessage)
              }
            }
        }
        function hideMessage(){
            setHasError(false)
        }   

    if (!loading)
    {
        if (isSessionValid(session))
        {
            return (
                <>
                 <Header title="Create Transaction" />
                  <div className="h-screen">
                      <div className="grid grid-cols-1">
                         <Navbar session={session}/>
                          <div className="justify-between">
                          <div className="justify-center items-center flex">
                            <form onSubmit={performTransaction}  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-12">
                                <span className="text-2xl font-bold mb-4">Money Transfer Application</span>
                                {
                                    hasError &&
                                    <div className="bg-red-500 mt-4 rounded-sm p-2">
                                        <div className="flex justify-between">
                                            <span className="text-center text-white font-semibold">
                                                {errorMessage}
                                            </span>
                                            <svg onClick={hideMessage} className="w-5 h-5 cursor-pointer text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </div>                
                                    </div>
                                }
                                <div className="mt-8">
                                   <UserSelect 
                                   availableUsers={availableUsers}
                                   label="Receiver Names"
                                   onChange={e=>setReceiver(e.target.value)}
                                   />

                                   <FormInput
                                    label="Amount to Send"
                                    onChange={e=>setAmount(e.target.value)}
                                    placeholder="enter the amount to send"
                                    type="number"
                                    value={amount}
                                   />

                                   <CurrencySelect
                                    availableCurrencies={currencies}
                                    label="Select Currency From"
                                    onChange={e=>setFromCurrency(e.target.value)}

                                   />
                                   <CurrencySelect
                                    availableCurrencies={currencies}
                                    label="Select Currency To"
                                    onChange={e=>setToCurrency(e.target.value)}

                                   />

                                    <FormButton
                                     buttonLabel="Send Money"
                                    link="/transactions"
                                    linkLabel="my transactions"
                                    />


                                </div>
                            </form>
                            </div>
                          </div>
                      </div>
                  </div>
                </>
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
        return(
            <div className = "h-screen px-auto flex justify-center items-center">
            <p className = "font-bold text-center text-red-500">Please wait...</p>
                     <Loader
                     type="Puff"
                     color="#F35D2D"
                     height={50}
                     className="ml-4"
                     width={50} />
          </div>
        )
    }
}
