const mongoose = require("mongoose");

// MongoDB Atlas connection string (replace <db_password> with the actual password)
const mongoURI = `mongodb+srv://shopnet:Aeazkmi123@shopnet.bgvsa.mongodb.net/shopnet?retryWrites=true&w=majority&appName=shopnet`;

mongoose.connect(mongoURI)
  .then(() => console.log("Connected to shopnet database on MongoDB Atlas"))
  .catch((err) => console.log("Error connecting to MongoDB Atlas:", err));
