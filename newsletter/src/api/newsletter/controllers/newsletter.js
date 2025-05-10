"use strict";

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
  async sendNewsletter(ctx) {
    try {
      const { id } = ctx.request.body;
      // id in this case is documentId

      if (!id) {
        return ctx.badRequest("Missing required field: id");
      }

      // Fetch the newsletter from the collection - Using Document Service API

      const newsletter = await strapi.documents("api::newsletter.newsletter").findOne({
        documentId: id,
        fields: ["title", "content"],
      });

      if (!newsletter) {
        return ctx.notFound("Newsletter not found");
      }

      const { title, content } = newsletter;

      // Fetch all subscribers - Using Document Service API

      const subscribers = await strapi.documents("api::subscriber.subscriber").findMany({
        fields: ["name", "email"],
      });

      if (!subscribers || subscribers.length === 0) {
        return ctx.notFound("No subscribers found");
      }

      // Send the newsletter to all subscribers
      for (const subscriber of subscribers) {
        const personalizedContent = content.replace("{name}", subscriber.name);

        await strapi.service("api::email-news.email-news").sendEmail({
          to: subscriber.email,
          subject: title, // Use the newsletter title as the email subject
          htmlContent: `<p>Dear ${subscriber.name},</p><p>${personalizedContent}</p>`,
        });
      }

      ctx.send({ message: `Newsletter sent to ${subscribers.length} subscribers` });
    } catch (error) {
      console.error("Email error:", error);
      ctx.send({ error: "Failed to send newsletter", details: error.message });
    }
  },
}));
