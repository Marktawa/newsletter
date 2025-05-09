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
    {
      method: "POST",
      path: "/send-email-to-all",
      handler: "email-news.sendToAllSubscribers",
      config: { auth: false },
    }
  ],
};
