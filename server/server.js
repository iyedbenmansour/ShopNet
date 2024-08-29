const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
require("./config/shopnet.config"); 
const bodyParser = require('body-parser');


const port = process.env.PORT || 5000;

// Import the router
const buyerRoutes = require("./routes/buyerRoutes"); 
const sellerRoutes = require("./routes/sellerRoutes");
const authRouter = require('./routes/authRouter');
const productRoutes = require('./routes/productRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const orderRoutes = require('./routes/orderRoutes');





const app = express(); 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the buyer router
app.use("/api", buyerRoutes);
app.use('/api', sellerRoutes);
app.use('/api', authRouter);
app.use('/api', productRoutes);
app.use('/api/', verificationRoutes);
app.use('/api/', orderRoutes);




// Start the server
app.listen(port, () => console.log(`Listening on port ${port}`));
