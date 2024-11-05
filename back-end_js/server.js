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
// Insert Organizer function
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
                  o.strFirstName + ' ' + o.strLastName as strOrganizerName,
                  o.strPhone as strContact,
				  o.strEmail
              FROM TEvents e
              LEFT JOIN TOrganizers as O ON e.intOrganizerID = O.intOrganizerID
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

// Fetch data from frontend login form
// app.post('/login', async (req, res) => {
//   console.log('Request body:', req.body);
//   try {
//       const { 
//         strEmail, 
//         strPassword,
//         accountType } = req.body;
//       const userData = {
//         strEmail, 
//         strPassword,
//         accountType
//       };
//       const pool = await sql.connect(config);
//       let query;
//         if (accountType === 'vendor') {
//             query = `
//                 SELECT intVendorID 
//                 FROM TVendors 
//                 WHERE strEmail = @strEmail 
//                 AND strPassword = @strPassword
//             `;
//         } else if (accountType === 'organizer') {
//             query = `
//                 SELECT intOrganizerID 
//                 FROM TOrganizers 
//                 WHERE strEmail = @strEmail 
//                 AND strPassword = @strPassword
//             `;
//         } else {
//             throw new Error('Invalid account type');
//         }
//         console.log('Database result:', result);

//         // Execute query
//         const result = await request.query(query);
        
//         console.log('Database result:', result);

//           // Check if user exists
//           if (result.recordset.length > 0) {
//             const user = result.recordset[0];
            
//             res.status(200).json({
//                 success: true,
//                 message: 'Login successful',
//                 user: {
//                     id: accountType === 'vendor' ? user.VendorID : user.OrganizerID,
//                     name: accountType === 'vendor' ? user.strVendorName : user.strOrganizerName,
//                     email: user.strEmail,
//                     accountType
//                 }
//             });
//           } else {
//             res.status(401).json({
//                 success: false,
//                 message: 'Invalid email or password'
//             });
//           }

//           } catch (error) {
//           console.error('Error in login:', error);
//           res.status(500).json({
//             success: false,
//             message: 'An error occurred during login',
//             error: error.message
//           });
//           }
// });


app.post('/login', async (req, res) => {
  const strEmail = req.body.strEmail;
  const strPassword = req.body.strPassword;
  const accountType = req.body.accountType;
  let LoginQuery = '';

  if (accountType === "vendor") {
      LoginQuery = `
          SELECT *
          FROM TVendors
          WHERE strEmail = '${strEmail}'
          AND strPassword = '${strPassword}'`;
  } else if (accountType === "organizer") {
      LoginQuery = `
          SELECT *
          FROM TOrganizers
          WHERE strEmail = '${strEmail}'
          AND strPassword = '${strPassword}'`;
  }

    console.log('Account Type:', accountType);
    console.log('Email:', strEmail);
    console.log('Query:', LoginQuery);

  try {
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool.request()
        .query(LoginQuery);
        console.log('Query result:', result); // Add this for debugging

    if (result.recordset.length > 0) {
        // User found - send success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: result.recordset[0]
        });
    } else {
        // No user found
        res.status(401).json({ 
            success: false,
            message: 'Invalid email or password' 
        });
    }
  } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({
          success: false,
          error: 'Database error',
          message: err.message
      });
  } finally {
      // Close the connection
      try {
          await sqlConnectionToServer.close();
      } catch (err) {
          console.error('Error closing connection:', err);
      }
  }
})


app.listen(API_PORT, () => {console.log(`Server running on port ${API_PORT}`);});