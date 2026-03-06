const express=require("express")
const admin_R=express.Router()
const {add_Admin,del_admin,get_byID,getall,update_admin,login}=require("../controllers/admin")
const verifyAdmin = require("../middleware/auth")



admin_R.post("/add_admin",verifyAdmin,add_Admin)
admin_R.get("/getall_admins",verifyAdmin,getall)
admin_R.put("/update_admin/:id",verifyAdmin,update_admin)
admin_R.delete("/delete_admin/:id",verifyAdmin,del_admin)
admin_R.get("/get_admin/:id",verifyAdmin,get_byID)
admin_R.post("/admin_login",login)


module.exports=admin_R