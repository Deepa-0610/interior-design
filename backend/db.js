const mongoose = require("mongoose");
async function connectDB() {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/interior_design2"
        );
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB error:", error.message);
    }
}
module.exports = connectDB;