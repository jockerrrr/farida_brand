const express=require("express")
const order_route=express.Router()
const {create_order,getall,update_order,delete_order,get_byID,verifyOrder,returnPolicy}=require("../controllers/order")
const verifyAdmin = require("../middleware/auth")


order_route.post("/create_order",create_order)
order_route.get("/getall_orders",verifyAdmin,getall)
order_route.put("/update_order/:id",verifyAdmin,update_order)
order_route.delete("/delete_order/:id",verifyAdmin,delete_order)
order_route.get("/get_order/:id",verifyAdmin,get_byID)
order_route.post("/verify_order",verifyOrder)
order_route.post("/return_order",returnPolicy)



module.exports=order_route