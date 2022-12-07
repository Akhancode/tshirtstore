const { application } = require("express");
const express = require("express");
const morgan = require("morgan");

const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const app = express();

//TEMP CHECK
app.set('view engine','ejs')

//FOR SWAGGER DOCUMENTATION
const swaggerui = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load("./swagger.yaml")
app.use("/api-docs",swaggerui.serve,swaggerui.setup(swaggerDocument))


//REGULAR MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//COOKIES AND FILE MIDDLEWARE
app.use(cookieParser())
app.use(fileUpload(
    {
        useTempFiles:true,
        tempFileDir:"/tmp/"
    }
))

//IMPORT ALL ROUTES
const home = require('./routes/home')
const user = require('./routes/user')

app.use(morgan('tiny'))
//ROUTER MIDDLEWARE
app.use('/api/v1',home);
app.use('/api/v1',user);

//TEMP
app.get('/signuptest',(req,res)=>{
    res.render('signup')
})


//EXPORT APP JS
module.exports = app