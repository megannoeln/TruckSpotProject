const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors()); 
app.use(express.json()); 

const dbConfig = {
    user: "truckspotadmin",
    password: "Cstate2024!",
    server: "truckspot.database.windows.net",
    database: "truckspot",
    port: 1433,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  };

  async function getDbConnection() {
    try {
      await sql.connect(dbConfig);
      console.log('Connected to database');
    } catch (err) {
      console.error('Database connection failed:', err);
      throw err;
    }
  }

  app.post('/api/signup', async (req, res) => {
    try {
      const { firstname, lastname, email, phone, password } = req.body;
  
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Connect to database
      await getDbConnection();
  
      // Check if user already exists
      const checkResult = await sql.query`
        SELECT strEmail FROM TVendors 
        WHERE strEmail = ${email}
      `;
  
      if (checkResult.recordset.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      
      const currentDate = new Date().toISOString();

      // Insert new user
      const result = await sql.query`
            INSERT INTO TVendors (
                strFirstName, 
                strLastName, 
                strEmail, 
                strPhone, 
                strPassword,
                dtDateCreated,
                dtLastLogin
            )
            VALUES (
                ${firstname}, 
                ${lastname}, 
                ${email}, 
                ${phone}, 
                ${hashedPassword},
                ${currentDate},
                ${currentDate}
            )
        `;
  
      res.status(201).json({ message: 'User registered successfully' });
  
    } catch (err) {
      console.error('Error in signup:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });