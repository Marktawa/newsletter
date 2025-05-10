// ./src/middlewares/form-handler.js
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