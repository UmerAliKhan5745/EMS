import User from "../../models/auth/user";
import jwt from 'jsonwebtoken';
import OTP from "../../models/auth/otp";


// AuthController.ts
const verifyOTP = async (req: any, res: any) => {
    const { userId, otp } = req.body;
    try {
        const userOTP = await OTP.findOne({ where: { userId } });

        if (!userOTP) {
            return res.status(404).json({ message: 'OTP not found' });
        }

        if (userOTP.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (userOTP.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Mark user as verified
       await User.update({ isVerified: true }, { where: { id: userId } });

        // Generate JWT
        const token = jwt.sign({ userId }, 'umeralikhan', { expiresIn: '1h' });

        // Send response with JWT
        res.json({ success:true,message: "OTP verified successfully!", token });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { verifyOTP };
