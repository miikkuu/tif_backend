const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const communityRoutes = require("./routes/community");
const memberRoutes = require("./routes/member");
const roleRoutes = require("./routes/role");
const errorHandler = require("./middleware/errorMiddleware.js");
const {Snowflake} = require('@theinternetfolks/snowflake');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log("Connected to MongoDB");})
  .catch((error) => {  console.error("Failed to connect to MongoDB:", error); });

app.use("/v1/auth", authRoutes);
app.use("/v1/community", communityRoutes);
app.use("/v1/member", memberRoutes);
app.use("/v1/role", roleRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
