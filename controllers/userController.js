const {User, Profile} = require("../models");
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'naufalrafii.9d@gmail.com',
        pass: 'rafi09272'
    }
});

class userController {

    static async registerForm(req, res) {
        try {
            res.render('registForm')
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async insertRegister(req, res) {
        try {
            
            const {username, email, password, role} = req.body
            await User.create({
            username,
            email,
            password,
            role
            })

            await Profile.create({
                name: username,
                UserId: req.session.userId
            })

            res.redirect('/login')

        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async sendRegistrationEmail(newUserEmail) {
        // Dapatkan data pengguna dengan alamat email yang sesuai dari database
        const user = await User.findOne({
            where: {
                email: newUserEmail
            }
        });
    
        if (user) {
            const mailOptions = {
                from: 'naufalrafii.9d@gmail.com',
                to: user.email,
                subject: 'Registration ThriftKu Success!',
                text: 'Selamat, pendaftaran di Thriftku berhasil. Selamat berbelanja!'
            };
    
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    console.error('Gagal mengirim email: ' + err);
                } else {
                    console.log('Email terkirim: ' + info.response);
                }
            });
        } else {
            console.error('Pengguna tidak ditemukan.');
        }
    }

    static async loginForm(req, res) {
        try {
            // console.log(req.body);
            const {err} = req.query
            res.render('loginForm', {err})
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async insertLogin(req, res) {
        try {
            const {username, password} = req.body

            let user = await User.findOne({where: { username }})
            
            if(user){
                let isValidPassword = bcrypt.compareSync(password, user.password)
                if(isValidPassword){
                    req.session.userId = user.id
                    res.redirect('/')
                }else{
                    const err = 'invalid password or username'
                    res.redirect(`/login?err=${err}`)
                }
            }else {
                const err = 'invalid password or username'
                res.redirect(`/login?err=${err}`)
            }
            // res.render('loginForm')
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if(err) res.send(err);
                else{
                    res.redirect('/login')
                }
            })
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

}

module.exports = userController