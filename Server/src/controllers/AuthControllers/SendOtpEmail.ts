import bcrypt from 'bcrypt';
import User from '../../models/auth/user';
import OTP from '../../models/auth/otp';
import { sendOtpEmail } from '../../services/emailOtpService';
import { sendOTP } from '../../services/phoneOtpService';
import asyncHandler from 'express-async-handler';
import { sequelize } from '../../config/dbs';
import { Op } from 'sequelize'; // Import Op for logical operators

const MAX_RETRIES = 3;

const sendotpemail:any = async (req:any, res:any, retryCount = 0) => {
    const { email, phoneNumber } = req.body;
    const transaction = await sequelize.transaction();

    try {
        if (!email && !phoneNumber) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Email or phone number is required' });
        }

        // Find existing user by email or phone number
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email || null },
                    { phoneNumber: phoneNumber || null }
                ]
            }
        }, { transaction });

        if (!existingUser) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found' });
        }

        // Send OTP based on available contact information
        if (email) {
            sendOtpEmail(existingUser.email, existingUser.id)
                .then(async (otp:any) => {
                    await OTP.create({ userId: existingUser.id, otp: otp.code, expiresAt: otp.expiresAt });
                    console.log(`OTP email sent to ${existingUser.email}`);
                })
                .catch(otpEmailError => {
                    console.error(`Error sending OTP email: ${otpEmailError.message}`);
                });
        } else if (phoneNumber) {
            sendOTP(existingUser.id, existingUser.phoneNumber)
                .then(async (otp:any) => {
                    await OTP.create({ userId: existingUser.id, otp: otp.code, expiresAt: otp.expiresAt });
                    console.log(`OTP sent to the phone number ${existingUser.phoneNumber}`);
                })
                .catch(sendOTPError => {
                    console.error(`Error sending OTP: ${sendOTPError.message}`);
                });
        }

        await transaction.commit();
        return res.status(200).json({ message: "Please verify the OTP sent to your email or phone", user: existingUser });

    } catch (error:any) {
        console.error(error.message);
        await transaction.rollback();


        res.status(500).json({ error: 'Internal server error' });
    }
};

export const SendOtpEmail = asyncHandler(sendotpemail);
