module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/export-data',
      handler: 'data-export.exportData',
      config: {
        auth: false, // Set to false if you want the route to be public
        policies: [],
        middlewares: [],
      },
    },
  ],
}
