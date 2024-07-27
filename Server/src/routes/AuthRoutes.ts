import { Login } from "../controllers/AuthControllers/login";
import {  Register } from "../controllers/AuthControllers/register";

import express from 'express';
import { validateRegister, validateLogin } from "../validation/auth";
import { authenticateToken } from "../midddleware/authMiddleware";
import { verifyOTP } from "../controllers/AuthControllers/verifyOTP";
import { ReSetPassword } from "../controllers/AuthControllers/forgetPassword";
import { SendOtpEmail } from "../controllers/AuthControllers/SendOtpEmail";
import { Dashboard } from "../controllers/AuthControllers/Dashboard";
import { Protected } from "../controllers/AuthControllers/protected";

 const router = express.Router();


router.post('/auth/register',validateRegister,Register );

router.post('/auth/login',validateLogin,Login );

router.put('/auth/resetpassword',ReSetPassword );


router.post('/auth/send-otp-email', SendOtpEmail);

// routes.ts
router.post('/auth/verify-otp', verifyOTP);

router.get('/auth/protected',Protected);


router.get('/deleteitsoon',Dashboard);


module.exports = router;
