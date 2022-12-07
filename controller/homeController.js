const BigPromise = require('../middleware/bigPromise')



//BIG PROMISE
exports.home = BigPromise(
  async  (req,res)=>{
    //const db = await something
    res.status(200).json({
        success:true,
        greeting:"Hello API"
    })}
    )
//TRY CATCH PROMISE    
exports.dummy = async(req,res)=>{
        
        try {
            //const db = await something
            res.status(200).json({
            success:true,
            greeting:"This is Dummy route"
        })
    } catch (error) {
        console.log(error)
        
    }
  
}

