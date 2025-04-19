module.exports = {
  routes: [
    {
      method: "POST",
      path: "/send-email",
      handler: "email-news.send",
      config: {
        auth: false, // Set to true if authentication is required
      },
    },
  ],
};
