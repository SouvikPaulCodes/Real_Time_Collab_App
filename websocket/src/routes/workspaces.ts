import { Router } from "express";
import { protection } from "../middleware/protectRoutes.js";
import getWorkspaces from "../controllers/workspaces.all.js";
import { patchTitle } from "../controllers/workspaces.title.js";

const router = Router();

router.get('/', protection, getWorkspaces);

router.patch('/title', protection, patchTitle)

export {router as workRouter}