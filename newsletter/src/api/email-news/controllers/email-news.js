"use strict";

module.exports = {
  async send(ctx) {
    try {
      const { to, subject, htmlContent } = ctx.request.body;

      if (!to || !subject || !htmlContent) {
        return ctx.badRequest("Missing required fields: to, subject, htmlContent");
      }

      // Access service using `strapi.service()`
      await strapi.service("api::email-news.email-news").sendEmail({ to, subject, htmlContent });

      ctx.send({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Email error:", error);
      ctx.send({ error: "Failed to send email", details: error.message });
    }
  },
  async sendToSubscriber(ctx) {
    try {
      const { id, subject, htmlContent } = ctx.request.body;
      // id in this case is documentId

      if (!id || !subject || !htmlContent) {
        return ctx.badRequest("Missing required fields: id, subject, htmlContent");
      }

      //Fetch subscriber from database - Using Document Service API 
      const subscriber = await strapi.documents("api::subscriber.subscriber").findOne({
        documentId: id,
        fields: ["name", "email"],        
      });

      if (!subscriber) {
        return ctx.notFound("Subscriber not found");
      }

      const { email, name } = subscriber;

      // Send email
      await strapi.service("api::email-news.email-news").sendEmail({
        to: email,
        subject: subject.replace("{name}", name),
        htmlContent: htmlContent.replace("{name}", name), // Replace {name} with subscriber's name
      });

      ctx.send({ message: `Email sent successfully to ${email}` });
    } catch (error) {
      console.error("Email error:", error);
      ctx.send({ error: "Failed to send email", details: error.message });
    }
  },
  async sendToAllSubscribers(ctx) {
    try {
      const { subject, htmlContent } = ctx.request.body;
  
      if (!subject || !htmlContent) {
        return ctx.badRequest("Missing required fields: subject, htmlContent");
      }
  
      // Fetch all subscribers - Using Document Service API

     const subscribers = await strapi.documents("api::subscriber.subscriber").findMany({
        fields: ["name", "email"],
     });
  
      if (subscribers.length === 0) {
        return ctx.notFound("No subscribers found");
      }
  
      // Send emails to all subscribers
      for (const subscriber of subscribers) {
        await strapi.service("api::email-news.email-news").sendEmail({
          to: subscriber.email,
          subject: subject.replace("{name}", subscriber.name),
          htmlContent: htmlContent.replace("{name}", subscriber.name),
        });
      }
  
      ctx.send({ message: `Emails sent to ${subscribers.length} subscribers` });
    } catch (error) {
      console.error("Email error:", error);
      ctx.send({ error: "Failed to send emails", details: error.message });
    }
  },  
};