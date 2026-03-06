const mongoose = require("mongoose");

const chart_schema = mongoose.Schema({
  chart_name: {
    type: String,
    required: true,
  },
  measurments: [
    {
      size:String,
      values: {
        type: Map,
        of: String,
      },
    },
  ]
});

module.exports=mongoose.model("Chart",chart_schema)
