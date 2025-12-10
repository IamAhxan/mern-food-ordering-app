import express, { type Request, type Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import MyUserRoute from "./routes/MyUserRoutes.js"
import myRestaurantRoute from "./routes/MyRestaurantRoute.js"
import RestaurantRoute from "./routes/RestaurantRoute.js"
import OrderRoute from "./routes/OrderRoute.js"
import { v2 as cloudinary } from 'cloudinary'

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => console.log("Connected to Database"))

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_SECRET_KEY!
})

const app = express();
app.use(cors());

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));
app.use(express.json());



app.get("/health", async (req: Request, res: Response) => {
    res.send({ message: "Health OK!" })
})

app.use("/api/my/user", MyUserRoute)
app.use("/api/my/restaurant", myRestaurantRoute)
app.use("/api/restaurants", RestaurantRoute)
app.use("/api/order", OrderRoute)

app.listen(7000, () => {
    console.log("Server started on localhost:7000")
})