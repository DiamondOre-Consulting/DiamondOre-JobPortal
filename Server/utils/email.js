import nodemailer from "nodemailer";

/**
 * Send an email using nodemailer
 * @param {Object} options
 * @param {string|string[]} options.to
 * @param {string} options.subject
 * @param {string} [options.html]
 * @param {string} [options.text]
 * @param {Array} [options.attachments]
 */

export async function sendEmail({ to, subject, html, text, attachments, cc }) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
    text,
    attachments,
    cc,
  };
  return transporter.sendMail(mailOptions);
}

/**
 * OTP Email Template
 */
export function otpEmailTemplate(otp) {
  return {
    subject: "Your One Time Password (OTP)",
    html: `<h1 style='color: blue; text-align: center; font-size: 2rem'>Diamond Consulting Pvt. Ltd.</h1><br/><h3 style='color: black; font-size: 1.3rem; text-align: center;'>Your OTP is: <b>${otp}</b></h3>`,
    text: `Your OTP is: ${otp}`,
  };
}

/**
 * Forgot Password OTP Email Template
 */
export function forgotPasswordOtpTemplate(otp) {
  return {
    subject: "Forgot Password - OTP",
    html: `<h1 style='color: blue; text-align: center; font-size: 2rem'>Diamond Consulting Pvt. Ltd.</h1><br/><h3 style='color: black; font-size: 1.3rem; text-align: center;'>Your OTP for password reset is: <b>${otp}</b></h3>`,
    text: `Your OTP for password reset is: ${otp}`,
  };
}

/**
 * Job Status Notification Email Template
 */
export function jobStatusTemplate({ type, candidateName, jobTitle, company }) {
  let subject = "";
  let html = "";
  
  switch (type) {
    case "CV-shortlisted":
      subject = "CV Shortlisted for Next Round";
      html = `<p style='font-size:20px;font-weight:bold;'>Application Progress Update</p>
              <p>Dear ${candidateName},</p>
              <p>Your application for <b>${jobTitle}</b> has been shortlisted for the next stage.</p>
              <p>Our team will contact you shortly regarding further details.</p>
              <p>Best regards,</p>`;
      break;

    case "screening":
      subject = "Screening Round Completed";
      html = `<p style='font-size:20px;font-weight:bold;'>Screening Update</p>
              <p>Dear ${candidateName},</p>
              <p>Congratulations on clearing the screening round for <b>${jobTitle}</b>.</p>
              <p>Next steps will be communicated soon.</p>
              <p>Best regards,</p>`;
      break;

    case "interviewScheduled":
      subject = "Interview Scheduled";
      html = `<p style='font-size:20px;font-weight:bold;'>Interview Invitation</p>
              <p>Dear ${candidateName},</p>
              <p>Your interview for <b>${jobTitle}</b> has been scheduled.</p>
              <p>Details will be shared shortly via email.</p>
              <p>Best regards,</p>`;
      break;

    case "interviewed":
      subject = "Interview Process Completed";
      html = `<p style='font-size:20px;font-weight:bold;'>Thank You</p>
              <p>Dear ${candidateName},</p>
              <p>We appreciate your time for the <b>${jobTitle}</b> interview.</p>
              <p>Results will be announced after evaluation.</p>
              <p>Best regards,</p>`;
      break;

    case "shortlisted":
      subject = "Congratulations! You've Been Shortlisted";
      html = `<p style='font-size:20px;font-weight:bold;'>Selection Update</p>
              <p>Dear ${candidateName},</p>
              <p>We're pleased to inform you've been shortlisted for <b>${jobTitle}</b>.</p>
              <p>HR will contact you with offer details shortly.</p>
              <p>Best regards,</p>`;
      break;

    case "joined":
      subject = "Welcome to the Team";
      html = `<p style='font-size:20px;font-weight:bold;'>Onboarding Confirmation</p>
              <p>Dear ${candidateName},</p>
              <p>Welcome to <b>${company}</b> as our new <b>${jobTitle}</b>!</p>
              <p>Onboarding details will be shared soon.</p>
              <p>Best regards,</p>`;
      break;

    default:
      subject = "Application Status Update";
      html = `<p>Dear ${candidateName},</p>
              <p>There's an update regarding your application.</p>
              <p>Best regards,</p>`;
  }
  
  return { subject, html };
}
/**
 * Client Form Notification Email Template
 */
