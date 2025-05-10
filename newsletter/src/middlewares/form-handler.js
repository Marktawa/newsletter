module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
      if (ctx.path === '/api/subscribers' && ctx.method === 'POST') {
        const { name, email } = ctx.request.body.data;
  
        // Initialize errors array
        const errors = [];
  
        //Validate name
        if (!name) {
          errors.push({ field: 'name', message: 'Name is required' });
        } else if (name.length > 255) {
          errors.push({ field: 'name', message: 'Name must be 255 characters or less'})
        }
  
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          errors.push({ field: 'email', message: 'Email is required' });
        } else if (!emailRegex.test(email)) {
          errors.push({ field: 'email', message: 'Please provide a valid email address' });
        }
  
        // Check for existing email to prevent duplicates
        if (email && emailRegex.test(email)) {
          try {
            const existingSubscriber = await strapi.documents("api::subscriber.subscriber").findMany({
              filters: { email: email },
            });
  
            if (existingSubscriber && existingSubscriber.length > 0) {
              errors.push({ field: 'email', message: 'This email is already subscribed' });
            }
          } catch (error) {
            strapi.log.error('Error checking for existing email:', error);
          }
        }
  
        // Display errors
        if (errors.length > 0) {
          ctx.status = 400;
          ctx.body = { errors };
          return; // Stop execution and don't proceed to next middleware
        }
  
        // Log valid submission
        strapi.log.info(`Valid Submission - Name: ${name} Email: ${email}`);
        }
        await next();
      };
  };