module.exports = {
    async afterCreate(event) {
      const { result } = event;
      if (result.publishedAt) {
        await sendNewsletterToSubscribers(result.documentId);
      }
    },
    
    async afterUpdate(event) {
      const { result, params } = event;
      // Check if the newsletter was just published
      if (result.publishedAt && (!params.data.publishedAt || params.data.publishedAt === result.publishedAt)) {
        await sendNewsletterToSubscribers(result.documentId);
      }
    },
  };
  
  async function sendNewsletterToSubscribers(id) {
    try {
      // Fetch the newsletter from the Newsletter collection

      const newsletter = await strapi.documents("api::newsletter.newsletter").findOne({
        documentId: id,
        fields: ["title", "content"],
      });
  
      if (!newsletter) {
        console.error("Newsletter not found");
        return;
      }
  
      const { title, content } = newsletter;
  
      // Fetch all subscribers - using Document Service API

      const subscribers = await strapi.documents("api::subscriber.subscriber").findMany({
        fields: ["name", "email"],
      });
  
      if (!subscribers || subscribers.length === 0) {
        console.log("No subscribers found");
        return;
      }
  
      // Send the newsletter to all subscribers
      for (const subscriber of subscribers) {
        const personalizedContent = content.replace("{name}", subscriber.name);
  
        await strapi.service("api::email-news.email-news").sendEmail({
          to: subscriber.email,
          subject: `Test 5: ${title}`,
          htmlContent: `<p>Dear ${subscriber.name},</p><p>${personalizedContent}</p>`,
        });
      }
  
      console.log(`Newsletter sent to ${subscribers.length} subscribers`);
    } catch (error) {
      console.error("Email error:", error);
    }
  }