const express = require("express");
const adminController = require("../controllers/adminControllers");
const router = express.Router();
const { productValidations } = require("../middlewares/validators");

router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", productValidations, adminController.postAddProduct);
router.get("/products", adminController.getProducts);
router.get("/edit-product/:productId", adminController.getEditProduct);
router.post(
  "/edit-product",
  productValidations,
  adminController.postEditProduct,
);
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
