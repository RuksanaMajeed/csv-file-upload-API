const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");


const { MONGODB_URL, PORT } = process.env;

const app = express();

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected Success"))
.catch((err) => console.error(err));

app.use(
    cors({
        origin:["http://localhost:3000, http://localhost:4000/"],
        methods:["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)
app.use(cors())
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});

app.use("/", authRoute)
