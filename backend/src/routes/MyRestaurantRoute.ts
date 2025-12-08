import express from 'express'
import multer from 'multer'
import { createMyRestaurant, getMyRestaurant, updateMyRestaurant } from '../controllers/MyRestaurantController.js'
import { jwtCheck, jwtParse } from '../middleware/auth.js'
import { validateMyRestaurantRequest } from '../middleware/validation.js'


const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 2024 * 1024,
    },
});
// /api/my/restaurant
router.get("/", jwtCheck, jwtParse, getMyRestaurant)
router.post("/", upload.single("imageFile"), validateMyRestaurantRequest, jwtCheck, jwtParse, createMyRestaurant)
router.put("/", upload.single("imageFile"), validateMyRestaurantRequest, jwtCheck, jwtParse, updateMyRestaurant)





export default router