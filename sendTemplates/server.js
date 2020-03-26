/*
    Video: https://www.youtube.com/watch?v=38aE1lSAJZ8
    Don't forget to disable less secure app from Gmail: https://myaccount.google.com/lesssecureapps TODO:
*/

require('dotenv').config();

const nodemailer = require('nodemailer');
const cors = require("cors");
const bodyParser = require("body-parser");
const hbs = require('nodemailer-handlebars');
const express = require("express");
const log = console.log;


const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());


app.listen(process.env.PORT || 3000, () => {
    console.log("The server started on port 3000 !!!!!!");
});



app.post("/sendmail", (req, res) => {
    try {
        console.log("request came");
        let user = req.body;
        sendMail(user, info => {
            //console.log(`The mail has beed sent and the id is ${info.messageId}`);
            res.send(info);
        })
    } catch (err) {
        next(err);
    }
})

async function sendMail(user, callback) {
    console.log(user.toelichting)
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'samsonboadi@gmail.com',
          pass: "Agombiautwente@1"
        },
        tls: {
          rejectUnauthorized: false
        }
      });

    transporter.use('compile', hbs({
        viewEngine: 'express-handlebars',
        viewPath: './views/'
    }));
    


    // Step 3
    let mailOptions = {
        from: 'samsonboadi@gmail.com', // TODO: email sender
        to: user.email, // TODO: email receiver
        subject: 'Nodemailer - Test',
        text: 'Wooohooo it works!!',
        template: 'index',
        context: {
            name: user.name,
            MeldID: user.id,
            Date: user.date,
            email: user.email,
            telephone: user.telephone,            
            toelichting:user.toelichting,
            category:user.categorie,
            XCoordinaat:user.XCoordinaat,
            YCoordinaat:user.YCoordinaat


        } // send extra values to template
    };

    // Step 4
    let info = await transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return log('Error occurs');
        }
        return log('Email sent!!!');
    })
    callback(info)
};
