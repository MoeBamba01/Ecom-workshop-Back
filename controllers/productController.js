const Product = require("../models/Product.js");


async function getProducts(req, res) {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json(products);
} catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  // get product  by id

  async function getProductById(req, res) {
    try{
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // creer produit admin

  async function createProduct(req, res) {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }


  // update product admin

  async function updateProduct(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // delete product admin

  async function deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };