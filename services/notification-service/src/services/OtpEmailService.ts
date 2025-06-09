import 'dotenv/config';
import nodemailer, { Transporter } from 'nodemailer';

const smtpUser = process.env.SMTP_USER?.toString();
const appPass = process.env.APP_PASS?.toString();

const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // Explicitly set Gmail's SMTP host
  port: 587,                // Use port 587
  secure: false,            // Set to false for port 587
  auth: {
    user: smtpUser,
    pass: appPass,
  },
  tls: {
    rejectUnauthorized: false,  // Should be set to true in production
  },
  logger: true,  // Enable logging for debugging
});


export const sendOtpEmail = async (to: string, otp: string): Promise<void> => {
    try {
      const mailOptions = {
        from: `"Your Service" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP is: ${otp} it is valid upto 5 minutes. This Otp is for Reseting your password. Please do not share this OTP with anyone.`,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('OTP Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw error;
    }
  };