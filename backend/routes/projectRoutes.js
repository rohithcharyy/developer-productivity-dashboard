import express from "express";

import {
    getProjects,
    getProjectById,
    createProject
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);

export default router;