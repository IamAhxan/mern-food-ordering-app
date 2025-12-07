import express, { type Request, type Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import myUserRoute from "./routes/MyUserRoutes.js"

mongoose.connect(process.env.MONGODB_CONNNECTION_STRING as string).then(() => console.log("Connected to Database"))
const app = express();
app.use(express.json());
app.use(cors());


app.get("/health", async (req: Request, res: Response) => {
    res.send({ message: "Health OK!" })
})

app.use("/api/my/user", myUserRoute)

app.listen(7000, () => {
    console.log("Server started on localhost:7000")
})