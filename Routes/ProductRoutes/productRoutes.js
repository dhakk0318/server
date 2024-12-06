 // routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../../Controllers/ProductContoller/productController');
const { authenticate } = require("../../Middlewares/AuthMiddleware");


 router.post('/',  productController.createProduct);
 
 router.get('/:pid', productController.getProductById);

    

 router.get('/', productController.getAllProducts);
  
 
router.get('/subcategories/:categoryId',  productController.getSubcategories);
router.get('/categories/subcategories',  productController.getCategoriesWithSubcategories );

 
router.patch('/:pid', productController.updateProduct);
  
module.exports = router;

 
 