const chart_db=require("../models/SizeChart")

const create_chart=async (req,res)=>{
    try {
        const chart=new chart_db(req.body)
        await chart.save()
        res.status(201).json({message:"size chart created"})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

const getall=async (req,res)=>{
    try {
        const sizecharts=await chart_db.find()
        res.status(200).json(sizecharts)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const update_chart = async (req, res) => {
  try {
    const updatechart = await chart_db.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatechart) return res.status(404).json({ message: "chart not found" });
    res.status(200).json({ message: "chart updated", updatechart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const delete_chart = async (req, res) => {
  try {
    const doc = await chart_db.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "chart not found" });
    res.status(200).json({ message: "chart deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get_byID = async (req, res) => {
  try {
    const chart = await chart_db.findById(req.params.id);
    if (!chart) return res.status(404).json({ message: "chart not found" });
    res.status(200).json(chart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports={create_chart,getall,get_byID,delete_chart,update_chart}