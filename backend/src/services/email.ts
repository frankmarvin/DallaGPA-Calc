import nodemailer from 'nodemailer';

// Configure transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email verification link.
 */
export const sendVerificationEmail = async (email: string, userId: string) => {
  const link = `${process.env.FRONTEND_URL}/verify/${userId}`;
  await transporter.sendMail({
    to: email,
    subject: 'Verify your email – DallaGPA',
    html: `
      <h1>Welcome to DallaGPA</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
};

/**
 * Send password reset email.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Reset your DallaGPA password',
    html: `
      <h1>Password Reset</h1>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};

/**
 * Send notification about results published.
 */
export const sendResultPublishedEmail = async (email: string, studentName: string, semester: string) => {
  await transporter.sendMail({
    to: email,
    subject: 'Your results have been published',
    html: `
      <h1>Results Published</h1>
      <p>Dear ${studentName},</p>
      <p>Your results for ${semester} have been published. Please log in to view your GPA and CGPA.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard">View Dashboard</a>
    `,
  });
};
