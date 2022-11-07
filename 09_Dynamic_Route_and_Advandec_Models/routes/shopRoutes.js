const express = require("express");
const shopControllers = require("../controllers/shopControllers");
const router = express.Router();

router.get("/", shopControllers.getIndex);
router.get("/products", shopControllers.getProducts);
router.get("/products/:productId", shopControllers.getProduct);
router.get("/cart", shopControllers.getCart);
router.post("/cart", shopControllers.postCart);
router.post("/cart-delete-item", shopControllers.postCartDeleteProduct);
router.get("/orders", shopControllers.getOrders);
router.get("/checkout", shopControllers.getCheckout);

module.exports = router;
