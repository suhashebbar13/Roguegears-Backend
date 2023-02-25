const express = require("express");
//const {  } = require('../controller/category');
const {
  requireSignin,
  adminMiddleware,
  // uploadS3,
} = require("../common-middleware");
const {
  createProduct,
  getProductsBySlug,
  getProductDetailsById,
  deleteProductById,
  getProducts,
  createProductReview,
  deleteReviewsById
} = require("../controller/product");
const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const { signin } = require("../controller/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  // uploadS3.array("productPicture"),
  upload.array("productPicture"),
  createProduct
);
router.get("/products/:slug", getProductsBySlug);
router.post("/products/:slug/reviews", requireSignin, createProductReview);
//router.get('/category/getcategory', getCategories);
router.get("/product/:productId", getProductDetailsById);
router.delete("/product/deleteResviewById", requireSignin, adminMiddleware, deleteReviewsById);
router.delete(
  "/product/deleteProductById",
  requireSignin,
  adminMiddleware,
  deleteProductById
);
router.post(
  "/product/getProducts",
  requireSignin,
  adminMiddleware,
  getProducts
);

module.exports = router;
