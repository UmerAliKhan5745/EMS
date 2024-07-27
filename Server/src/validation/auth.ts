import { check, validationResult, body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Common validation rules
const validateEmailOrPhone = [
    body('email').optional().isEmail().withMessage('Enter a valid email'),
    body('phoneNumber').optional().isMobilePhone('any').withMessage('Enter a valid phone number'),
    body().custom((value, { req }) => {
        if (!req.body.email && !req.body.phoneNumber) {
            throw new Error('Either email or phone number is required');
        }
        return true;
    })
];

const validatePassword = check('password').exists().withMessage('Password is required');

// Middleware to handle validation results
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Registration-specific validation
const validateRegister = [
    ...validateEmailOrPhone,
    validatePassword.isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
];

// Login-specific validation
const validateLogin = [
    ...validateEmailOrPhone,
    validatePassword,
    handleValidationErrors
];

export { validateRegister, validateLogin };
