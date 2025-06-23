import nodemailer from "nodemailer";

// Generate a random OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

// Send OTP via email using Nodemailer
export const sendOTPByEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tech@diamondore.in",
        pass: "zlnbcvnhzdddzrqn",
      },
    });

    const mailOptions = {
      from: "Diamondore.in <tech@diamondore.in>",
      to: `Recipient <${email}>`,
      subject: "One Time Password",
      text: `Your OTP is: ${otp}`,
      html: `<h1 style="color: blue; text-align: center; font-size: 2rem">Diamond Consulting Pvt. Ltd.</h1> </br> <h3 style="color: black; font-size: 1.3rem; text-align: center;">Your OTP is: ${otp}</h3>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}; 