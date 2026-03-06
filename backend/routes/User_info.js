const express=require("express")
const user_route=express.Router()
const {create_user,delete_user,get_byID,getall,update_userINFO}=require("../controllers/User_info")
const verifyAdmin = require("../middleware/auth")


user_route.get("/get_Users",verifyAdmin,getall)
user_route.get("/get_User/:id",verifyAdmin,get_byID)
user_route.post("/create_UserInfo",create_user)
user_route.delete("/delete_UserInfo/:id",verifyAdmin,delete_user)
user_route.put("/update_UserInfo/:id",verifyAdmin,update_userINFO)

module.exports=user_route