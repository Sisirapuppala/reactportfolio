const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const session = require('express-session');
const flash = require('req-flash');
const app = express();

dotenv.config({ path: './config.env' });

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.EXPRESS_SESSION,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })
);
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/contact', async (req, res) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        subject: req.body.contactSub,
        text: `Name: ${req.body.contactName} \n\n Email: ${req.body.contactEmail} \n\n ${req.body.contactMessage}`,
    });

    req.flash('success_message', 'You message has been successfully sent');
    res.redirect('/');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});
