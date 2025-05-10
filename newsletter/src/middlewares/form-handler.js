module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
      if (ctx.path === '/api/subscribers' && ctx.method === 'POST') {
        strapi.log.info(`Name: ${ctx.request.body.data.name} Email: ${ctx.request.body.data.email}`);
        }
        await next();
      };
  };