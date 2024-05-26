require("dotenv").config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 5001;

const { connectToDB} = require("./db")
const transactionRoutes = require("./routes/transactionroutes")

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDB()

// initial home route 

app.get('/',async(req,res)=>{
    res.status(200).send("this is '/' route")
})

app.use("/api",transactionRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
