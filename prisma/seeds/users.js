const bcrypt = require('bcrypt')

const bcryptPassword = async(unhashedPassword) =>{
   return await bcrypt.hash(unhashedPassword)
}

 const initialUsers = [
    {
        names:"Emmanuel Amalu",
        email:"emallus009@gmail.com",
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