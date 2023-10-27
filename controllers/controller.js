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

            const categories = await Category.findAll();
            
            res.render('home', { categories });
        } catch (err) {
            res.send(err.message);
        }
    }
    // READ Product
    static async listProducts(req, res) {
        try {
            const {search} = req.query
            const {low} = req.query
            const {high} = req.query
            let option;

            if(search) {
                option = {
                    where: {
                        title:{
                            [Op.iLike]: `%${search}%`
                        }
                    }
                }
            }

            if(low) {
                option = {
                    order: [['price', 'Asc']]
                }
            }

            if(high) {
                option = {
                    order: [['price', 'DESC']]
                }
            }


            const products = await Product.findAll(option);
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

    // GET Edit Form Product
    static async getEditProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = await Product.findByPk(productId);
            const categories = await Category.findAll();
            
            res.render('editProduct', { product, data: categories });

        } catch (err) {
            res.send(err.message);
        }
    }

    // POST Edit Form Product
    static async postEditProduct(req, res) {
        try {
            const { title, stock, size, price, photo, description, CategoryId } = req.body;
            const productId = req.params.id;

            // Update produk
            await Product.update({
                title,
                stock,
                size,
                price,
                photo,
                description,
                CategoryId
            }, {
                where: { id: productId }
            });

            res.redirect('/products');
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

    static async getDeleteProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = await Product.findByPk(productId);
            await product.destroy();
            res.redirect('/products');
        } catch (err) {
            res.send(err);
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
            const user = await User.findOne({
                where: {
                    id: req.session.userId
                }
            });

            const profile = await Profile.findOne({
                where: {
                    name: user.username
                }
            })

            console.log(user);
            res.render('profile', { user, profile });
        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    }
    
    static async edit(req, res) {
        try {
            const user = await User.findOne({
                where: {
                    id: req.session.userId
                },
                include: Profile
            });
    
            res.render('editProfile', { user });
        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    }
    
    static async insertEdit(req, res) {
        try {
            console.log(req.body);
            const { name, dateOfBirth, photoProfile, phoneNumber, username } = req.body;
    
            await Profile.update(
                {
                    name,
                    dateOfBirth,
                    photoProfile,
                    phoneNumber
                },
                {
                    where: {
                        name: username
                    }
                }
            );
    
            res.redirect('/profile');
        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    }
    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);
            
            await user.destroy();
            res.redirect('/logout');
        } catch (err) {
            res.send(err.message);
        }
    }    
    
}

module.exports = Controller
