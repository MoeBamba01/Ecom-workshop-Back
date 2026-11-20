const express = require("express");
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController.js");
const { protect, admin } = require("../middleware/auth.js");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
