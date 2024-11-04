const express                 = require('express');
const cors                    = require('cors');
const sqlConnectionToServer   = require('mssql');
const bcrypt                  = require('bcrypt');
const config                  = require("./dbConfig");
const router                  = express.Router();

const app = express();
const API_PORT = process.env.PORT || 5000;
  
app.use(cors({
  origin: 'http://localhost:5173', 
    credentials: true
})); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Server is running' });
});


// Get post data from signup page
app.post('/signup', async (req, res) => {
  try {
    
      const { 
          strFirstName,
          strLastName,
          strEmail,
          strPhone,
          strPassword
      } = req.body;

      const vendorData = {
        strFirstName,
        strLastName,
        strEmail,
        strPhone,
        strPassword
      }
      insertUser(vendorData);
    res.status(200).json({
        success: true,
        message: 'Signup data received successfully',
        user: {
          strFirstName: req.body.strFirstName,
          strLastName: req.body.strLastName,
          strEmail: req.body.strEmail,
          strPhone: req.body.strPhone,
          strPassword : req.body.strPassword
        }
    });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during signup',
            error: error.message
        });
    }
    
});

// Insert Function To Vendor Signup
const insertUser = async (NewVendor) => {
  
  const currentDate = new Date().toISOString();
  try {
    let pool = await sqlConnectionToServer.connect(config);
    let users = pool.request().query(`INSERT INTO TVendors (
                    strFirstName,
                    strLastName,
                    strEmail,
                    strPhone,
                    strPassword,
                    dtDateCreated,
                    dtLastLogin
                ) VALUES 
      ('${NewVendor.strFirstName}', '${NewVendor.strLastName}','${NewVendor.strEmail}','${NewVendor.strPhone}','${NewVendor.strPassword}', '${currentDate}', '${currentDate}')
      `)
  } catch (error){
    console.log('Insert error:', error);
    throw error;
  }
}


// Get events sorted by date
app.get('/api/events', async (req, res) => {
  try {
       const pool = await sqlConnectionToServer.connect(config);
        const result = await pool.request().query`
      SELECT TOP 3 *
      FROM TEvents
      WHERE dtDateOfEvent >= GETDATE()
      ORDER BY dtDateOfEvent ASC`;   
      res.json(result.recordset);
      console.log('Root route accessed');
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  } finally {

  }
});




app.listen(API_PORT, () => {console.log(`Server running on port ${API_PORT}`);});