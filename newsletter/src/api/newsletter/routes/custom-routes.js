module.exports = {
    routes: [
      {
        method: "POST",
        path: "/send-newsletter",
        handler: "newsletter.sendNewsletter",
        config: {
          auth: false, // Set to true if authentication is required
        },
      },
    ],
  };