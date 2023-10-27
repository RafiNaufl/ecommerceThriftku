const {User, Profile} = require("../models");
const bcrypt = require('bcryptjs')

class userController {

    static async registerForm(req, res) {
        try {

            let err = req.query.err
            let err2 = ''
            if(err) {
                err2 = err.split(',')
            }


            console.log(err);
            res.render('registForm', {err2})
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
            if(error.name === 'SequelizeValidationError') {
                let err = error.errors.map( el => {
                    return el.message
                })
                res.redirect(`/register?err=${err}`)
            }else{
                console.log(error);
                res.send(error.message)
            }
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