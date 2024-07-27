// server/controllers/authController.js

const { User } = require('../../models/auth/user'); // Adjust according to your model setup
const bcrypt = require('bcrypt');
import asyncHandler from 'express-async-handler';
import OTP from '../../models/auth/otp';

const registerUser: any = async (req: any, res: any) => {
  const { otp, newPassword } = req.body;
  try {
    // Step 1: Find the OTP record
    const otpRecord = await OTP.findOne({ where: { otp } });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Step 2: Find the user associated with the OTP
    const user = await User.findByPk(otpRecord.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 3: Update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: hashedPassword },  // Values to update
      { where: { id: user.id } }     // Where clause
    );

    // Optionally, delete the OTP record after successful reset
    await otpRecord.destroy();

    // Send success response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    console.error('Error resetting password:', error.message);
    res.status(500).json({ message: 'An error occurred while resetting the password' });
  }
};

export const ReSetPassword = asyncHandler(registerUser);
