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


// API Server for signup get data from signup.jsx post to this server
app.post('/signup', async (req, res) => {
  try {
    
      const { 
          strFirstName,
          strLastName,
          strEmail,
          strPhone,
          strPassword,
          accountType
      } = req.body;

      const vendorData = {
        strFirstName,
        strLastName,
        strEmail,
        strPhone,
        strPassword,
        accountType
      }
      if (accountType == "vendor") {
      insertUser(vendorData);
    } else if (accountType == "organizer")
    {
      insertOrganizer(vendorData);
    }
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

// Insert Vendor function
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

const insertOrganizer = async (NewVendor) => {
  const currentDate = new Date().toISOString();
  try {
    let pool = await sqlConnectionToServer.connect(config);
    let users = pool.request().query(`INSERT INTO TOrganizers (
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


// API server for Select top 3 events
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

// API server to select event for specific ID
app.get('/api/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  
  try {
      const pool = await sqlConnectionToServer.connect(config);
      const result = await pool.request()
          .input('eventId', sqlConnectionToServer.Int, eventId)
          .query(`
              SELECT 
                  e.intEventID,
                  e.strEventName,
                  e.strDescription,
                  e.dtDateOfEvent,
                  e.strLocation,
                  v.strFirstName + ' ' + v.strLastName as strOrganizerName,
                  v.strPhone as strContact
              FROM TEvents e
              LEFT JOIN TVendors v ON e.intOrganizerID = v.intVendorID
              WHERE e.intEventID = @eventId
          `);

      if (result.recordset.length > 0) {
          res.json(result.recordset[0]);
      } else {
          res.status(404).json({ error: 'Event not found' });
      }
  } catch (err) {
      console.error('Error fetching event details:', err);
      res.status(500).json({
          error: 'Database error',
          message: err.message
      });
  }
});

// API Server for Select all event
app.get('/api/allevents', async (req, res) => {
  try {
      const pool = await sqlConnectionToServer.connect(config);
      const result = await pool.request().query(`
          select   e.intEventID,
          e.strEventName,
          e.strDescription,
          e.dtDateOfEvent,
          e.strLocation		  
		      from TEvents as e
      `);
      console.log(`Found ${result.recordset.length} events`);
      res.json(result.recordset);
  } catch (err) {
      console.error('Error fetching all events:', err);
      res.status(500).json({
          error: 'Database error',
          message: err.message
      });
  }
});


app.listen(API_PORT, () => {console.log(`Server running on port ${API_PORT}`);});