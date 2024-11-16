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
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",       // Format for log timestamps
      error_file: "./logs/error.log",              // Error log file location
      out_file: "./logs/output.log",               // Output log file location
      merge_logs: true,                            // Combine logs for all instances
      max_restarts: 5,                             // Max restarts before stopping
      restart_delay: 5000,                         // Delay between restarts (in ms)
    },
  ],
};