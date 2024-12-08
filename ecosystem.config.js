// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "questionnaire-api",                   // Application name
      script: "server.js",                       // Entry point for the app
      instances: "1",                            // Scales across all available CPU cores
      exec_mode: "cluster",                        // Enables load balancing in cluster mode
      watch: true,                                 // Watch for file changes to auto-reload in development
      ignore_watch: ["node_modules", "logs"],      // Folders to ignore from watching
      env: {
        NODE_ENV: "development",
        PORT: 20608,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 20608,
      }
    },
  ],
};