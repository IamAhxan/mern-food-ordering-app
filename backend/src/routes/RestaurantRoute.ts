import express from 'express'
import { param } from 'express-validator';
import { searchRestaurant } from './RestaurantController.js';

const router = express.Router()

router.get("/search/:city", param("city").isString().trim().notEmpty().withMessage("City parament must be a valid strinf"), searchRestaurant)

export default router;