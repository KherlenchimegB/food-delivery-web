import nodemailer from 'nodemailer';

// Gmail SMTP тохиргоо
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'your-email@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
    }
  });
};

// Reset password email илгээх
export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  try {
    // Development mode-д email илгээхгүйгээр зөвхөн console.log хийх
    if (process.env.NODE_ENV === 'development' && 
        (process.env.GMAIL_USER === 'your-email@gmail.com' || !process.env.GMAIL_APP_PASSWORD)) {
      return { success: true, messageId: 'development-mode' };
    }

    const transporter = createTransporter();
    
    // Reset password URL үүсгэх
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.GMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request - Food Delivery',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You have requested to reset your password for your Food Delivery account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This email was sent from Food Delivery App. Please do not reply to this email.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    return { success: false, error: error };
  }
};

// Email илгээх тест
export const testEmailService = async () => {
  try {
    // Development mode-д email илгээхгүйгээр зөвхөн console.log хийх
    if (process.env.NODE_ENV === 'development' && 
        (process.env.GMAIL_USER === 'your-email@gmail.com' || !process.env.GMAIL_APP_PASSWORD)) {
      return { success: true, messageId: 'development-mode' };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.GMAIL_USER || 'your-email@gmail.com',
      to: process.env.GMAIL_USER || 'your-email@gmail.com',
      subject: 'Email Service Test - Food Delivery',
      text: 'This is a test email to verify that the email service is working correctly.'
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    return { success: false, error: error };
  }
};
