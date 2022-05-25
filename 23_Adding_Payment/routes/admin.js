const path = require("path");
const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();
const { productValidate } = require("./../middlewares/validators");

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", productValidate, adminController.postAddProduct);

// /admin/products => GET
router.get("/products", adminController.getProducts);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/edit-product", productValidate, adminController.postEditProduct);

// router.post("/delete-product", adminController.postDeleteProduct);

// --> Asynchronous Requests on Javascript
router.delete("/product/:productId", adminController.deleteProduct);

module.exports = router;
