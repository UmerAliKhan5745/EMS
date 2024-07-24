import User from "../../models/auth/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

export const Login = asyncHandler(async (req: any, res: any) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({ error: 'Account not verified. Please verify your email or phone number.' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, 'umeralikhan', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
