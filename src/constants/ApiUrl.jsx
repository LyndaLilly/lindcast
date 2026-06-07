// src/constants/ApiUrl.js

// const BASE_URL = "http://172.16.84.175:8000/api";
// const IMAGE_BASE_URL = "http://172.16.84.175:8000/uploads";

const BASE_URL = "http://127.0.0.1:8000/api";
const IMAGE_BASE_URL = "http://127.0.0.1:8000/uploads";

const ApiUrl = {
  BASE_URL,
  IMAGE_BASE_URL,

  REGISTER_USER: `${BASE_URL}/register`,
  LOGIN_USER: `${BASE_URL}/login`,
  VERIFY_OTP: `${BASE_URL}/verify-otp`,
  RESEND_OTP: `${BASE_URL}/resend-otp`,
  ME: `${BASE_URL}/me`,

  ACTIVE_BETS: `${BASE_URL}/active-bets`,
  LIVE_FEED: `${BASE_URL}/live-feed`,
  HOME_FEED: `${BASE_URL}/home-feed`,
  TOTAL_PAYOUT: `${BASE_URL}/total-payout`,
  LEADERBOARD: `${BASE_URL}/leaderboard`,
  CONTACT: `${BASE_URL}/contact`,

  WALLET: `${BASE_URL}/wallet`,
};

export default ApiUrl;
