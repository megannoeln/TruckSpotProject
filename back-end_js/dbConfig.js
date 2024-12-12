// Import SQL Configuration from dbConfig.mjs
const config = {
  user: "truckspotadmin",
  password: "Cstate2024!",
  server: "truckspot.database.windows.net", // SQL Server address
  database: "truckspot",
  port: 1433, // Default SQL Server port
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }
};

// Export Configurations to Modules in need of it
module.exports = config;
