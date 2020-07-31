/*
    Video: https://www.youtube.com/watch?v=38aE1lSAJZ8
    Don't forget to disable less secure app from Gmail: https://myaccount.google.com/lesssecureapps TODO:
*/

require('dotenv').config();

const nodemailer = require('nodemailer');
const cors = require("cors");
const bodyParser = require("body-parser");
const hbs = require('nodemailer-express-handlebars');
const express = require("express");
const details = require("./details.json");
const log = console.log;


const app = express();

app.use(cors({ origin: "*" }));
//app.use(bodyParser.json());
app.use(bodyParser.json({limit: '10mb', extended: true}))


app.listen(process.env.PORT || 3000, () => {
    console.log("The server started on port 3000 !!!!!!");
});

app.get("/", (req, res) => {
    res.send(
      "<h1 style='text-align: center'>Welcome to Achtkarspelen mail sender <br></h1>"
    );
  });



app.post("/sendmail", (req, res) => {
    try {
        console.log("request came");
        console.log(req.body)
        let user = req.body;
        sendMail(user, info => {
            console.log(info);
            res.send(info);
        })
    } catch (err) {
        next(err);
    }
})

async function sendMail(user, callback) {
    console.log(user.nearestplace)
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: details.email,
          pass: details.password
        },
        tls: {
          rejectUnauthorized: false
        }
      });

    transporter.use('compile', hbs({
        viewEngine: 'express-handlebars',
        viewPath: './views/'
    }));    



    let mailOptions = {
        from: 'Achtkarspelen melden', // TODO: email sender
        to: user.email, // TODO: email receiver
        subject: 'Achtkarspelen melden',
        text: 'Achtkarspelen melden',
        attachments: [
            {   // utf-8 string as an attachment
                path: user.image,
               
            }],
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
            YCoordinaat:user.YCoordinaat,
            address :user.nearestaddress,
            postcode : user.nearestpostal,
            place : user.nearestplace


        } // send extra values to template
    };

    // Step 4
    let info = await transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return log(err);
        }
        return log('Email sent!!!');
    })
    callback(info)
};
