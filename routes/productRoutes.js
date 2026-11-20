const express = require("express");
const {getProducts, getProductById, createProduct, updateProduct, deleteProduct} = require("../controllers/productController.js");
const {protect, admin} = require("../middleware/auth.js");

const router = express.Router();


router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;