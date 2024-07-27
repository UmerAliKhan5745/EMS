import bcrypt from 'bcrypt';
import User from '../../models/auth/user';
import OTP from '../../models/auth/otp';
import { sendOtpEmail } from '../../services/emailOtpService';
import asyncHandler from 'express-async-handler';
import { sequelize } from '../../config/dbs';
import { sendOTP } from '../../services/phoneOtpService';
const MAX_RETRIES = 3;

const registerUser:any = async (req:any, res:any, retryCount = 0) => {

    const {  email, password, phoneNumber } = req.body;
    const transaction = await sequelize.transaction();
    
    try {
        const existingUser = await User.findOne({ 
            where: { 
                email: email || null,
                phoneNumber: phoneNumber || null
            } 
        }, { transaction });

        if (existingUser) {
            await transaction.rollback();
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({  email, phoneNumber, password: hashedPassword }, { transaction });
        
        await transaction.commit();

        if (email) {
            sendOtpEmail(user.email, user.id)
                .then(async (otp:any) => {
                    await OTP.create({ userId: user.id, otp: otp.code, expiresAt: otp.expiresAt });
                    console.log(`OTP email sent to ${user.email}`);
                })
                .catch(otpEmailError => {
                    console.error(`Error sending OTP email: ${otpEmailError.message}`);
                });
        } else if (phoneNumber) {
            sendOTP(user.id, user.phoneNumber)
                .then(async (otp:any) => {
                    await OTP.create({ userId: user.id, otp: otp.code, expiresAt: otp.expiresAt });
                    console.log(`OTP sent to the phone number ${user.phoneNumber}`);
                })
                .catch(sendOTPError => {
                    console.error(`Error sending OTP: ${sendOTPError.message}`);
                });
        }

        
      return  res.status(201).json({"message":"Please verify the OTP sent to your email or phone",user});
    } catch (error:any) {
        console.error(error.message);
        await transaction.rollback();

        if (error.message.includes('Lock wait timeout exceeded') && retryCount < MAX_RETRIES) {
            console.log(`Retrying transaction (${retryCount + 1}/${MAX_RETRIES})...`);
            return registerUser(req, res, retryCount + 1);
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

export const Register = asyncHandler(registerUser);
