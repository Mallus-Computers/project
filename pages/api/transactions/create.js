import { useSession } from "next-auth/client";
import prisma from "../../../lib/prisma";
const CC = require('currency-converter-lt')

export default async (req, res) =>{
    try {
        const { receiver , amountToSend , fromCurrency,toCurrency ,authenticatedUser } = req.body
    //validation of inputs
    if(!receiver || !amountToSend ||!fromCurrency || !toCurrency){
        res.status(400).json({
            "message":"Please Fill All Fields"
        })
        return;
    }
    //minimum amount to send set to 10
    if(amountToSend < 10){
        res.status(400).json({
            "message":"Minimum amount to send is 10"
        })
        return;
    }

    //query the sender account to charge money
    const accountToChargeMoney = await prisma.account.findFirst({
        where:{
            userId:authenticatedUser.id,
            AND:{
                currency:fromCurrency
            }
        },
        select:{
            amount:true
        }
    }) 
    //query the receiver account to send money
    const accountToSendMoneyTo = await prisma.account.findFirst({
        where:{
            userId:receiver,
            AND:{
                currency:toCurrency
            }
        },
        select:{
            amount:true
        }
    }) 

    //check if amount to send is not greater than the available amount
    if(accountToChargeMoney.amount < amountToSend){
        res.status(400).json({
            "message":`your ${fromCurrency} amount is only ${accountToChargeMoney.amount}`
        })
        return;
    }
    //money converter
    let currencyConverter = new CC({from:fromCurrency , to:toCurrency , amount:parseFloat(amountToSend)});
    let convertedAmount = await currencyConverter.convert()

    // transaction saving
    const createQuery = await prisma.transaction.create({
        data:{
            from:authenticatedUser.names,
            to:receiver,
            amount:convertedAmount,
            currency:toCurrency
        }
    })

    //update sender Amount
    const updatedSenderAmount = accountToChargeMoney.amount - amountToSend
    const updateSenderQuery = await prisma.account.updateMany({
        where:{
            userId:authenticatedUser.id,
            AND:{
                currency:fromCurrency
            }
        },
        data:{
            amount:updatedSenderAmount
        }
    }) 

    //update receiver Amount
    const updatedReceiverAmount = accountToSendMoneyTo.amount + convertedAmount
    const updateReceiverQuery = await prisma.account.updateMany({
        where:{
            userId:receiver,
            AND:{
                currency:toCurrency
            }
        },
        data:{
            amount:updatedReceiverAmount
        }
    })
    //Everything done..
    
    res.status(200).send({status:200 , message:"Transaction Done Successfully"})
    } catch (error) {
        res.status(500).json({
            "message":"an Error occured..please try again"
        })
        return;
    }
}