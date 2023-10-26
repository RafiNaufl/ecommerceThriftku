const { Category, Product, Sequelize, Transaction, Profile, User } = require('../models');
const { Op } = Sequelize;
const { currencyFormatter } = require('../helpers');

class Controller {

    static async redirect(req, res) {
        try {
            res.redirect(``)
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    // READ Home
    static async home(req, res) {
        try {
            const categories = await Category.findAll({
                include: Product
            });
            
            res.render('home', { categories });
        } catch (err) {
            res.send(err);
        }
    }
    // READ Product
    static async listProducts(req, res) {
        try {
            const products = await Product.findAll();
            res.render('products', { products, currencyFormatter });
        } catch (err) {
            res.send(err);
        }
    }
    // GET Add Form Product
    static async getAddProduct(req, res) {
        try {
            const data = await Category.findAll()
            console.log(data);
            res.render('addFormProduct', { data })
        } catch (error) {
            res.send(error);
        }
    }
    // POST Add Form Product
    static async postAddProduct(req, res) {
        const { title, stock, size, price, photo, description, CategoryId } = req.body
        try {
            await Product.create({
                title,
                stock,
                size,
                price,
                photo,
                description,
                CategoryId
            })
            res.redirect('/products')
        } catch (error) {
            res.send(error)
        }
    }
    // Read product detail 
    static async listProductsDetail(req, res) {
        try {
            const productId = req.params.id;
            const product = await Product.findAll();
            const products = await Product.findByPk(productId, {
                include: Category
            });
            res.render('productDetail', { product, products, currencyFormatter });
        } catch (err) {
            res.send(err);
        }
    }
    static async categoryProduct(req, res) {
        try {
            // console.log(req.params);
            const { id } = req.params
            const products = await Product.findAll(
                {
                    where: {
                        CategoryId: id
                    }
                }
            );
            res.render('categoryProduct', { products, currencyFormatter });
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }
    static async buy(req, res) {
        try {
            console.log(req.params);
            const { id } = req.params

            await Transaction.create({
                UserId: req.session.userId,
                ProductId: id
            })

            res.redirect('/products')
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async cart(req, res) {
        try {
            // res.send('data masuk')
            let data = await Transaction.findAll({
                where: {
                    UserId: req.session.userId
                },
                include: {
                    model: Product
                }
            }
            )

            res.render('cart', { data, currencyFormatter })
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async Profile(req, res) {
        try {

            let user = await User.findOne({
                where: {
                    id : req.session.userId
                }
            })

            let data = await Profile.findOne({
                where: {
                    name: user.username
                }
            })
            // console.log(data);
            res.render('profile', { data })
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async edit(req, res) {
        try {
            
            let user = await User.findOne({
                where: {
                    id : req.session.userId
                }
            })

            let data = await Profile.findOne({
                where: {
                    name: user.username
                }
            })
            // console.log(data);
            res.render('editProfile', { data })

        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async insertEdit(req, res) {
        try {
            console.log(req.body);
            const {name, dateOfBirth, photoProfile, phoneNumber} = req.body
            await Profile.update({
                name, 
                dateOfBirth,
                photoProfile,
                phoneNumber
            },
            {
                where: {
                    name: name
                }
            }
            )
            res.redirect('/')
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }
}

module.exports = Controller;
