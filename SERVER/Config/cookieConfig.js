const isProduction = process.env.NODE_ENV === "production";

const cookieBaseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

function accessCookieOptions() {
  return {
    ...cookieBaseOptions,
    maxAge: 30 * 60 * 1000,
  };
}

function refreshCookieOptions() {
  return {
    ...cookieBaseOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

module.exports = {
  accessCookieOptions,
  refreshCookieOptions,
  cookieBaseOptions,
};
