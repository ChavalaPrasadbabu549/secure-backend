import connectDB from "./config/db";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import userRoutes from "./routes/user";


dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "https://secureportalfrontend.netlify.app/",
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());

app.use("/user", userRoutes);


const server = createServer(app);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
