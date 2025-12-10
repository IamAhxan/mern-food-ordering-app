import express from "express";
import { param } from "express-validator";
import {
    getRestaurant,
    searchRestaurant,
} from "../controllers/RestaurantController.js";

const router = express.Router();

router.get(
    "/:restaurantId",
    param("restaurantId")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("RestaurantId parament must be a valid string"),
    getRestaurant
),
    router.get(
        "/search/:city",
        param("city")
            .isString()
            .trim()
            .notEmpty()
            .withMessage("City parament must be a valid string"),
        searchRestaurant
    );

export default router;
