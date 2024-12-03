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
app.use("/public", express.static("public"));

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
      SELECT TOP 3 
        intEventID,
        strEventName,
        strDescription,
        dtDateOfEvent,
        strLogoFilePath,
        strLocation,
        intTotalSpaces,
        intAvailableSpaces
      FROM TEvents
      WHERE dtDateOfEvent >= GETDATE()
      ORDER BY dtDateOfEvent ASC`;

    res.json(result.recordset);
    console.log("Root route accessed");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
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
                e.intOrganizerID,
                e.strDescription,
                e.dtDateOfEvent,
                e.strLocation,
                o.strFirstName + ' ' + o.strLastName as strOrganizerName,
                o.strPhone as strContact,
                o.strEmail,
                e.monPricePerSpace,
                e.intAvailableSpaces,
                e.strLogoFilePath
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

app.get("/api/events/:eventId/vendors", async (req, res) => {
  const { eventId } = req.params;
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool
      .request()
      .input("eventId", sqlConnectionToServer.Int, eventId)
      .execute("uspGetReservedFoodTrucks");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching vendors:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// API Server for Select all event
app.get("/api/allevents", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool.request().query(`
        SELECT  
          e.intEventID,
          e.strEventName,
          e.strDescription,
          e.dtDateOfEvent,
          e.strLocation,
          e.strLogoFilePath
        FROM TEvents as e
        WHERE e.dtDateOfEvent > GETDATE()
        ORDER BY e.dtDateOfEvent ASC;
    `);

    console.log(`Found ${result.recordset.length} events`);

    // Clean up and validate the data before sending
    const cleanedEvents = result.recordset.map((event) => ({
      ...event,
      strDescription: event.strDescription || "",
      strLogoFilePath: event.strLogoFilePath || null,
    }));

    res.json(cleanedEvents);
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
    console.log("attempting");
    const result = await pool.request().query(`
              SELECT 
                  E.intEventID,
                  E.strEventName,
                  E.dtDateOfEvent,
                  E.strLogoFilePath,
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
  console.log("User ID", parsedUserID, "User Type", parsedUserType);
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
    return res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching all events:", err);
    return res.status(500).json({
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
    console.log("attempting");
    const result = await pool.request().query(`
            SELECT  
          e.intEventID,
          e.strEventName,
          e.strDescription,
          e.dtDateOfEvent,
          e.strLocation,
          e.strLogoFilePath
        FROM TEvents AS e
           JOIN 
            TOrganizers ON e.intOrganizerID = TOrganizers.intOrganizerID
            WHERE e.dtDateOfEvent > GETDATE() AND e.intOrganizerID = ${parsedUserID}
            ORDER BY e.dtDateOfEvent ASC;
      `);

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
      const avatar = `${user.strPictureFilePath}`;

      res.json({
        success: true,
        userName: fullName,
        phoneNumber: phoneNumber,
        email: email,
        avatar: avatar,
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
  const { userID, userType, firstName, lastName, email, phone, avatarUrl } =
    req.body;

  console.log("Update request received:", {
    userID,
    userType,
    firstName,
    lastName,
    email,
    phone,
    avatarUrl,
  });

  try {
    const pool = await sqlConnectionToServer.connect(config);
    const request = pool.request();

    if (userType === "1") {
      // Vendor update
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
      request.input(
        "strPictureFilePath",
        sqlConnectionToServer.VarChar(500),
        avatarUrl || null
      ); // Use avatarUrl and increase length
      result = await request.execute("uspUpdateVendor");
    } else if (userType === "2") {
      // Organizer update
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
      request.input(
        "strPictureFilePath",
        sqlConnectionToServer.VarChar(500),
        avatarUrl || null
      ); // Use avatarUrl and increase length
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
      details: err.stack,
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
    const { strTruckName, intCuisineTypeID, intVendorID, strOperatingLicense } =
      req.body;

    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool
      .request()
      .input("intVendorID", sqlConnectionToServer.Int, intVendorID)
      .input("intCuisineTypeID", sqlConnectionToServer.Int, intCuisineTypeID)
      .input("strTruckName", sqlConnectionToServer.VarChar(50), strTruckName)
      .input("strOperatingLicense", sqlConnectionToServer.VarChar(50), strOperatingLicense)
      .output("intFoodTruckID", sqlConnectionToServer.Int)
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

app.post("/update-truck-details", async (req, res) => {
  try {
    const { userID, strTruckName, intCuisineTypeID, strOperatingLicense } =
      req.body;

    const pool = await sqlConnectionToServer.connect(config);

    // Fetch `intFoodTruckID` for the vendor
    const truckResult = await pool
      .request()
      .input("intVendorID", sql.Int, userID).query(`
        SELECT intFoodTruckID 
        FROM TFoodTrucks 
        WHERE intVendorID = @intVendorID
      `);

    if (!truckResult.recordset.length) {
      return res.status(404).json({
        success: false,
        message: "No food truck found for this vendor.",
      });
    }

    const intFoodTruckID = truckResult.recordset[0].intFoodTruckID;

    // Update the food truck details using the stored procedure
    const result = await pool
      .request()
      .input("intFoodTruckID", sql.Int, intFoodTruckID)
      .input("intVendorID", sql.Int, userID)
      .input("intCuisineTypeID", sql.Int, intCuisineTypeID || null)
      .input("strTruckName", sql.VarChar(50), strTruckName || null)
      .input(
        "strOperatingLicense",
        sql.VarChar(50),
        strOperatingLicense || null
      )
      .execute("uspUpdateFoodTruck");

    res.status(200).json({
      success: true,
      message: "Truck updated successfully.",
      truckID: result.output.intFoodTruckID,
    });
  } catch (error) {
    console.error("Error in /update-truck-details:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while updating the truck.",
      error: error.message,
    });
  }
});

app.get("/api/truck-details", async (req, res) => {
  const userID = req.query.userID;
  console.log("received ID", userID);
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const request = pool.request();
    let result;
    request.input("intVendorID", sqlConnectionToServer.Int, parseInt(userID));
    result = await request.execute("uspGetFoodTruck");
    console.log("result for truck", result);
    // Check if we have results
    if (result && result.recordset && result.recordset.length > 0) {
      const truck = result.recordset[0];
      const truckName = `${truck.strTruckName}`;
      const custineType = `${truck.strCuisineType}`;
      const strOperatingLicense = `${truck.strOperatingLicense}`;
      res.json({
        success: true,
        truckName: truckName,
        custineType: custineType,
        strOperatingLicense: strOperatingLicense,
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
    console.log("Received request body:", eventData); // Debug log

    if (req.file) {
      eventData.strLogoFilePath = `/public/uploads/eventlogos/${req.file.filename}`;
    }

    // Validate required fields
    if (
      !eventData.intOrganizerID ||
      !eventData.strEventName ||
      !eventData.dtDateOfEvent
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        receivedData: eventData,
      });
    }

    const pool = await sqlConnectionToServer.connect(config);
    console.log("Database connected"); // Debug log

    try {
      const request = pool.request();

      const result = await request
        .input(
          "intOrganizerID",
          sqlConnectionToServer.Int,
          parseInt(eventData.intOrganizerID)
        )
        .input(
          "strEventName",
          sqlConnectionToServer.VarChar(50),
          eventData.strEventName
        )
        .input(
          "strDescription",
          sqlConnectionToServer.VarChar(255),
          eventData.strDescription || ""
        )
        .input(
          "dtDateOfEvent",
          sqlConnectionToServer.DateTime,
          new Date(eventData.dtDateOfEvent)
        )
        .input(
          "dtSetUpTime",
          sqlConnectionToServer.DateTime,
          new Date(eventData.dtDateOfEvent)
        ) // Using same as event date since setup time was removed
        .input(
          "strLocation",
          sqlConnectionToServer.VarChar(50),
          eventData.strLocation
        )
        .input(
          "intTotalSpaces",
          sqlConnectionToServer.Int,
          parseInt(eventData.intTotalSpaces)
        )
        .input(
          "intAvailableSpaces",
          sqlConnectionToServer.Int,
          parseInt(eventData.intTotalSpaces)
        )
        .input(
          "monPricePerSpace",
          sqlConnectionToServer.Money,
          eventData.monPricePerSpace
        )
        .input(
          "intExpectedGuests",
          sqlConnectionToServer.Int,
          parseInt(eventData.intExpectedGuests)
        )
        .input("intStatusID", sqlConnectionToServer.Int, 1)
        .input(
          "strLogoFilePath",
          sqlConnectionToServer.VarChar(500),
          eventData.strLogoFilePath || null
        )
        .input("monTotalRevenue", sqlConnectionToServer.Money, 0)
        .output("intEventID", sqlConnectionToServer.Int)
        .execute("uspCreateEvent");

      console.log("Stored procedure executed successfully", result); // Debug log

      const newEventId = result.output.intEventID;

      res.json({
        success: true,
        message: "Event created successfully",
        data: {
          ...eventData,
          intEventID: newEventId,
        },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      res.status(500).json({
        success: false,
        message: "Database error",
        error: dbError.message,
        procedure: "uspCreateEvent",
        parameters: eventData,
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// get EventID and UserID to execute uspReserveSapce
app.post("/api/reserve", async (req, res) => {
  const { eventID, userID } = req.body;

  const parsedUserID = parseInt(userID);
  const parsedEventID = parseInt(eventID);
  try {
    const pool = await sqlConnectionToServer.connect(config);
    console.log("Database connected");
    const result = await pool
      .request()
      .input("intVendorID", sqlConnectionToServer.Int, parsedUserID)
      .input("intEventID", sqlConnectionToServer.Int, parsedEventID)
      .execute("uspReserveSpace");
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.log("Error");
    res.status(500).json({ error: err.message });
  }
});

// handle cancel reservation
app.post("/api/cancel-reservation", async (req, res) => {
  const { eventID, userID } = req.body;

  const parsedUserID = parseInt(userID);
  const parsedEventID = parseInt(eventID);

  console.log(parsedEventID, parsedUserID);
  try {
    const pool = await sqlConnectionToServer.connect(config);
    console.log("Database connected");
    const result = await pool
      .request()
      .input("intVendorID", sqlConnectionToServer.Int, parsedUserID)
      .input("intEventID", sqlConnectionToServer.Int, parsedEventID)
      .execute("uspDeleteReservation");

    res.json({
      success: true,
      message: "Reservation canceled successfully.",
    });
  } catch (err) {
    console.error("Error canceling reservation:", err);
    res.status(500).json({
      success: false,
      message: "Failed to cancel reservation",
      error: err.message,
    });
  }
});

// Delete Event
app.post("/api/delete-event", async (req, res) => {
  const { eventID } = req.body;

  const parsedEventID = parseInt(eventID);
  console.log(parsedEventID);
  try {
    const pool = await sqlConnectionToServer.connect(config);
    console.log("Database connected");
    const result = await pool
      .request()
      .input("intEventID", sqlConnectionToServer.Int, parsedEventID)
      .execute("uspDeleteEvent");

    res.json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (err) {
    console.error("Error canceling reservation:", err);
    res.status(500).json({
      success: false,
      message: "Failed to cancel reservation",
      error: err.message,
    });
  }
});

//delete account
app.post("/api/delete-account", async (req, res) => {
  const { userID, userType } = req.body;

  try {
    const pool = await sqlConnectionToServer.connect(config);
    console.log("Database connected, deleting account for:", {
      userID,
      userType,
    });

    let result;
    if (userType === "1") {
      result = await pool
        .request()
        .input("intVendorID", sqlConnectionToServer.Int, parseInt(userID))
        .execute("uspDeleteVendor");
    } else if (userType === "2") {
      result = await pool
        .request()
        .input("intOrganizerID", sqlConnectionToServer.Int, parseInt(userID))
        .execute("uspDeleteOrganizer");
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type." });
    }
    console.log("Out of if");

    res.json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (err) {
    console.error("Error in delete account:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/api/additem", async (req, res) => {
  console.log(req.body);
  try {
    const { strItem, monPrice, intVendorID, intCategoryID } = req.body;
    const parsedUserID = parseInt(intVendorID);
    const parsedMonPrice = parseInt(monPrice);
    const parsedCategoryID = parseInt(intCategoryID);
    const pool = await sqlConnectionToServer.connect(config);
    console.log("Before Store Procedure");
    const result = await pool
      .request()
      .input("intVendorID", sqlConnectionToServer.Int, parsedUserID)
      .input("strItem", sqlConnectionToServer.VarChar, strItem)
      .input("monPrice", sqlConnectionToServer.Int, parsedMonPrice)
      .input("intMenuCategoryID", sqlConnectionToServer.Int, parsedCategoryID)
      .execute("uspAddMenuItem");
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.log("Error");
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/getitem", async (req, res) => {
  const intVendorID = req.query.intVendorID;
  console.log("User ID", intVendorID);
  try {
    const parsedUserID = parseInt(intVendorID);
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool
      .request()
      .input("intVendorID", sqlConnectionToServer.Int, parsedUserID)
      .execute("uspGetMenu");
    if (result && result.recordset && result.recordset.length > 0) {
      return res.json({
        success: true,
        data: result.recordset,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No menu items found",
      });
    }
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({
      error: "Database error",
      message: err.message,
    });
  }
});

app.post("/api/vendor-feedback", async (req, res) => {
  const {
    intVendorID,
    intEventID,
    monTotalRevenue,
    intRating,
    strVendorComment,
  } = req.body;
  console.log("Request received", req.body);
  try {
    const pool = await sqlConnectionToServer.connect(config);
    await pool
      .request()
      .input("intVendorID", sqlConnectionToServer.Int, intVendorID)
      .input("intEventID", sqlConnectionToServer.Int, intEventID)
      .input("monTotalRevenue", sqlConnectionToServer.Money, monTotalRevenue)
      .input("intRating", sqlConnectionToServer.Int, intRating)
      .input(
        "strVendorComment",
        sqlConnectionToServer.VarChar(500),
        strVendorComment
      )
      .execute("uspVendorFeedBack");

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// Get Feedback and rating to show in EventInformation Page
app.get("/api/events/:eventId/comments", async (req, res) => {
  const { eventId } = req.params;
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool
      .request()
      .input("intEventId", sqlConnectionToServer.Int, eventId)
      .execute("uspEventComments");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

//Delete an item from a menu take UserID from session and strItem
app.post("/api/deleteitem", async (req, res) => {
  const { strItem, intVendorID } = req.body;

  try {
    console.log("Deleting item:", { strItem, intVendorID });
    const pool = await sqlConnectionToServer.connect(config);

    const result = await pool
      .request()
      .input("intVendorID", sqlConnectionToServer.Int, intVendorID)
      .input("strItem", sqlConnectionToServer.VarChar(50), strItem)
      .execute("uspDeleteMenuItem");

    console.log("Delete result:", result);
    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (err) {
    console.error("Error in delete item:", err);
    res.status(500).json({
      error: "Failed to delete item",
      message: err.message,
      details: err,
    });
  }
});

// Get cuisine limit to show in eventinformation page
app.get("/api/events/:eventId/cuisine-limits", async (req, res) => {
  const { eventId } = req.params;
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool
      .request()
      .input("intEventID", sqlConnectionToServer.Int, eventId)
      .execute("uspGetCuisineLimits");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching cuisine limits:", err);
    res.status(500).json({ error: "Failed to fetch cuisine limits" });
  }
});

// Get Cusine Type
app.get("/api/cuisine-types", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool
      .request()
      .query("SELECT intCuisineTypeID, strCuisineType FROM TCuisineTypes");

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cuisine types" });
  }
});

app.post("/api/events/:eventId/cuisine-limits", async (req, res) => {
  const { eventId } = req.params;
  const { cuisineTypeId, limit } = req.body;
  console.log("EventID received", typeof eventId);
  console.log("CusineType", cuisineTypeId, " Limit", typeof limit);

  const parsedEventID = parseInt(eventId);
  try {
    const pool = await sqlConnectionToServer.connect(config);
    await pool
      .request()
      .input("intEventID", sqlConnectionToServer.Int, parsedEventID)
      .input("intCuisineTypeID", sqlConnectionToServer.Int, cuisineTypeId)
      .input("intLimit", sqlConnectionToServer.Int, limit)
      .execute("uspAddCuisineLimit");

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add cuisine limit" });
  }
});

// Get Organizer statistic for dashboard
app.get("/api/organizer/stats/:userId", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const userId = req.params.userId;

    // Execute stored procedures
    const [pastEvents, futureEvents, totalEvents, profitableEvent, avgRevenue] =
      await Promise.all([
        pool
          .request()
          .input("intOrganizerID", sqlConnectionToServer.Int, userId)
          .execute("uspCountOrganizersPastEvents"),

        pool
          .request()
          .input("intOrganizerID", sqlConnectionToServer.Int, userId)
          .execute("uspCountOrganizersFutureEvents"),

        pool
          .request()
          .input("intOrganizerID", sqlConnectionToServer.Int, userId)
          .execute("uspCountOrganizersTotalEvents"),

        pool
          .request()
          .input("intOrganizerID", sqlConnectionToServer.Int, userId)
          .execute("uspOrganizerMostProfitableEvent"),

        pool
          .request()
          .input("intOrganizerID", sqlConnectionToServer.Int, userId)
          .execute("uspAverageRevenueForOrganizer"),
      ]);
    res.json({
      pastEvents: pastEvents.recordset[0]?.PastEventCount || 0,
      futureEvents: futureEvents.recordset[0]?.FutureEventCount || 0,
      totalEvents: totalEvents.recordset[0]?.TotalEventCount || 0,
      mostProfitable: {
        name: profitableEvent.recordset[0]?.strEventName || "",
        revenue: profitableEvent.recordset[0]?.monTotalRevenue || 0,
      },
      averageRevenue: avgRevenue.recordset[0]?.AverageRevenue || 0,
    });
  } catch (error) {
    console.error(error);
    console.log(userID);
    res.status(500).json({ error: "Failed to fetch organizer statistics" });
  }
});

app.get("/api/organizer/upcoming-events/:userId", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const userId = req.params.userId;

    const result = await pool
      .request()
      .input("intOrganizerID", sqlConnectionToServer.Int, userId)
      .execute("uspUpcomingEventsOrg");

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch upcoming events" });
  }
});

// Get Vendor statistic for dashboard
app.get("/api/vendor/stats/:userId", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const userId = req.params.userId;

    console.log(userId);
    // Execute stored procedures
    const [pastEvents, futureEvents, totalEvents, profitableEvent, avgRevenue] =
      await Promise.all([
        pool
          .request()
          .input("intVendorID", sqlConnectionToServer.Int, userId)
          .execute("uspCountVendorsPastEvents"),

        pool
          .request()
          .input("intVendorID", sqlConnectionToServer.Int, userId)
          .execute("uspCountVendorsFutureEvents"),

        pool
          .request()
          .input("intVendorID", sqlConnectionToServer.Int, userId)
          .execute("uspCountVendorsTotalEvents"),

        pool
          .request()
          .input("intVendorID", sqlConnectionToServer.Int, userId)
          .execute("uspVendorMostProfitableEvent"),

        pool
          .request()
          .input("intVendorID", sqlConnectionToServer.Int, userId)
          .execute("uspVendorAverageRevenue "),
      ]);
    res.json({
      pastEvents: pastEvents.recordset[0]?.PastEventCount || 0,
      futureEvents: futureEvents.recordset[0]?.FutureEventCount || 0,
      totalEvents: totalEvents.recordset[0]?.TotalEventCount || 0,
      mostProfitable: {
        name: profitableEvent.recordset[0]?.EventName || "",
        revenue: profitableEvent.recordset[0]?.TotalRevenue || 0,
      },
      averageRevenue: avgRevenue.recordset[0]?.AverageRevenue || 0,
    });
  } catch (error) {
    console.error(error);
    console.log(userID);
    res.status(500).json({ error: "Failed to fetch organizer statistics" });
  }
});
// Get information to show in update event page
app.get("/api/updateevent/:eventId", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const result = await pool
      .request()
      .input("intEventID", sqlConnectionToServer.Int, req.params.eventId)
      .execute("uspGetEvent");

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post(
  "/api/updateevent/:eventId",
  upload.single("logo"),
  async (req, res) => {
    try {
      const eventData = req.body;
      if (req.file) {
        eventData.strLogoFilePath = `/public/uploads/eventlogos/${req.file.filename}`;
      }

      const pool = await sqlConnectionToServer.connect(config);
      const result = await pool
        .request()
        .input("intEventID", sqlConnectionToServer.Int, req.params.eventId)
        .input(
          "strEventName",
          sqlConnectionToServer.VarChar(50),
          eventData.strEventName
        )
        .input(
          "strDescription",
          sqlConnectionToServer.VarChar(255),
          eventData.strDescription
        )
        .input(
          "dtDateOfEvent",
          sqlConnectionToServer.DateTime,
          eventData.dtDateOfEvent
        )
        .input(
          "strLocation",
          sqlConnectionToServer.VarChar(50),
          eventData.strLocation
        )
        .input(
          "intTotalSpaces",
          sqlConnectionToServer.Int,
          eventData.intTotalSpaces
        )
        .input(
          "intExpectedGuests",
          sqlConnectionToServer.Int,
          eventData.intExpectedGuests
        )
        .input(
          "strLogoFilePath",
          sqlConnectionToServer.VarChar(500),
          eventData.strLogoFilePath
        )
        .input(
          "monPricePerSpace",
          sqlConnectionToServer.Money,
          eventData.monPricePerSpace
        )
        .execute("uspUpdateEvent");

      res.json({
        success: true,
        message: "Event updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error updating event",
      });
    }
  }
);

// Get data to show in chart
app.get("/api/vendor/menu-items/:userId", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const userId = req.params.userId;
    console.log("Heelloo");
    const result = await pool
      .request()
      .input("intVendorID", sqlConnectionToServer.Int, userId)
      .execute("uspMenuItemsSold");

    console.log(result.recordset);
    res.json(
      result.recordset.map((item) => ({
        Item: item.Item,
        UnitsSold: item.UnitsSold,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch menu items data" });
  }
});

// Update units sold
app.post("/api/updateunits", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const { intVendorID, strItem, intUnitsSold } = req.body;

    await pool
      .request()
      .input("intVendorID", sqlConnectionToServer.Int, intVendorID)
      .input("strItem", sqlConnectionToServer.VarChar, strItem)
      .input("intUnitsSold", sqlConnectionToServer.Int, intUnitsSold)
      .execute("uspUpdateUnitsSold");

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update units" });
  }
});

app.get("/api/foodtruck", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const { intVendorID } = req.query;

    const result = await pool
      .request()
      .input("intVendorID", sqlConnectionToServer.Int, intVendorID)
      .execute("uspGetFoodTruck");

    if (result.recordset && result.recordset.length > 0) {
      res.json({
        success: true,
        data: result.recordset[0],
      });
    } else {
      res.json({
        success: false,
        message: "No truck found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch truck details",
    });
  }
});

// Update truck details
app.post("/api/updatetruck", async (req, res) => {
  try {
    const pool = await sqlConnectionToServer.connect(config);
    const { intVendorID, strTruckName, intCuisineTypeID, strOperatingLicense } =
      req.body;
    console.log("Reqeustbody", req.body);
    await pool
      .request()
      .input("intVendorID", sqlConnectionToServer.Int, intVendorID)
      .input("strTruckName", sqlConnectionToServer.VarChar, strTruckName)
      .input("intCuisineTypeID", sqlConnectionToServer.Int, intCuisineTypeID)
      .input(
        "strOperatingLicense",
        sqlConnectionToServer.VarChar,
        strOperatingLicense
      )
      .execute("uspUpdateFoodTruck");

    res.json({
      success: true,
      message: "Truck updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update truck details",
    });
  }
});

app.listen(API_PORT, () => {
  console.log(`Server running on port ${API_PORT}`);
});
