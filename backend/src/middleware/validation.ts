import { notDeepEqual } from "assert";
import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next();
}

export const validateMyUserRequest = [
    body("name").isString().notEmpty().withMessage("Name Must be a String"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a String"),
    body("city").isString().notEmpty().withMessage("City must be String"),
    body("country").isString().notEmpty().withMessage("country must be String"),
    handleValidationErrors,
];





export const validateMyRestaurantRequest = [
    body("restaurantName").notEmpty().withMessage("Restaurant Name is Required"),
    body("city").notEmpty().withMessage("city Name is Required"),
    body("country").notEmpty().withMessage("Country Name is Required"),
    body("deliveryPrice").isFloat({ min: 0 }).withMessage("Delivery price must be a positive number"),
    body("estimatedDelivery").isInt({ min: 0 }).withMessage("Estimated Delivery Time must be a positive Integer"),
    body("cuisines").isArray().withMessage("Cuisines myust be an Array").not().isEmpty().withMessage("Cuisines array can not be empty"),
    body("menuItems").isArray().withMessage("Menu Items must be an array"),
    body("menuItems.*.name").notEmpty().withMessage("Menu Item name is required"),
    body("menuItems.*.price").isFloat({ min: 0 }).withMessage("Menu Item Pricemust be a positive Numeber"),
    handleValidationErrors

]