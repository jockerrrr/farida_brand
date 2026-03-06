const express=require("express")
const discount_route=express.Router()
const verifyAdmin=require("../middleware/auth")
const {add_disc,delete_discount,get_byID,getall,update_disc}=require("../controllers/discount")



discount_route.post("/add_discount",verifyAdmin,add_disc)
discount_route.get("/getall_discounts",verifyAdmin,getall)
discount_route.put("/update_discount/:id",verifyAdmin,update_disc)
discount_route.delete("/delete_discount/:id",verifyAdmin,delete_discount)
discount_route.get("/get_discount/:id",verifyAdmin,get_byID)

module.exports=discount_route