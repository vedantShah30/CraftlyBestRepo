import express from "express";
import {
  createChat,
  updateChat,
  getCode,
  saveCode,
} from "../controller/code.js";
const router = express.Router();
router.post("/create", createChat);
router.post("/update/:id", updateChat);
router.get("/get/:id", getCode);
router.post("/save/:id", saveCode);
export default router;
