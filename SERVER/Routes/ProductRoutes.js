const express = require("express");
const { DeleteProduct,
    AddProduct,
    GetAllProducts,
    GetSingleProduct,
    UpdateProduct,
    FeaturedProducts,
    NewArrivals,
    RelatedProducts,
    ProductAnalytics,
} = require("../Controllers/ProductController");

const { Auth } = require("../Middlewares/Auth");

const upload = require("../Middlewares/Multer");


const ProductRouter = express.Router();




ProductRouter.post("/add-product", Auth("admin"), upload.any(), AddProduct);

ProductRouter.get("/all-products", GetAllProducts);

ProductRouter.get("/admin/all-products", Auth("admin"), GetAllProducts);

ProductRouter.get("/single-product/:id", GetSingleProduct);

ProductRouter.put("/update-product/:id", Auth("admin"), upload.any(), UpdateProduct);

ProductRouter.delete("/delete-product/:id", Auth("admin"), DeleteProduct);


ProductRouter.get( "/featured-products", FeaturedProducts);

ProductRouter.get("/new-arrivals", NewArrivals);

ProductRouter.get("/related-products/:id", RelatedProducts);

ProductRouter.get( "/product-analytics", Auth("admin"), ProductAnalytics);

ProductRouter.use((error, req, res, next) => {
    if (error.name === "MulterError") {
        return res.status(400).json({ success: false, message: error.message });
    }

    if (error.message === "Only image files allowed") {
        return res.status(400).json({ success: false, message: error.message });
    }

    return next(error);
});



module.exports = ProductRouter;
