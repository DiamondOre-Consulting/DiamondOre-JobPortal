import nodemailer from "nodemailer";
import dns from "node:dns/promises";

/**
 * Send an email using nodemailer
 * @param {Object} options
 * @param {string|string[]} options.to
 * @param {string} options.subject
 * @param {string} [options.html]
 * @param {string} [options.text]
 * @param {Array} [options.attachments]
 */

const DEFAULT_CONNECTION_TIMEOUT = 15000;
const DEFAULT_GREETING_TIMEOUT = 10000;
const DEFAULT_SOCKET_TIMEOUT = 20000;

const gmailIpv6Cache = new Map();

const toBoolean = (value, fallbackValue = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return fallbackValue;
  const normalizedValue = value.trim().toLowerCase();
  return normalizedValue === "true" || normalizedValue === "1";
};

const toNumber = (value, fallbackValue) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
};

const resolveIpv6Address = async (hostname) => {
  if (gmailIpv6Cache.has(hostname)) {
    return gmailIpv6Cache.get(hostname);
  }

  try {
    const ipv6Addresses = await dns.resolve6(hostname);
    const selectedAddress =
      Array.isArray(ipv6Addresses) && ipv6Addresses.length > 0
        ? ipv6Addresses[0]
        : null;
    gmailIpv6Cache.set(hostname, selectedAddress);
    return selectedAddress;
  } catch {
    gmailIpv6Cache.set(hostname, null);
    return null;
  }
};

const createTransportAttempts = async () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = toNumber(process.env.SMTP_PORT, 0);
  const smtpSecure = toBoolean(process.env.SMTP_SECURE, smtpPort === 465);
  const emailService = process.env.EMAIL_SERVICE || "gmail";

  const commonAuthConfig = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  };

  const commonTimeoutConfig = {
    connectionTimeout: toNumber(
      process.env.SMTP_CONNECTION_TIMEOUT,
      DEFAULT_CONNECTION_TIMEOUT
    ),
    greetingTimeout: toNumber(
      process.env.SMTP_GREETING_TIMEOUT,
      DEFAULT_GREETING_TIMEOUT
    ),
    socketTimeout: toNumber(
      process.env.SMTP_SOCKET_TIMEOUT,
      DEFAULT_SOCKET_TIMEOUT
    ),
  };

  const attempts = [];

  if (smtpHost) {
    attempts.push({
      name: `custom-smtp-${smtpHost}:${smtpPort || (smtpSecure ? 465 : 587)}`,
      config: {
        host: smtpHost,
        port: smtpPort || (smtpSecure ? 465 : 587),
        secure: smtpSecure,
        requireTLS: !smtpSecure,
        auth: commonAuthConfig,
        ...commonTimeoutConfig,
      },
    });
  }

  attempts.push({
    name: `service-${emailService}`,
    config: {
      service: emailService,
      auth: commonAuthConfig,
      ...commonTimeoutConfig,
    },
  });

  // Gmail IPv6 fallbacks.
  // In some environments IPv4 SMTP paths timeout while IPv6 works.
  const gmailHosts = ["smtp.gmail.com", "smtp.googlemail.com"];
  for (const host of gmailHosts) {
    const ipv6Address = await resolveIpv6Address(host);
    if (!ipv6Address) {
      continue;
    }

    attempts.push({
      name: `${host}-ipv6-587`,
      config: {
        host: ipv6Address,
        port: 587,
        secure: false,
        requireTLS: true,
        auth: commonAuthConfig,
        tls: {
          servername: host,
        },
        ...commonTimeoutConfig,
      },
    });

    attempts.push({
      name: `${host}-ipv6-465`,
      config: {
        host: ipv6Address,
        port: 465,
        secure: true,
        auth: commonAuthConfig,
        tls: {
          servername: host,
        },
        ...commonTimeoutConfig,
      },
    });
  }

  // Gmail explicit fallbacks:
  // 1) STARTTLS on 587 (smtp.gmail.com, smtp.googlemail.com)
  // 2) SSL/TLS on 465 (smtp.gmail.com, smtp.googlemail.com)
  // (Many environments route differently per host alias/IP.)
  attempts.push({
    name: "gmail-587",
    config: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: commonAuthConfig,
      ...commonTimeoutConfig,
    },
  });

  attempts.push({
    name: "googlemail-587",
    config: {
      host: "smtp.googlemail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: commonAuthConfig,
      ...commonTimeoutConfig,
    },
  });

  attempts.push({
    name: "gmail-465",
    config: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: commonAuthConfig,
      ...commonTimeoutConfig,
    },
  });

  attempts.push({
    name: "googlemail-465",
    config: {
      host: "smtp.googlemail.com",
      port: 465,
      secure: true,
      auth: commonAuthConfig,
      ...commonTimeoutConfig,
    },
  });

  return attempts;
};

const isRetryableMailError = (error) => {
  const retryableCodes = new Set([
    "ETIMEDOUT",
    "ESOCKET",
    "ECONNREFUSED",
    "EHOSTUNREACH",
    "ENOTFOUND",
    "EAI_AGAIN",
  ]);
  return retryableCodes.has(error?.code);
};

export async function sendEmail({ to, subject, html, text, attachments, cc }) {
  const transportAttempts = await createTransportAttempts();
  let lastError = null;

  for (let index = 0; index < transportAttempts.length; index += 1) {
    const { config, name } = transportAttempts[index];
    try {
      const transporter = nodemailer.createTransport(config);
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html,
        text,
        attachments,
        cc,
      };

      return await transporter.sendMail(mailOptions);
    } catch (error) {
      lastError = error;

      const isLastAttempt = index === transportAttempts.length - 1;
      if (!isRetryableMailError(error) || isLastAttempt) {
        break;
      }

      console.warn(
        `[email] send attempt failed via ${name} (${error.code || "UNKNOWN"}). Retrying with next config...`
      );
    }
  }

  throw lastError;
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
