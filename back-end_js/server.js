const express = require("express");
const cors = require("cors");
const sqlConnectionToServer = require("mssql");
const bcrypt = require("bcrypt");
const config = require("./dbConfig");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
const API_PORT = process.env.PORT || 5000;
const JWT_SECRET = "your-secret-key";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Server is running" });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/eventlogos");
  },
  filename: function (req, file, cb) {
    cb(null, "logo-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only .jpeg, .jpg and .png format allowed!"));
  },
});

const fs = require("fs");
const uploadDir = path.join(__dirname, "public", "uploads", "eventlogos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

// API Server for signup get data from signup.jsx post to this server
app.post("/signup", async (req, res) => {
  try {
    const {
      strFirstName,
      strLastName,
      strEmail,
      strPhone,
      strPassword,
      accountType,
    } = req.body;

    const vendorData = {
      strFirstName,
      strLastName,
      strEmail,
      strPhone,
      strPassword,
      accountType,
    };
    if (accountType == "vendor") {
      insertUser(vendorData);
    } else if (accountType == "organizer") {
      insertOrganizer(vendorData);
    }
    res.status(200).json({
      success: true,
      message: "Signup data received successfully",
      user: {
        strFirstName: req.body.strFirstName,
        strLastName: req.body.strLastName,
        strEmail: req.body.strEmail,
        strPhone: req.body.strPhone,
        strPassword: req.body.strPassword,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during signup",
      error: error.message,
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
      `);
  } catch (error) {
    console.log("Insert error:", error);
    throw error;
  }
};

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
      `);
  } catch (error) {
    console.log("Insert error:", error);
    throw error;
  }
};

// API server for Select top 3 events
app.get("/api/events", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool.request().query`
      SELECT TOP 3 *
      FROM TEvents
      WHERE dtDateOfEvent >= GETDATE()
      ORDER BY dtDateOfEvent ASC`;
    res.json(result.recordset);
    console.log("Root route accessed");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  } finally {
  }
});

// API server to select event for specific ID
app.get("/api/events/:eventId", async (req, res) => {
  const { eventId } = req.params;

  try {
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool
      .request()
      .input("eventId", sqlConnectionToServer.Int, eventId).query(`
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
      res.status(404).json({ error: "Event not found" });
    }
  } catch (err) {
    console.error("Error fetching event details:", err);
    res.status(500).json({
      error: "Database error",
      message: err.message,
    });
  }
});

// API Server for Select all event
app.get("/api/allevents", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool.request().query(`
        SELECT  e.intEventID,
        e.strEventName,
        e.strDescription,
        e.dtDateOfEvent,
        e.strLocation		  
        FROM TEvents as e
        WHERE e.dtDateOfEvent > GETDATE()
        ORDER BY e.dtDateOfEvent ASC;
      `);
    console.log(`Found ${result.recordset.length} events`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({
      error: "Database error",
      message: err.message,
    });
  }
});

// Get only reservation that related to a vendor
app.get("/api/myreservation", async (req, res) => {
  const userID = req.query.userID;
  console.log("Received userID:", userID, typeof userID); 
  const parsedUserID = parseInt(userID, 10);
  console.log("RparsedUserID:", parsedUserID, typeof parsedUserID); 
  try {
    const pool = await sqlConnectionToServer.connect(config);
    console.log('attempting')
    const result = await pool.request()
    .query(`
              SELECT 
                  E.intEventID,
                  E.strEventName,
                  E.dtDateOfEvent,
                  FT.intFoodTruckID,
                  FT.strTruckName
              FROM 
                  TVendors V
                  INNER JOIN TFoodTrucks FT ON V.intVendorID = FT.intVendorID
                  INNER JOIN TFoodTruckEvents FTE ON FT.intFoodTruckID = FTE.intFoodTruckID
                  INNER JOIN TEvents E ON FTE.intEventID = E.intEventID
              WHERE 
                 e.dtDateOfEvent > GETDATE() AND V.intVendorID = ${parsedUserID}
              ORDER BY 
                  E.dtDateOfEvent;
                `);
                
    console.log(result.query);
    console.log(`Found ${result.recordset.length} events`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({
      error: "Database error",
      message: err.message,
    });
  }
});

// API To get event to show on the table in profile account
app.get("/api/myreservationTable", async (req, res) => {

  const { userID, userType } = req.query;
  const parsedUserID = parseInt(userID);
  const parsedUserType = parseInt(userType);
  console.log("User ID", parsedUserID, "User Type", parsedUserType)
  try {
    const pool = await sqlConnectionToServer.connect(config);

    let query = ``;
    if (parsedUserType === 1) {
      query = `SELECT 
                  TEvents.intEventID,
                  TEvents.strEventName,
                  TEvents.dtDateOfEvent,
                  TOrganizers.strFirstName + ' ' + TOrganizers.strLastName AS OrganizerName
              FROM 
                  TFoodTruckEvents
              INNER JOIN 
                  TFoodTrucks ON TFoodTruckEvents.intFoodTruckID = TFoodTrucks.intFoodTruckID
              INNER JOIN 
                  TEvents ON TFoodTruckEvents.intEventID = TEvents.intEventID
              INNER JOIN 
                  TOrganizers ON TEvents.intOrganizerID = TOrganizers.intOrganizerID
              WHERE 
                  TFoodTrucks.intVendorID = ${parsedUserID}
                  ORDER BY TEvents.dtDateOfEvent DESC`;
    } else if (parsedUserType === 2) {
              query = `select  TEvents.intEventID, 
        TEvents.strEventName,
        TEvents.dtDateOfEvent,
        TOrganizers.strFirstName + ' ' + TOrganizers.strLastName AS OrganizerName
        From TEvents join TOrganizers on TEvents.intOrganizerID = TOrganizers.intOrganizerID
        Where TOrganizers.intOrganizerID = ${parsedUserID}
        ORDER BY TEvents.dtDateOfEvent DESC`;
            }

    const result = await pool.request().query(query);
    res.json(result.recordset);
                
    console.log(result.query);
    console.log(`Found ${result.recordset.length} events`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({
      error: "Database error",
      message: err.message,
    });
  }
});


// Get only event that related to an organizer
app.get("/api/mycreatedevent", async (req, res) => {
  const userID = req.query.userID;
  console.log("Received userID:", userID, typeof userID); 
  const parsedUserID = parseInt(userID, 10);
  console.log("RparsedUserID:", parsedUserID, typeof parsedUserID); 
  try {
    const pool = await sqlConnectionToServer.connect(config);
    console.log('attempting')
    const result = await pool.request()
    .query(`
            SELECT intEventID,strEventName,dtDateOfEvent
            FROM TEvents JOIN TOrganizers ON TEvents.intOrganizerID = TOrganizers.intOrganizerID
            WHERE TEvents.dtDateOfEvent > GETDATE() AND TEvents.intOrganizerID = ${parsedUserID}
            ORDER BY TEvents.dtDateOfEvent DESC;
                `);

                
    console.log(result.query);
    console.log(`Found ${result.recordset.length} events`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({
      error: "Database error",
      message: err.message,
    });
  }
});

// log in procedure
app.post("/login", async (req, res) => {
  const strEmail = req.body.strEmail;
  const strPassword = req.body.strPassword;

  try {
    const pool = await sqlConnectionToServer.connect(config);
    // Set up the request to call the stored procedure
    const request = pool.request();
    request.input("strEmail", sqlConnectionToServer.VarChar(50), strEmail);
    request.input(
      "strPassword",
      sqlConnectionToServer.VarChar(50),
      strPassword
    );
    request.output("UserID", sqlConnectionToServer.Int);
    request.output("UserType", sqlConnectionToServer.Int);

    // Execute the stored procedure
    const result = await request.execute("uspLoginUser");

    const userID = result.output.UserID;
    const userType = result.output.UserType;

    if (userID) {
      // User found - send success response with user type
      const token = jwt.sign(
        {
          userID: userID,
          userType: userType,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          userID,
          userType,
        },
      });
    } else {
      // No user found
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      error: "Database error",
      message: err.message,
    });
  } finally {
    // Close the connection
    try {
      await sqlConnectionToServer.close();
    } catch (err) {
      console.error("Error closing connection:", err);
    }
  }
});

// Get Method from NAV bar that send UserID and UserType from session
app.get("/api/user-details", async (req, res) => {
  const userID = req.query.userID;
  const userType = req.query.userType;

  console.log("Received request:", { userID, userType });

  try {
    const pool = await sqlConnectionToServer.connect(config);
    const request = pool.request();

    let result;

    if (userType === "1") {
      // Use uspGetVendor stored procedure
      request.input("intVendorID", sqlConnectionToServer.Int, parseInt(userID));
      result = await request.execute("uspGetVendor");
    } else if (userType === "2") {
      // Use uspGetOrganizer stored procedure
      request.input(
        "intOrganizerID",
        sqlConnectionToServer.Int,
        parseInt(userID)
      );
      result = await request.execute("uspGetOrganizer");
    } else {
      throw new Error("Invalid user type");
    }

    // Check if we have results
    if (result && result.recordset && result.recordset.length > 0) {
      const user = result.recordset[0];
      const fullName = `${user.strFirstName} ${user.strLastName}`;
      const phoneNumber = `${user.strPhone}`;
      const email = `${user.strEmail}`;

      res.json({
        success: true,
        userName: fullName,
        phoneNumber: phoneNumber,
        email: email,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      error: "Database error",
      message: err.message,
      details: err.stack, // Stack trace for debugging
    });
  } finally {
    try {
      await sqlConnectionToServer.close();
    } catch (err) {
      console.error("Error closing connection:", err);
    }
  }
});

app.post("/api/update-user", async (req, res) => {
  const { userID, userType, firstName, lastName, email, phone } = req.body;

  console.log("Update request received:", {
    userID,
    userType,
    firstName,
    lastName,
    email,
    phone,
  });

  console.log("request body", req.body)

  try {
    const pool = await sqlConnectionToServer.connect(config);
    const request = pool.request();

    if (userType === "1") {
      // Use uspGetVendor stored procedure
      request.input("intVendorID", sqlConnectionToServer.Int, parseInt(userID));
      request.input(
        "strFirstName",
        sqlConnectionToServer.VarChar,
        firstName || null
      );
      request.input(
        "strLastName",
        sqlConnectionToServer.VarChar,
        lastName || null
      );
      request.input("strEmail", sqlConnectionToServer.VarChar, email || null);
      request.input("strPhone", sqlConnectionToServer.VarChar, phone || null);
      result = await request.execute("uspUpdateVendor");
    } else if (userType === "2") {
      // Use uspGetOrganizer stored procedure
      request.input(
        "intOrganizerID",
        sqlConnectionToServer.Int,
        parseInt(userID)
      );
      request.input(
        "strFirstName",
        sqlConnectionToServer.VarChar,
        firstName || null
      );
      request.input(
        "strLastName",
        sqlConnectionToServer.VarChar,
        lastName || null
      );
      request.input("strEmail", sqlConnectionToServer.VarChar, email || null);
      request.input("strPhone", sqlConnectionToServer.VarChar, phone || null);
      result = await request.execute("uspUpdateOrganizer");
    } else {
      throw new Error("Invalid user type");
    }

    res.json({
      success: true,
      message: "User information updated successfully",
      result,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      error: "Database error",
      message: err.message,
      details: err.stack, // Stack trace for debugging
    });
  } finally {
    try {
      await sqlConnectionToServer.close();
    } catch (err) {
      console.error("Error closing connection:", err);
    }
  }
});

app.post("/addtruck", async (req, res) => {
  try {
    const { strTruckName, intCuisineTypeID, intVendorID } = req.body;

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("intVendorID", sql.Int, intVendorID)
      .input("intCuisineTypeID", sql.Int, intCuisineTypeID)
      .input("strTruckName", sql.VarChar(50), strTruckName)
      .output("intFoodTruckID", sql.Int)
      .execute("uspCreateFoodTruck");

    res.status(200).json({
      success: true,
      message: "Truck added successfully",
      truckID: result.output.intFoodTruckID,
    });
  } catch (error) {
    console.error("Error in addtruck:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding the truck",
      error: error.message,
    });
  }
});

app.get("/api/truck-details", async (req, res) => {
  
  const userID = req.query.userID;
  console.log("received ID", userID)
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const request = pool.request();
    let result;
    request.input("intVendorID", sqlConnectionToServer.Int, parseInt(userID));
    result = await request.execute("uspGetFoodTruck");
    console.log("result for truck", result)
    // Check if we have results
    if (result && result.recordset && result.recordset.length > 0) {
      const truck = result.recordset[0];
      const truckName = `${truck.strTruckName}`;
      const custineType = `${truck.strCuisineType}`;
      const operatingLicense = `${truck.strOperatingLicense}`;
      res.json({
        success: true,
        truckName: truckName,
        custineType: custineType,
        operatingLicense: operatingLicense,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Truck not found",
      });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      error: "Database error",
      message: err.message,
      details: err.stack, // Stack trace for debugging
    });
  } finally {
    try {
      await sqlConnectionToServer.close();
    } catch (err) {
      console.error("Error closing connection:", err);
    }
  }
});
 
app.post("/addevent", upload.single("logo"), async (req, res) => {
  try {
    const eventData = req.body;
    console.log("Received file:", req.file);
    if (req.file) {
      eventData.strLogoFilePath = `/public/uploads/eventlogos/${req.file.filename}`;
    } else {
      console.log("No file uploaded");
    }

    console.log("Event Details:", {
      name: eventData.strEventName,
      description: eventData.strDescription,
      dateOfEvent: eventData.dtDateOfEvent,
      setupTime: eventData.dtSetUpTime,
      location: eventData.strLocation,
      totalSpaces: eventData.intTotalSpaces,
      expectedGuests: eventData.intExpectedGuests,
      organizerID: eventData.intOrganizerID,
    });

    console.log("Complete Event Data:", eventData);
    res.json({
      success: true,
      message: "Event created successfully",
      data: eventData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating event" });
  }
});

// get EventID and UserID to execute uspReserveSapce
app.post('/api/reserve', async (req, res) => {
  const { eventID, userID } = req.body;

  const parsedUserID = parseInt(userID)
  const parsedEventID = parseInt(eventID)
  try {
    const pool = await sqlConnectionToServer.connect(config);
    console.log("Database connected");
    const result = await pool.request()
      .input("intVendorID", sqlConnectionToServer.Int, parsedUserID)
      .input("intEventID", sqlConnectionToServer.Int, parsedEventID)
      .execute("uspReserveSpace");
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.log("Error")
    res.status(500).json({ error: err.message });
  }
});

// handle cancel reservation
app.post('/api/cancel-reservation', async (req, res) => {
  const { eventID, userID } = req.body;

  const parsedUserID = parseInt(userID)
  const parsedEventID = parseInt(eventID)

  console.log(parsedEventID, parsedUserID)
  try {
    const pool = await sqlConnectionToServer.connect(config);
    console.log("Database connected");
    const result = await pool.request()
      .input("intVendorID", sqlConnectionToServer.Int, parsedUserID)
      .input("intEventID", sqlConnectionToServer.Int, parsedEventID)
      .execute("uspDeleteReservation");
      
      res.json({
        success: true,
        message: "Reservation canceled successfully."
      });
  
  } catch (err) {
    console.error("Error canceling reservation:", err); 
    res.status(500).json({ 
      success: false,
      message: "Failed to cancel reservation",
      error: err.message 
    });
  }
});

// Delete Event
app.post('/api/delete-event', async (req, res) => {
  const { eventID } = req.body;

  const parsedEventID = parseInt(eventID)
  console.log(parsedEventID)
  try {
    const pool = await sqlConnectionToServer.connect(config);
    console.log("Database connected");
    const result = await pool.request()
      .input("intEventID", sqlConnectionToServer.Int, parsedEventID)
      .execute("uspDeleteEvent");
      
      res.json({
        success: true,
        message: "Event deleted successfully."
      });
  
  } catch (err) {
    console.error("Error canceling reservation:", err); 
    res.status(500).json({ 
      success: false,
      message: "Failed to cancel reservation",
      error: err.message 
    });
  }
});


//delete account
app.post('/api/delete-account', async (req, res) => {
  const { userID, userType } = req.body;
  
  try {
    const pool = await sqlConnectionToServer.connect(config);
    console.log("Database connected, deleting account for:", { userID, userType });

    let result;
    if (userType === "1") {
      result = await pool.request()
        .input("intVendorID", sqlConnectionToServer.Int, parseInt(userID))
        .execute("uspDeleteVendor");
    } else if (userType === "2") {
      result = await pool.request()
        .input("intOrganizerID", sqlConnectionToServer.Int, parseInt(userID))
        .execute("uspDeleteOrganizer");
    } else {
      return res.status(400).json({ success: false, message: "Invalid user type." });
    }
    console.log("Out of if")
    
    res.json({
      success: true,
      message: "Account deleted successfully."
    });

  }  catch (err) {
    console.error("Error in delete account:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


app.post('/api/additem', async (req, res) => {
  console.log(req.body);
  try {
    
    const { strItem, monPrice, intVendorID, intCategoryID  } = req.body;
    const parsedUserID = parseInt(intVendorID)
    const parsedMonPrice = parseInt(monPrice)
    const parsedCategoryID = parseInt(intCategoryID)
    const pool = await sqlConnectionToServer.connect(config);
    console.log("Before Store Procedure");
    const result = await pool.request()
      .input("intVendorID", sqlConnectionToServer.Int, parsedUserID)
      .input("strItem", sqlConnectionToServer.VarChar, strItem)
      .input("monPrice", sqlConnectionToServer.Int, parsedMonPrice)
      .input("intMenuCategoryID", sqlConnectionToServer.Int, parsedCategoryID)
      .execute("uspAddMenuItem");
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.log("Error")
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/getitem", async (req, res) => {
  const intVendorID = req.query.intVendorID;
  console.log("User ID", intVendorID);
  try {
    console.log("request body", req.body)
    console.log("Hello", intVendorID);
    const parsedUserID = parseInt(intVendorID)
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool.request()
    .input("intVendorID", sqlConnectionToServer.Int, parsedUserID)
    .execute("uspGetMenu");
    if (result && result.recordset && result.recordset.length > 0) {
      return res.json({
        success: true,
        data: result.recordset
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No menu items found"
      })
    }
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({
      error: "Database error",
      message: err.message,
    });
  }
});
    


app.listen(API_PORT, () => {
  console.log(`Server running on port ${API_PORT}`);
});



