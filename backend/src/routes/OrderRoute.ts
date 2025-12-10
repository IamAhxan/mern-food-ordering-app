import express from "express"
import { jwtCheck, jwtParse } from "../middleware/auth.js";
import { createCheckoutSession } from "../controllers/OrderController.js";


const router = express.Router()


router.post("/checkout/create-checkout-session", jwtCheck, jwtParse, createCheckoutSession);

export default router