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
                  V.intVendorID = ${parsedUserID}
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
            WHERE TEvents.intOrganizerID = ${parsedUserID}
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

app.post("/addtruck", async (req, res) => {
  try {
    const { strTruckName, intCuisineTypeID, intVendorID } = req.body;
    const truckData = {
      strTruckName,
      intCuisineTypeID,
      intVendorID,
    };
    res.status(200).json({
      success: true,
      message: "Signup data received successfully",
      user: {
        strTruckName: req.body.strTruckName,
        intCuisineTypeID: req.body.intCuisineTypeID,
        intVendorID: req.body.intVendorID,
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

app.listen(API_PORT, () => {
  console.log(`Server running on port ${API_PORT}`);
});
