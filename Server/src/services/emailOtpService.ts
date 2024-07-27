 
import nodemailer from "nodemailer";
import OTP from "../models/auth/otp";
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "aumeralikhan@gmail.com",
      pass: "ymkm yweh mljg wyzd",
    },
  });


 
function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString(); // Generates a 6-digit OTP
}


const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  
  export const sendOtpEmail = async (email: string,userId:number) => {
    const  otp = generateOTP()
console.log(otp)


    try {
      // Hardcoded subject and text for OTP authentication
      const info = await transporter.sendMail({
        from: '"From e-commerce" <aumeralikhan@gmail.com>',
        to: email,
        subject: "OTP for Authentication",
        text:`your OTP is ${otp} it is valid for 5 min`
      });
  



      if (info) {
        console.log("Verification email sent:", info.messageId);


   await OTP.create({
    userId,
    otp,
    expiresAt
});

      }
    } catch (error) {
  
      console.error("Error sending verification email:", error);
    }
  };