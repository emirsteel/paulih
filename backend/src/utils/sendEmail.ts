import nodemailer from "nodemailer";

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  try {
    console.log(`Sending email to: ${to} with subject: ${subject}`);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Paulih Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text, // Fallback text version
      html, // HTML version for better design
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email. Please try again later.");
  }
};

export default sendEmail;
