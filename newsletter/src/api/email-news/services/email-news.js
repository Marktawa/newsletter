"use strict";

const SibApiV3Sdk = require("sib-api-v3-sdk");

module.exports = {
  async sendEmail({ to, subject, htmlContent }) {
    try {
      // Initialize Brevo API client
      const defaultClient = SibApiV3Sdk.ApiClient.instance;
      const apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = process.env.BREVO_API_KEY;

      // Configure the email sender and recipient
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      sendSmtpEmail.sender = { name: "Your Business", email: "your-email@example.com" };
      sendSmtpEmail.to = [{ email: to }];
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = htmlContent;

      // Send the email
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
      return response;
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  },
};
