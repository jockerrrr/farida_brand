const express=require("express")
const prod_route=express.Router()
const {create_product,delete_prod,get_byID,getall,update_product,upload_images}=require("../controllers/product")
const upload = require("../middleware/Upload");
const verifyAdmin = require("../middleware/auth");




prod_route.get("/get_products",getall)
prod_route.get("/get_product/:id",get_byID)
prod_route.post("/create_product",verifyAdmin,create_product)
prod_route.delete("/delete_product/:id",verifyAdmin,delete_prod)
prod_route.put("/update_product/:id",verifyAdmin,update_product)
prod_route.post("/upload_images/:id",verifyAdmin,upload.array("images", 10), upload_images);



module.exports=prod_route