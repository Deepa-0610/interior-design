const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const app = express();
const router = express.Router();
app.use(cors());
app.use(bodyParser.json());
// USER
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);
//  DESIGN  
const designSchema = new mongoose.Schema({
    userId: String,
    room: String,
    style: String,
    budget: Number,
    furniture: Array
});
const Design = mongoose.model("Design", designSchema);
//  EMAIL  
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "deepalinges06@gmail.com",
        pass: "dbyr fgal fowv mduh"
    }
});
//  SIGNUP  
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }
        const existingUser =
            await User.findOne({ email });
        if (existingUser) {
           return res.status(400).json({
                message: "Email already registered"
            });
        }
        const hashedPassword =
            await bcrypt.hash(password, 10);
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        await user.save();
        // Welcome email
        try {
            await transporter.sendMail({
                from: "deepalinges06@gmail.com",
                to: email,
                subject: "Welcome to Interior Planner",
                text: `Hello ${name},

                Welcome to Virtual Interior Design Planner.

                Your account has been created successfully.
                Regards,
                Interior Planner`
            });
        } catch (mailError) {
            console.log(
                "Email could not be sent:",
                mailError.message
            );
        }
        res.json({
            message: "Registration successful!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Registration failed"
        });
    }
});
//  LOGIN  
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Enter email and password"
            });
        }
        const user =
            await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        const match =
            await bcrypt.compare(
                password,
                user.password
            );
        if (!match) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Login failed"
        });
    }
});
//  GET DESIGNS  
router.get("/designs", async (req, res) => {
    try {
        const designs = await Design.find({
            userId: req.query.userId
        });
        res.json(designs);
    } catch (error) {
        res.status(500).json({
            message: "Could not get designs"
        });
    }
});
//  GET ONE DESIGN  
router.get("/designs/:id", async (req, res) => {
    try {
        const design = await Design.findOne({
            _id: req.params.id,
            userId: req.query.userId
        });
        if (!design) {
            return res.status(404).json({
                message: "Design not found"
            });
        }
        res.json(design);
    } catch (error) {
        res.status(500).json({
            message: "Could not get design"
        });
    }
});
//  CREATE DESIGN  
router.post("/designs", async (req, res) => {
    try {
        const {
            userId,
            room,
            style,
            budget,
            furniture
        } = req.body;
        if (
            !userId ||
            !room ||
            !style ||
            !budget ||
            !Array.isArray(furniture) ||
            furniture.length === 0
        ) {
            return res.status(400).json({
                message: "Please complete the design"
            });
        }
        const design = new Design({
            userId,
            room,
            style,
            budget,
            furniture
        });
        await design.save();
        res.json({
            message: "Design saved successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Could not save design"
        });
    }
});
//  UPDATE DESIGN  
router.put("/designs/:id", async (req, res) => {
    try {
        const design =
            await Design.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.body.userId
                },
                req.body,
                { new: true }
            );
        if (!design) {

            return res.status(404).json({
                message: "Design not found"
            });
        }
        res.json({
            message: "Design updated",
            design: design
        });
    } catch (error) {
        res.status(500).json({
            message: "Update failed"
        });
    }
});
//  DELETE DESIGN  
router.delete("/designs/:id", async (req, res) => {
    try {
        const design =
            await Design.findOneAndDelete({
                _id: req.params.id,
                userId: req.query.userId
            });
        if (!design) {

            return res.status(404).json({
                message: "Design not found"
            });
        }
        res.json({
            message: "Design deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: "Delete failed"
        });
    }
});
// EXTERNAL ROUTES

router.get("/instagram", (req, res) => {
    res.redirect("https://www.instagram.com");
});

router.get("/youtube", (req, res) => {
    res.redirect("https://www.youtube.com");
});
//  ROUTER  
app.use("/api", router);
//  SERVER  
connectDB().then(() => {
    app.listen(3000, () => {
        console.log(
            "Server running on http://localhost:3000"
        );
    });
});