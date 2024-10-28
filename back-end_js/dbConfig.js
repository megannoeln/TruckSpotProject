// Import SQL Configuration from dbConfig.mjs
const config = {
  user: "truckspotadmin",
  password: "Cstate2024!",
  server: "truckspot.database.windows.net", // SQL Server address
  database: "truckspot",
  port: 1433, // Default SQL Server port
  options: {
    encrypt: true, // Required for Azure connections
    trustServerCertificate: true, // Use only for development
  },
};

// Export Configurations to Modules in need of it
module.exports = config;
