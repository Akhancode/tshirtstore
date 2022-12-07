
const app = require('./app')
const connnectWithDB = require('./config/database')
require('dotenv').config()
const cloudinary = require('cloudinary')
//  CONNECT WITH DATABASES
connnectWithDB();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true 
  });

app.listen(process.env.PORT,()=>{
    console.log(`server  running at port ${process.env.PORT}`)
    
})