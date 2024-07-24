import { SinchClient } from "@sinch/sdk-core";
import OTP from "../models/auth/otp";

// Initialize Sinch Client with your credentials
const sinchClient = new SinchClient({
    projectId: '08772ab1-bfa6-4d95-977d-e8b6fe588c8e',
    keyId: 'efd86b80-eca9-4465-a52f-20d7f84defc4',
    keySecret: 'O4bakVTQvitw.QNp2oyTpipp~q'
});

// Function to generate a random OTP
const  otp = Math.floor(100000 + Math.random() * 900000).toString();
const expiresAt = new Date(Date.now() + 10 * 60 * 1000);


// Function to send the OTP via SMS
export const sendOTP=async(userId: number,phoneNumber:number)=> {
    
    // console.log(otp)
    const formatPhoneNumber = (phoneNumber:any) => phoneNumber.replace(/^0/, '+92');
    const internationalNumber = formatPhoneNumber(phoneNumber);
    try {
  
        const response = await sinchClient.sms.batches.send({
            sendSMSRequestBody: {
                to: [
                    internationalNumber
                                    ],
                from: "447520651565", // Sender phone number
                body: `Your OTP is ${otp}. This code is valid for 5 minutes.` // OTP message
            }
        });

        console.log('Response:', JSON.stringify(response, null, 2));
        await OTP.create({
            userId,
            otp,
            expiresAt
        });
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}

