"use strict";
// user.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Signup Route
router.post('/signup', user_controller_1.signup);
exports.default = router;
