import { Router } from "express";
import { protection } from "../middleware/protectRoutes.js";
import getMessages from "../controllers/messages.all.js";

const router = Router();

router.get('/', protection, getMessages);

export {router as msgRouter}