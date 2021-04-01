const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://adrenjc-cloud-music-api.vercel.app',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
  app.use(
    '/api1',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: {
        '^/api1': '',
      },
    })
  );
};
