const mongoose = require('mongoose')



const connnectWithDB = ()=>{

    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser :true,
        useUnifiedTopology:true
    })
    .then(
        console.log(
            "DB got connnected : SUCCESS !!"
        )
        
    )
    .catch(
        error=>{
            console.log("DB connection issues ")
            console.log(error)
            process.exit(1)
            
        }
    )
}

module.exports= connnectWithDB