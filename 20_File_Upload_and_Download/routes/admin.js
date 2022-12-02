const express = require("express");
// const adminController = require("../controllers/admin"); // BACKUP
const adminController = require("./../controllers/admin_controllers/");
const router = express.Router();
const { productValidate } = require("./../middlewares/validators");

router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", productValidate, adminController.postAddProduct);
router.get("/products", adminController.getProducts);
router.get("/edit-product/:productId", adminController.getEditProduct);
router.post("/edit-product", productValidate, adminController.postEditProduct);
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
