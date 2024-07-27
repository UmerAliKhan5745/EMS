import { Request, Response } from "express";



// Controller to verify OTP and register user
export const Protected = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      status: 'success',      
    });
    return true
  } catch (error) {
    console.error('Error during Prtected:', error);
    
  }
};