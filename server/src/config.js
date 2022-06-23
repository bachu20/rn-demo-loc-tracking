module.exports = {
  PASSWORD_SALT_ROUNDS: 5,

  AUTH_FAILED_RESPONSE: {
    status: 401,
    code: "Unauthorized",
    message: "Authorization failed for request.",
  },
};
