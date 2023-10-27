var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'naufalrafii.9d@gmail.com',
        pass: 'rafi09272'
    }
});

var mailOptions = {
    from: 'naufalrafii.9d@gmail.com',
    to: 'yourfriend@gmail.com',
    subject: 'Registration ThriftKu Success!',
    text: 'Welcome to Thriftku! Selamat berbelanja :)'
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
    console.log('Email sent: ' + info.response);
});