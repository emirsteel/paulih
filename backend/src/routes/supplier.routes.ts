import express from "express";
import { supplierLogin } from "../controllers/supplier.controller";

const router = express.Router();

router.post("/login", supplierLogin);

export default router;
