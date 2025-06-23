/**
 * OTP Utility: Handles OTP generation, storage, validation, and expiry.
 */

const otpStore = {};

/**
 * Generate a 6-digit OTP
 * @returns {string}
 */
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP for an email with expiry (10 minutes)
 * @param {string} email
 * @param {string} otp
 */
export function storeOtp(email, otp) {
  otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };
}

/**
 * Validate OTP for an email
 * @param {string} email
 * @param {string} otp
 * @returns {boolean} true if valid, false otherwise
 */
export function validateOtp(email, otp) {
  const entry = otpStore[email];
  if (!entry) return false;
  if (entry.expires < Date.now()) {
    delete otpStore[email];
    return false;
  }
  return entry.otp === otp;
}

/**
 * Clear OTP for an email
 * @param {string} email
 */
export function clearOtp(email) {
  delete otpStore[email];
}

export { otpStore }; 