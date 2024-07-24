 
import nodemailer from "nodemailer";
import OTP from "../models/auth/otp";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "aumeralikhan@gmail.com",
      pass: "ymkm yweh mljg wyzd",
    },
  });


 
const  otp = Math.floor(100000 + Math.random() * 900000).toString();
const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  
  export const sendOtpEmail = async (email: string,userId:number) => {



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


 let a=  await OTP.create({
    userId,
    otp,
    expiresAt
});

console.log(a,'o')
      }
    } catch (error) {
  
      console.error("Error sending verification email:", error);
    }
  };