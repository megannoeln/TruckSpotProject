// Import MS SQL Module
const sql = require("mssql");
const config = require("./dbConfig");

// Function to validate the user credentials
async function ValidateUser() {
  // Get email and password from the form inputs
  const strEmail = document.getElementById("strEmail").value;
  const strPassword = document.getElementById("strPassword").value;

  try {
    // Connect to the SQL Server
    const pool = await sql.connect(config);
    console.log("Connected to SQL Server successfully!");

    // Use parameterized query to avoid SQL injection
    const result = await pool
      .request()
      .input("strEmail", sql.VarChar(50), strEmail)
      .input("strPassword", sql.VarChar(50), strPassword)
      .output("UserID", sql.Int)
      .execute("uspLoginUser");

    if (result.output.UserID) {
      console.log("Login successful:", result.output.UserID);
      alert("Login successful! Redirecting...");
      window.location.href = "../front-end_js/index.html"; // Redirect to Desired Page
    } else {
      alert("Invalid email or password.");
    }

    sql.close(); // Close the connection
  } catch (err) {
    console.error("Database Connection Failed:", err);
    alert("Database connection failed. Please try again later.");
  }
}

// Attach event listener to login button or form submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent page reload
  await ValidateUser(); // Call validation logic
});
