const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const User = require("./models/user");
const portfolioRoutes = require("./routes/portfolioRoutes");
const userRoutes = require('./routes/userRoutes');       // with your other requires, at the top
      
app.use(cors());
dotenv.config();
app.use(express.json({ limit: '1mb' }));
app.use('/api/users', userRoutes);   

app.get("/", (req,res)=>{
    res.send("Hello from backend");
})

app.post("/api/users", async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: "Error creating user", error: err.message });
    }
})

app.get('/api/test', (req,res)=>{
    res.json({message: "Backend is working fine"});
})

const authRoutes = require('./routes/authroutes')
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("MongoDB connected successfully");
    app.listen(5000, () => {
        console.log("Server is running on port 5000");
    })
})
.catch((err) => {
    console.log("MongoDB connection failed", err);
});