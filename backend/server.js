const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors=require("cors")
const cookieParser = require("cookie-parser");


dotenv.config(); // must be first!

const order_route = require("./routes/order");
const user_route = require("./routes/User_info");
const prod_route = require("./routes/Product");
const discount_route=require("./routes/discount");
const chart_R = require("./routes/chart");
const settings_R = require("./routes/settings");
const admin_R = require("./routes/admin");

const app = express();
app.use(express.json());
app.use(cookieParser())



app.use(cors({
  origin: ["http://localhost:5173", // your React app,
  process.env.FRONTEND_URL
],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use("/api/orders", order_route);
app.use("/api/users", user_route);
app.use("/api/products", prod_route);
app.use("/api/discounts",discount_route)
app.use("/api/size_chart",chart_R)
app.use("/api/settings",settings_R)
app.use("/api/admin",admin_R)




mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err.message);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});