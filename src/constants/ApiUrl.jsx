// src/constants/ApiUrl.js

// const BASE_URL = "http://127.0.0.1:8000/api";
// const IMAGE_BASE_URL = "http://127.0.0.1:8000/uploads";

const BASE_URL = "https://api.stakeova.com/api";
const IMAGE_BASE_URL = "https://api.stakeova.com/public/uploads/";

const ApiUrl = {
  BASE_URL,
  IMAGE_BASE_URL,

  // Authentication
  REGISTER_USER: `${BASE_URL}/register`,
  LOGIN_USER: `${BASE_URL}/login`,
  VERIFY_OTP: `${BASE_URL}/verify-otp`,
  RESEND_OTP: `${BASE_URL}/resend-otp`,
  FORGOT_PIN: `${BASE_URL}/forgot-pin`,
  VERIFY_FORGOT_PIN_OTP: `${BASE_URL}/verify-forgot-pin-otp`,
  RESEND_FORGOT_PIN_OTP: `${BASE_URL}/resend-forgot-pin-otp`,
  RESET_PIN: `${BASE_URL}/reset-pin`,

  // User
  ME: `${BASE_URL}/me`,
  DELETE_ACCOUNT: `${BASE_URL}/delete-account`,
  UPDATE_PROFILE: `${BASE_URL}/profile/update`,
  UPDATE_PROFILE_IMAGE: `${BASE_URL}/profile/update-image`,
  CHANGE_PIN: `${BASE_URL}/profile/change-pin`,
  AVATARS: `${BASE_URL}/avatars`,

  // Home
  ACTIVE_BETS: `${BASE_URL}/active-bets`,
  LIVE_FEED: `${BASE_URL}/live-feed`,
  HOME_FEED: `${BASE_URL}/home-feed`,
  TOTAL_PAYOUT: `${BASE_URL}/total-payout`,
  LEADERBOARD: `${BASE_URL}/leaderboard`,
  CONTACT: `${BASE_URL}/contact`,

  // Wallet
  WALLET: `${BASE_URL}/wallet`,

  // Rewards
  REWARD_DASHBOARD: `${BASE_URL}/reward-dashboard`,

 CHAT_START: BASE_URL + "/chat/start",
CHAT_SEND: BASE_URL + "/chat/send",
CHAT_MESSAGES: BASE_URL + "/chat/messages",

ADMIN_CHAT_CONVERSATIONS: BASE_URL + "/admin/chat/conversations",
ADMIN_CHAT_MESSAGES: BASE_URL + "/admin/chat/messages",
ADMIN_CHAT_SEND: BASE_URL + "/admin/chat/send",
};

export default ApiUrl;