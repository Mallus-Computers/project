import prisma from '../../../lib/prisma'
import bcrypt  from 'bcryptjs'

export default async (req,res)=>{
    const { names , email , password , passwordConfirm } = req.body
    if(!names || !email ||!password ||!passwordConfirm){
        res.status(400).json({
            "message":"Please Fill All Fields"
        })
        return;
    }
    if(password !== passwordConfirm){
        res.status(400).json({
            "message":"Password Confirmation does not match"
        })
        return;
    }
    const checkIfUserExists = await prisma.user.findFirst({
        where:{
            email:email
        }
    })
    if (checkIfUserExists) {
        res.status(400).json({ status: 400, message: "User with such email already exists" });
        return;
    }else{
        try {
            const newUser = await prisma.user.create({
                data:{
                    names:names,
                    email:email,
                    password: await bcrypt.hash(password , 8)
                }
            })
            if(newUser){
                res.status(200).json({  message: "Registration done Successfully" });
            }
        } catch (error) {
            res.status(500).json({
                error:error
            })
        }
    }

  }