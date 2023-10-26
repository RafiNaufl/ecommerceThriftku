const { Category, Product, Sequelize } = require('../models');
const { Op } = Sequelize;
const { currencyFormatter } = require('../helpers');

class Controller {
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
            const products = await Product.findAll({
                include: Category
            });
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
        const {title, stock, size, price, photo, description, CategoryId} = req.body
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
    
}

module.exports = Controller;