export function clientFormTemplate({
  name,
  email,
  phone,
  designation,
  company,
}) {
  return {
    subject: `DOC_LABZ - New Client: New Message Received from ${name}`,
    html: `<h4 style='font-size:1rem; display:flex; justify-content: center;'>A new message has been submitted by ${name}</h4><br/><h4 style='font-size:1rem; display:flex; justify-content: center;'>Email Id: ${email}</h4><br/><h4 style='font-size:1rem; display:flex; justify-content: center;'>Phone No: ${phone}</h4><br/><h4 style='font-size:1rem; display:flex; justify-content: center;'>Designation: ${designation}</h4><br/><h4 style='font-size:1rem; display:flex; justify-content: center;'>Company: ${company}</h4>`,
  };
}

/**
 * Bulk/Recommendation Email Template
 */
export function jobRecommendationTemplate({ candidateName, jobsTableHtml }) {
  return {
    subject: "Recommended Jobs",
    html: `<h1 style='color: blue; text-align: center; font-size: 2rem'>DiamondOre Consulting Pvt. Ltd.</h1><h3 style='color: black; font-size: 1.3rem; text-align: center;'>Jobs for candidate: ${candidateName}</h3>${jobsTableHtml}`,
  };
}

/**
 * Employee Edit Notification Email Template
 */
export function employeeEditTemplate(updatedFields) {
  return {
    subject: "Updated Details Notification",
    html: `<h3>Your details have been updated:</h3><ul>${Object.entries(
      updatedFields
    )
      .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
      .join(
        ""
      )}</ul><p>If you have any questions, please contact HR.</p><h1 style='color: blue; text-align: center; font-size: 1rem'>Diamond Consulting Pvt.Ltd.</h1>`,
  };
}

/**
 * Goal Sheet Notification Email Template
 */
export function goalSheetTemplate(emailContent) {
  return {
    subject: "Your Goal Sheet Analysis",
    html: `<h1 style='color: blue; text-align: center; font-size: 1rem'>Diamond Consulting Pvt.Ltd.</h1><p style='font-size: 1.2rem;'>${emailContent.replace(
      /\n/g,
      "<br/>"
    )}</p>`,
  };
}

/**
 * Welcome Email Template
 */
export function welcomeEmailTemplate(name) {
  return {
    subject: "Welcome to Diamond Ore Pvt. Ltd!",
    html: `<p>Congratulations, ${name}! We are thrilled to have you as a new member of our community. By joining us, you've taken the first step towards unlocking a world of opportunities.</p>`,
  };
}

/**
 * Notification Email Template
 */
export function notificationEmailTemplate(subject, message) {
  return {
    subject,
    html: `<p>${message}</p>`,
  };
}

/**
 * Job Added Notification Email Template
 */
export function jobAddedTemplate({ candidateName }) {
  return {
    subject: "Exciting New Job Opportunity at Diamond Ore Pvt. Ltd!",
    html: `
      <h1 style='color: blue; text-align: center; font-size: 2rem'>Diamond Ore Pvt. Ltd.</h1>
      <p>Dear ${candidateName},</p>
      <p>We are thrilled to announce that a new job opportunity has just been added to our platform at Diamond Ore Pvt. Ltd! We believe that this job could be a perfect fit for your skills and experience.</p>
      <p>Visit <a href="https://www.diamondore.in/" style="color:blue;">Diamond Ore Pvt. Ltd</a> to explore more details and apply.</p>
      <p>Best regards,<br/>Diamond Ore Pvt. Ltd Team</p>
    `,
  };
}

/**
 * Employee Welcome Email Template
 */
export function employeeWelcomeTemplate({ name, empType }) {
  return {
    subject: "Congratulations! You are added to DOC-ERP",
    html: `
      <h1 style="color: blue; text-align: center; font-size: 2rem">Diamond Consulting Pvt. Ltd.</h1>
      <h3 style="color: black; font-size: 1.3rem; text-align: center;">Dear ${name}, Welcome to the DOC-ERP system as <b>${empType}</b>. Stay Connected.</h3>
    `,
  };
}

/**
 * Duplicate Phone Number Request Email Template
 */
export function duplicatePhoneRequestTemplate({
  employeeName,
  hrName,
  hrPhone,
}) {
  return `
    <h2>Duplicate Phone Number Request</h2>
    <p><strong>Employee:</strong> ${employeeName}</p>
    <p><strong>HR Name:</strong> ${hrName}</p>
    <p><strong>Requested Phone Number:</strong> ${hrPhone}</p>
    <p>This is an automated notification that an employee has requested to use a phone number already in use by another account. Please review and take appropriate action.</p>
    <p>Regards,<br/>Diamond Ore Pvt. Ltd. System</p>
  `;
}
