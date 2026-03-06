const express=require("express")
const settings_R=express.Router()
const {del_setting,get_byID,getall,update_setting, create_setting}=require("../controllers/settings")
const verifyAdmin = require("../middleware/auth")



settings_R.post("/add_settings",verifyAdmin,create_setting)
settings_R.get("/getall_settings",verifyAdmin,getall)
settings_R.put("/update_settings/:id",verifyAdmin,update_setting)
settings_R.delete("/delete_setting/:id",verifyAdmin,del_setting)
settings_R.get("/get_settings/:id",verifyAdmin,get_byID)

module.exports=settings_R