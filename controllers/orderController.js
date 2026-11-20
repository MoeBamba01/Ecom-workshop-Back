const Order = require("../models/Order.js");
const Product = require("../models/Product.js");

// creer commande (connecté)
// body : { items: [{ product: "<id>", quantity: 2 }], shippingAddress: "..." }
async function createOrder(req, res) {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({ message: "Quantité invalide" });
      }

      // On prend le VRAI prix dans la base, jamais celui envoyé par le front
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant : ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
      totalPrice += product.price * item.quantity;
    }

    // On enlève les quantités du stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// mes commandes (connecté)
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// toutes les commandes (admin)
async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// changer le statut (admin)  body : { status: "expediee" }
async function updateOrderStatus(req, res) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
