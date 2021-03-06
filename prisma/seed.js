const { PrismaClient } = require('@prisma/client')
const { initialUsers } = require ('./seeds/users')
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()


async function main(){
   await prisma.user.create({
      data: {
            names:'Emmanuel Amalu',
            email:'emallus009@gmail.com',
            password: await bcrypt.hash("lambert12345" , 8),
            accounts :{
                create:[{
                    amount:1000,
                    currency:"USD"
                },{
                    amount:0,
                    currency:"NGN"
                },{
                  amount:0,
                  currency:"EUR"
                }],
            },
        },
   })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });