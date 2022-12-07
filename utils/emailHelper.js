const nodemailer = require("nodemailer")

const mailHelper = async (res,option)=>{

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER, // generated ethereal user
          pass: process.env.SMTP_PASS, // generated ethereal password
        },
      });


    //PERSONAL SIMPLE MAIL CONFIG
    let personaltransporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
          user: "fschuppe24@gmail.com", // generated ethereal user
          pass: "xcrpcuavbsnlwrlh", // generated APP password
        },
      });

    // send mail with defined transport object
    let message = await personaltransporter.sendMail({
        from: "fschuppe24@gmail.com", // sender address
        to: option.email, // list of receivers
        subject: option.subject, // Subject line
        text: option.message, // plain text body
    });

    //sendMail
    transporter.sendMail(message , function(error,info){
        if(error){
            console.log(error)
             res.status(400).json({
          success:False,
          message : "Not send error"
     })
        }
        else{
            console.log(`Email send ${info.response}`)
            res.status(200).json({
                success:true,
                message : "Send Email Success"
           })
        }
    })

}

module.exports = mailHelper