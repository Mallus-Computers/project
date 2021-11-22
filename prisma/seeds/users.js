const bcrypt = require('bcrypt')

const bcryptPassword = async(unhashedPassword) =>{
   return await bcrypt.hash(unhashedPassword)
}

 const initialUsers = [
    {
        names:"Nsengimana Lambert",
        email:"lambert@gmail.com",
        password: bcryptPassword("lambert12345"),
        account :{
            create:{
                currency:'USD',
                amount:1000
            }
        }
    },
]

module.exports = initialUsers