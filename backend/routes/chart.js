const express=require("express")
const {create_chart,delete_chart,get_byID,getall,update_chart}=require("../controllers/sizechart")
const verifyAdmin=require("../middleware/auth")
const chart_R=express.Router()


chart_R.post("/add_sizeChart",verifyAdmin,create_chart)
chart_R.get("/getall_sizeCharts",getall)
chart_R.put("/update_sizeChart/:id",verifyAdmin,update_chart)
chart_R.delete("/delete_sizeChart/:id",verifyAdmin,delete_chart)
chart_R.get("/get_sizeChart/:id",get_byID)

module.exports=chart_R