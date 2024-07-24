import { Login } from "../controllers/AuthControllers/login";
import {  Register } from "../controllers/AuthControllers/register";

import express from 'express';
import { validateRegister, validateLogin } from "../validation/auth";
import { authenticateToken } from "../midddleware/authMiddleware";
import { verifyOTP } from "../controllers/AuthControllers/verifyOTP";
 const router = express.Router();


router.post('/auth/register',validateRegister,Register );

router.post('/auth/login',validateLogin,Login );

router.post('/auth/protected',authenticateToken );

// routes.ts
router.post('/auth/verify-otp', verifyOTP);




module.exports = router;
