-- --------------------------------------------------------------------------------
-- Capstone Project Fall '24
-- TruckSpot (FoodTruck & Event App)
-- Team C 
-- Megan Noel, Seth Lubic, Testimony Awuzie & Apiwat Anachai
--
--
-- --------------------------------------------------------------------------------
-- --------------------------------------------------------------------------------
-- Options
-- --------------------------------------------------------------------------------
USE truckspot; 

--USE dbTruckSpot;

SET NOCOUNT ON; 

 

-- --------------------------------------------------------------------------------
-- Drop statements (Tables, Procedures)
-- --------------------------------------------------------------------------------
IF OBJECT_ID('TMenus')				IS NOT NULL DROP TABLE TMenus; 
IF OBJECT_ID('TFoodTruckEvents')	IS NOT NULL DROP TABLE TFoodTruckEvents;     
IF OBJECT_ID('TReservations')		IS NOT NULL DROP TABLE TReservations;        
IF OBJECT_ID('TPayments')			IS NOT NULL DROP TABLE TPayments;            
IF OBJECT_ID('TEventSponsors')		IS NOT NULL DROP TABLE TEventSponsors;       
IF OBJECT_ID('TEventCuisines')		IS NOT NULL DROP TABLE TEventCuisines;      
IF OBJECT_ID('TEventSpaces')		IS NOT NULL DROP TABLE TEventSpaces;         
IF OBJECT_ID('TEvents')				IS NOT NULL DROP TABLE TEvents;              
IF OBJECT_ID('TFoodTrucks')			IS NOT NULL DROP TABLE TFoodTrucks;         
IF OBJECT_ID('TSponsors')			IS NOT NULL DROP TABLE TSponsors;            
IF OBJECT_ID('TCuisineTypes')		IS NOT NULL DROP TABLE TCuisineTypes;  
IF OBJECT_ID('TVendors')			IS NOT NULL DROP TABLE TVendors; 
IF OBJECT_ID('TOrganizers')			IS NOT NULL DROP TABLE TOrganizers; 
IF OBJECT_ID('TStatuses')			IS NOT NULL DROP TABLE TStatuses; 

IF OBJECT_ID( 'uspLoginUser' )	    IS NOT NULL DROP PROCEDURE  uspLoginUser

IF OBJECT_ID( 'uspCreateVendor' )	 IS NOT NULL DROP PROCEDURE  uspCreateVendor
IF OBJECT_ID( 'uspCreateOrganizer' ) IS NOT NULL DROP PROCEDURE  uspCreateOrganizer
IF OBJECT_ID( 'uspCreateFoodTruck')	IS NOT NULL DROP PROCEDURE  uspCreateFoodTruck
IF OBJECT_ID( 'uspCreateEvent')	    IS NOT NULL DROP PROCEDURE  uspCreateEvent

IF OBJECT_ID( 'uspUpdateVendor')	    IS NOT NULL DROP PROCEDURE  uspUpdateVendor
IF OBJECT_ID( 'uspUpdateOrganizer')	    IS NOT NULL DROP PROCEDURE  uspUpdateOrganizer
IF OBJECT_ID( 'uspUpdateEvent')	    IS NOT NULL DROP PROCEDURE  uspUpdateEvent
IF OBJECT_ID( 'uspUpdateFoodTruck')	IS NOT NULL DROP PROCEDURE  uspUpdateFoodTruck

IF OBJECT_ID( 'uspGetVendor')			IS NOT NULL DROP PROCEDURE  uspGetVendor
IF OBJECT_ID( 'uspGetOrganizer')			IS NOT NULL DROP PROCEDURE  uspGetOrganizer
IF OBJECT_ID( 'uspGetFoodTruck')	IS NOT NULL DROP PROCEDURE  uspGetFoodTruck
IF OBJECT_ID( 'uspGetEvent')		IS NOT NULL DROP PROCEDURE  uspGetEvent

IF OBJECT_ID( 'uspDeleteVendor')			IS NOT NULL DROP PROCEDURE  uspDeleteVendor
IF OBJECT_ID( 'uspDeleteOrganizer')			IS NOT NULL DROP PROCEDURE  uspDeleteOrganizer


-- --------------------------------------------------------------------------------
-- Tables
-- --------------------------------------------------------------------------------

CREATE TABLE TCuisineTypes
(
	 intCuisineTypeID      INTEGER IDENTITY			NOT NULL
    ,strCuisineType        VARCHAR(50)				NOT NULL
    ,CONSTRAINT TCuisineTypes_PK PRIMARY KEY (intCuisineTypeID)
);

CREATE TABLE TStatuses
(
	 intStatusID      INTEGER IDENTITY			NOT NULL
    ,strStatus        VARCHAR(50)				NOT NULL
    ,CONSTRAINT TStatuses_PK PRIMARY KEY (intStatusID)
);

CREATE TABLE TVendors
(
	 intVendorID			INTEGER	IDENTITY		NOT NULL
	,strFirstName			VARCHAR(50)				NOT NULL
	,strLastName			VARCHAR(50)				NOT NULL
	,strPassword			VARCHAR(50)				NOT NULL
	,strEmail				VARCHAR(50)				NOT NULL UNIQUE
	,strPhone				VARCHAR(50)				NOT NULL
	,dtDateCreated			DATETIME				NOT NULL
	,dtLastLogin			DATETIME				NOT NULL
	,CONSTRAINT TVendors_PK PRIMARY KEY ( intVendorID )
);

CREATE TABLE TOrganizers
(
	 intOrganizerID			INTEGER	IDENTITY		NOT NULL
	,strFirstName			VARCHAR(50)				NOT NULL
	,strLastName			VARCHAR(50)				NOT NULL
	,strPassword			VARCHAR(50)				NOT NULL
	,strEmail				VARCHAR(50)				NOT NULL UNIQUE
	,strPhone				VARCHAR(50)				NOT NULL
	,dtDateCreated			DATETIME				NOT NULL
	,dtLastLogin			DATETIME				NOT NULL
	,CONSTRAINT TOrganizers_PK PRIMARY KEY ( intOrganizerID )
);

CREATE TABLE TEvents
(
	 intEventID				INTEGER	IDENTITY		NOT NULL
	,intOrganizerID				INTEGER				NOT NULL
	,strEventName			VARCHAR(50)				NOT NULL
	,dtDateOfEvent			DATETIME				NOT NULL
	,dtSetUpTime			DATETIME				NOT NULL
	,strLocation			VARCHAR(50)				NOT NULL
	,intTotalSpaces			INTEGER					NOT NULL
	,intAvailableSpaces		INTEGER					NOT NULL
	,monPricePerSpace		MONEY					NOT NULL
	,intExpectedGuests		INTEGER					NOT NULL
	,intStatusID			INTEGER					NOT NULL             
	,strLogoFilePath		VARCHAR(500)      -- will be a relative file path in our project. ex: "images/logo.gif"
	,monTotalRevenue		MONEY
	,CONSTRAINT TEvents_PK PRIMARY KEY ( intEventID )
	,FOREIGN KEY ( intOrganizerID ) REFERENCES TOrganizers ( intOrganizerID ) ON DELETE CASCADE
	,FOREIGN KEY ( intStatusID ) REFERENCES TStatuses ( intStatusID )
	,CONSTRAINT chk_monPricePerSpace CHECK (monPricePerSpace > 0)
	,CONSTRAINT chk_TotalSpaces CHECK (intTotalSpaces >= 0)
	,CONSTRAINT chk_AvailableSpaces CHECK (intAvailableSpaces >= 0 AND intAvailableSpaces <= intTotalSpaces)
);

CREATE TABLE TEventCuisines
(
    intEventCuisineID		INTEGER IDENTITY		NOT NULL
    ,intEventID				INTEGER					NOT NULL
   ,intCuisineTypeID        INTEGER					NOT NULL
   ,intLimit				INTEGER					NOT NULL
    ,CONSTRAINT TEventCuisines_PK PRIMARY KEY (intEventCuisineID)
    ,FOREIGN KEY (intEventID) REFERENCES TEvents (intEventID) ON DELETE CASCADE
    ,FOREIGN KEY (intCuisineTypeID) REFERENCES TCuisineTypes (intCuisineTypeID)
   ,CONSTRAINT chk_LimitPerCuisine CHECK (intLimit > 0)
);

CREATE TABLE TFoodTrucks
(
	 intFoodTruckID			INTEGER	IDENTITY		NOT NULL
	,intVendorID			INTEGER					NOT NULL
	,intCuisineTypeID		INTEGER					NOT NULL
	,strTruckName			VARCHAR(50)				NOT NULL
	,monMinPrice			MONEY					NOT NULL -- min and max price are for finding price range 															 
	,monMaxPrice			MONEY					NOT NULL 
	,strLogoFilePath		VARCHAR(500)				    -- will be a relative file path in our project. ex: "images/logo.gif"
	,strOperatingLicense	VARCHAR(50)				NOT NULL
	,CONSTRAINT TFoodTrucks_PK PRIMARY KEY ( intFoodTruckID ) 
	,FOREIGN KEY ( intVendorID ) REFERENCES TVendors ( intVendorID ) ON DELETE CASCADE
	,FOREIGN KEY ( intCuisineTypeID ) REFERENCES TCuisineTypes ( intCuisineTypeID )
	,CONSTRAINT chk_MinMaxPrice CHECK (monMinPrice <= monMaxPrice)  
    ,CONSTRAINT chk_PositivePrices CHECK (monMinPrice > 0 AND monMaxPrice > 0)
);

CREATE TABLE TSponsors
(
	 intSponsorID			INTEGER	IDENTITY		NOT NULL
	,strSponsorName			VARCHAR(50)				NOT NULL
	,strEmail				VARCHAR(50)				NOT NULL UNIQUE
	,strPhone				VARCHAR(50)				NOT NULL
	,CONSTRAINT TSponsors_PK PRIMARY KEY ( intSponsorID ) 
);

CREATE TABLE TEventSpaces
(
	 intEventSpaceID		INTEGER	IDENTITY		NOT NULL
	,intEventID				INTEGER					NOT NULL
	,strSpaceNum			VARCHAR(50)				NOT NULL
	,strSize				VARCHAR(50)				NOT NULL
	,boolIsAvailable		BIT						NOT NULL -- 1 for available, 0 for not available
	,CONSTRAINT TEventSpaces_PK PRIMARY KEY ( intEventSpaceID ) 
	,FOREIGN KEY ( intEventID ) REFERENCES TEvents ( intEventID ) ON DELETE CASCADE
);

CREATE TABLE TReservations
(
	 intReservationID		INTEGER	IDENTITY		NOT NULL
	,intEventSpaceID		INTEGER					NOT NULL
	,intFoodTruckID			INTEGER					NOT NULL
	,dtReservationDate		DATETIME				NOT NULL -- the date they made the reservation, not the date of the event that it's for lol
	,intStatusID			INTEGER					NOT NULL
	,CONSTRAINT TReservations_PK PRIMARY KEY ( intReservationID )
	,FOREIGN KEY ( intEventSpaceID ) REFERENCES TEventSpaces ( intEventSpaceID ) ON DELETE CASCADE
	,FOREIGN KEY ( intFoodTruckID ) REFERENCES TFoodTrucks ( intFoodTruckID ) ON DELETE CASCADE
	,FOREIGN KEY ( intStatusID ) REFERENCES TStatuses ( intStatusID )
);

CREATE TABLE TFoodTruckEvents
(
	 intFoodTruckEventID	INTEGER	IDENTITY		NOT NULL
	,intEventID				INTEGER					NOT NULL
	,intFoodTruckID			INTEGER					NOT NULL
	,monTotalRevenue		MONEY					 -- revenue for the foodtruck vendor at this event
	,intRating				INTEGER					 -- vendor rating the event
	,strVendorComment		VARCHAR(500)			 -- vendor comment on event
	,CONSTRAINT TFoodTruckEvents_PK PRIMARY KEY ( intFoodTruckEventID )
	,FOREIGN KEY ( intEventID ) REFERENCES TEvents ( intEventID ) ON DELETE CASCADE
	,FOREIGN KEY ( intFoodTruckID ) REFERENCES TFoodTrucks ( intFoodTruckID ) ON DELETE CASCADE
	,CONSTRAINT chk_TotalRevenue CHECK (monTotalRevenue >= 0) 
);

CREATE TABLE TMenus (
     intMenuID				INTEGER  IDENTITY		NOT NULL
    ,intFoodTruckEventID	INTEGER					NOT NULL         
    ,strItem				VARCHAR(255)			NOT NULL         
    ,monPrice				MONEY					NOT NULL         
    ,intUnitsSold			INTEGER					NULL                    
    ,CONSTRAINT TMenus_PK PRIMARY KEY ( intMenuID )
    ,FOREIGN KEY ( intFoodTruckEventID ) REFERENCES TFoodTruckEvents ( intFoodTruckEventID ) ON DELETE CASCADE
);

CREATE TABLE TEventSponsors
(
	 intEventSponsorID		INTEGER	IDENTITY		NOT NULL
	,intEventID				INTEGER					NOT NULL
	,intSponsorID			INTEGER					NOT NULL
	,monSponsorAmount		MONEY					NOT NULL
	,CONSTRAINT TEventSponsors_PK PRIMARY KEY ( intEventSponsorID )
	,FOREIGN KEY ( intEventID ) REFERENCES TEvents ( intEventID ) ON DELETE CASCADE
	,FOREIGN KEY ( intSponsorID ) REFERENCES TSponsors ( intSponsorID ) ON DELETE CASCADE
	,CONSTRAINT chk_SponsorAmount CHECK (monSponsorAmount >= 0) 
);

CREATE TABLE TPayments
(
	 intPaymentID			INTEGER	IDENTITY		NOT NULL
	,intReservationID		INTEGER					NOT NULL
	,monAmountPaid			MONEY					NOT NULL
	,dtPaymentDate			DATETIME				NOT NULL
	,CONSTRAINT TPayments_PK PRIMARY KEY ( intPaymentID )
	,FOREIGN KEY ( intReservationID ) REFERENCES TReservations ( intReservationID ) ON DELETE CASCADE
	,CONSTRAINT chk_AmountPaid CHECK (monAmountPaid >= 0) 
);

-- --------------------------------------------------------------------------------
-- Populate
-- --------------------------------------------------------------------------------

-- TCuisineTypes
INSERT INTO TCuisineTypes (strCuisineType)
VALUES 
('Italian'), -- id 1
('Mexican'), -- id 2
('American'), -- id 3
('Indian'), -- id 4
('Asian'), -- id 5
('Bakery/Desserts'), -- id 6
('Other'); -- id 7


-- TStatuses
INSERT INTO TStatuses (strStatus)
VALUES 
('Scheduled'), -- id 1
('Completed'); -- id 2

-- TVendors
INSERT INTO TVendors (strFirstName, strLastName, strPassword, strEmail, strPhone, dtDateCreated, dtLastLogin) 
VALUES 
('Alice', 'Smith',  'password111', 'alice@gmail.com', '123-456-7890', GETDATE(), GETDATE()), -- id 1
('Evan', 'Johnson', 'password222', 'evan@gmail.com', '123-456-7891', GETDATE(), GETDATE()), -- id 2
('Charlie', 'Williams',  'password333', 'charlie@gmail.com', '123-456-7892', GETDATE(), GETDATE()), -- id 3
('Jimmy', 'Brown',  'password444', 'jimmy@gmail.com', '123-456-7893', GETDATE(), GETDATE()), -- id 4
('Eva', 'Jones', 'password555', 'eva@gmail.com', '123-456-7894', GETDATE(), GETDATE()); -- id 5


-- TOrganizers
INSERT INTO TOrganizers (strFirstName, strLastName, strPassword, strEmail, strPhone, dtDateCreated, dtLastLogin) 
VALUES 
('Lola', 'Garcia', 'password666', 'lola@gmail.com', '123-456-7895', GETDATE(), GETDATE()), -- id 1
('Grace', 'Martinez',  'password777', 'grace@gmail.com', '123-456-7896', GETDATE(), GETDATE()), -- id 2
('Steph', 'Davis',  'password888', 'steph@gmail.com', '123-456-7897', GETDATE(), GETDATE()), -- id 3
('Isabella', 'Rodriguez',  'password999', 'isabella@gmail.com', '123-456-7898', GETDATE(), GETDATE()), -- id 4
('Jack', 'Odell', 'password000', 'jack@gmail.com', '123-456-7899', GETDATE(), GETDATE()); -- id 5


-- TEvents
INSERT INTO TEvents (intOrganizerID, strEventName, dtDateOfEvent, dtSetUpTime, strLocation, intTotalSpaces, intAvailableSpaces, monPricePerSpace, intExpectedGuests, intStatusID, strLogoFilePath, monTotalRevenue)
VALUES 
(1, 'Halloween Festival', '2024-11-01', '2024-11-01 09:00:00', 'City Park', 10, 5, 10.00, 500, 1, 'images/sample.jpg', null), -- id 1
(2, 'Street Food Fair', '2024-11-15', '2024-11-15 09:00:00', 'Downtown', 15, 15, 15.00, 450, 1, 'images/sample.jpg', null), -- id 2
(3, 'Local Farmers Market', '2024-11-22', '2024-11-22 08:00:00', 'Main Square', 20, 18, 20.00, 100, 1, 'images/sample.jpg', null), -- id 3
(4, 'Winter Wonderland', '2023-12-05', '2023-12-05 09:00:00', 'Ice Rink', 20, 8, 13.00, 80, 2, 'images/sample.jpg', 3000.00), -- id 4  **past event**
(5, 'Summer Splash', '2024-07-10', '2024-07-10 09:00:00', 'Community Pool', 30, 12, 20.00, 600, 2, 'images/sample.jpg', 5000.00); -- id 5  **past event**


-- TFoodTrucks
INSERT INTO TFoodTrucks (intVendorID, intCuisineTypeID, strTruckName, monMinPrice, monMaxPrice, strLogoFilePath, strOperatingLicense)
VALUES 
(1, 2, 'Taco Truck Inc', 5.00, 15.00, 'images/sample.jpg', 'TACOS1234'), -- id 1
(2, 3, 'Burgers on Wheels', 6.00, 12.00, 'images/sample.jpg', 'BURGERS1234'), -- id 2
(3, 7, 'Charlies Vegan Snacks', 4.00, 12.00, 'images/sample.jpg', 'VEGAN1234'), -- id 3
(4, 1, 'Pizza Joes', 7.00, 20.00, 'images/sample.jpg', 'PIZZA1234'), -- id 4
(5, 6, 'Evas Sweet Treats', 3.00, 8.00, 'images/sample.jpg', 'SWEETS1234'); -- id 5


-- TEventCuisines
INSERT INTO TEventCuisines (intEventID, intCuisineTypeID, intLimit) VALUES
(1, 1, 2),  -- halloween fest allowing 2 italian trucks
(1, 2, 4),  -- halloween fest allowing 4 mexican trucks
(1, 7, 6),  -- halloween fest allowing 6 bakery/desert trucks
(2, 3, 2), -- street food fair allowing 2 american food trucks
(3, 6, 5), -- local farmers market allowing 5 bakery/dessert trucks
(3, 2, 5), -- local farmers market allowing 5 "other" trucks
(4, 1, 2),  -- winter wonderland allowing 2 italian trucks
(4, 6, 4); -- winter wonderland allowing 4 bakery/dessert trucks


-- TEventSpaces
INSERT INTO TEventSpaces (intEventID, strSpaceNum, strSize, boolIsAvailable) 
VALUES
(1, 'A1', '10x10', 1 ),
(1, 'A2', '10x10', 1),
(1, 'A3', '10x20', 1),
(2, 'A4', '10x20', 1),
(2, 'B1', '10x10', 1),
(3, 'B2', '10x10', 1),
(4, 'B3', '10x20', 2),
(5, 'B4', '10x20', 2);


-- TFoodTruckEvents
INSERT INTO TFoodTruckEvents (intEventID, intFoodTruckID, monTotalRevenue, intRating, strVendorComment)
VALUES
(1, 1, null, null, null),  
(1, 2, null, null, null), 
(2, 1, null, null, null),  
(2, 3, null, null, null),  
(3, 2, null, null, null),  
(3, 1, null, null, null),   
(3, 4, null, null, null),  
(4, 3, 300.00, 3, 'Decent event, but could use better marketing'),  
(4, 2, 500.00,  5, 'Fantastic turnout'), 
(4, 1, 300.00,  4, 'Great event, well organized'),  
(4, 4, 200.00, 4, 'Good location and crowd, would come again'),  
(5, 1, 1000.00,  5, 'Excellent event, we had a lot of customers'),  
(5, 2, 100.00, 2, 'Not enough foot traffic'),  
(5, 3, 500.00, 4, 'Had a blast'), 
(5, 4, 300.00, 3, 'It was alright, but we expected more attendees'),  
(5, 5, 1500.00, 5, 'Wonderful event, we sold out of food!');  


-- TReservations
INSERT INTO TReservations (intEventSpaceID, intFoodTruckID, dtReservationDate, intStatusID) 
VALUES
(1, 1, '2024-10-01 14:30:00', 1),  -- Taco Truck Inc for Event 1, Space A1
(2, 2, '2024-10-01 10:15:00', 1),  -- Burgers on Wheels for Event 1, Space A2
(3, 3, '2024-10-02 09:00:00', 1),     -- Charlie's Vegan Snacks for Event 1, Space A3
(4, 4, '2024-10-02 11:00:00', 1),    -- Pizza Joes for Event 2, Space A4
(5, 5, '2024-10-03 13:30:00', 1),    -- Eva's Sweet Treats for Event 2, Space B1
(6, 1, '2024-10-04 15:00:00', 1),    -- Taco Truck Inc for Event 3, Space B2
(7, 2, '2024-10-05 12:45:00',2),      -- Burgers on Wheels for Event 4, Space B3
(8, 3, '2024-10-05 16:00:00', 2);     -- Charlie's Vegan Snacks for Event 5, Space B4


-- TPayments
INSERT INTO TPayments (intReservationID, monAmountPaid, dtPaymentDate)
VALUES
(1, 150.00, '2024-10-02'), 
(2, 120.00, '2024-10-03'), 
(3, 130.00, '2024-10-03'), 
(4, 100.00, '2024-10-04'), 
(5, 110.00, '2024-10-05'), 
(6, 90.00,  '2024-10-06'), 
(7, 80.00,  '2024-10-06'), 
(8, 140.00, '2024-10-07'); 


-- TSponsors
INSERT INTO TSponsors (strSponsorName, strEmail, strPhone)
VALUES
('Big Eats Co.', 'bigeats@gmail.com', '987-654-3210'), 
('Foodies United', 'foodies@gmail.com', '987-654-3211'), 
('Gourmet Partners', 'gourmetpartners@gmail.com', '987-654-3212'),
('Tasty Delights', 'delights@gmail.com', '987-654-3213'), 
('Festival Friends', 'festivalfriends@gmail.com', '987-654-3214'); 


-- TEventSponsors
INSERT INTO TEventSponsors (intEventID, intSponsorID, monSponsorAmount)
VALUES
(1, 1, 1000.00), 
(2, 2, 1500.00), 
(3, 3, 2000.00), 
(4, 4, 1200.00),
(5, 5, 1800.00); 



-- --------------------------------------------------------------------------------
-- CRUD Stored Procedures
-- --------------------------------------------------------------------------------
GO

--LOGIN USER
-- if this returns a record, log user in
-- if it doesn't return a record their credentials weren't a match
CREATE PROCEDURE uspLoginUser
    @strEmail    VARCHAR(50),
    @strPassword VARCHAR(50),
    @UserID      INT OUTPUT 
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    
    BEGIN TRANSACTION;
    BEGIN TRY
       
        SELECT @UserID = intVendorID
        FROM TVendors
        WHERE strEmail = @strEmail AND strPassword = @strPassword;
        
      
        IF @UserID IS NOT NULL
        BEGIN
            UPDATE TVendors
            SET dtLastLogin = GETDATE()
            WHERE intVendorID = @UserID;
            
            COMMIT TRANSACTION;
            RETURN; 
        END

        
        SELECT @UserID = intOrganizerID
        FROM TOrganizers
        WHERE strEmail = @strEmail AND strPassword = @strPassword;
        
        
        IF @UserID IS NOT NULL
        BEGIN
            UPDATE TOrganizers
            SET dtLastLogin = GETDATE()
            WHERE intOrganizerID = @UserID;
            
            COMMIT TRANSACTION;
            RETURN;
        END
        
       
        ROLLBACK TRANSACTION;
        SET @UserID = NULL;

    END TRY
    BEGIN CATCH
      
        ROLLBACK TRANSACTION;
        
        SET @UserID = NULL;
    END CATCH
END
GO
-- testing login procedure
--DECLARE @UserID INT;
--EXEC uspLoginUser @strEmail = 'alice@gmail.com', @strPassword = 'password111', @UserID = @UserID OUTPUT;
--SELECT @UserID AS UserID;





-- CREATE ORGANIZER
-- returns organizer id
CREATE PROCEDURE uspCreateOrganizer
    @intOrganizerID AS INT OUTPUT,
    @strFirstName AS VARCHAR(50),
    @strLastName AS VARCHAR(50),
    @strPassword AS VARCHAR(50),
    @strEmail AS VARCHAR(50),
    @strPhone AS VARCHAR(15)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    INSERT INTO TOrganizers WITH (TABLOCKX) (
        strFirstName,
        strLastName,
        strPassword,
        strEmail,
        strPhone,
        dtDateCreated,
        dtLastLogin
    )
    VALUES (
        @strFirstName,
        @strLastName,
        @strPassword,
        @strEmail,
        @strPhone,
        GETDATE(),       
        GETDATE()
    );

 
    SET @intOrganizerID = SCOPE_IDENTITY();

    COMMIT TRANSACTION;
END
GO
-- testing uspCreateOrganizer
--SELECT * FROM TOrganizers 

--DECLARE @OrganizerID INT;


--EXEC uspCreateOrganizer
--    @intOrganizerID = @OrganizerID OUTPUT,
--    @strFirstName = 'John',
--    @strLastName = 'Doe',
--    @strPassword = 'johnspassword',
--    @strEmail = 'johndoe@gmail.com',
--    @strPhone = '123-456-7890';


--SELECT @OrganizerID AS NewOrganizerID;


--SELECT * FROM TOrganizers;




-- CREATE VENDOR
-- returns vendor id
CREATE PROCEDURE uspCreateVendor
    @intVendorID AS INT OUTPUT,
    @strFirstName AS VARCHAR(50),
    @strLastName AS VARCHAR(50),
    @strPassword AS VARCHAR(50),
    @strEmail AS VARCHAR(50),
    @strPhone AS VARCHAR(15)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    INSERT INTO TVendors WITH (TABLOCKX) (
        strFirstName,
        strLastName,
        strPassword,
        strEmail,
        strPhone,
        dtDateCreated,
        dtLastLogin
    )
    VALUES (
        @strFirstName,
        @strLastName,
        @strPassword,
        @strEmail,
        @strPhone,
        GETDATE(),       
        GETDATE()
    );


    SET @intVendorID = SCOPE_IDENTITY();

    COMMIT TRANSACTION;
END
GO



-- CREATE FOODTRUCK
-- will return primary key of new food truck
CREATE PROCEDURE uspCreateFoodTruck
    @intFoodTruckID AS INTEGER OUTPUT,       
    @intVendorID AS INTEGER,
    @intCuisineTypeID AS INTEGER,
    @strTruckName AS VARCHAR(50),
    @monMinPrice AS MONEY,
    @monMaxPrice AS MONEY,
    @strLogoFilePath AS VARCHAR(500) = NULL,  -- optional parameter so defaulting it to null unless provided
    @strOperatingLicense AS VARCHAR(50)
AS
SET NOCOUNT ON       
SET XACT_ABORT ON    

BEGIN TRANSACTION

    INSERT INTO TFoodTrucks WITH (TABLOCKX) (
        intVendorID,
        intCuisineTypeID,
        strTruckName,
        monMinPrice,
        monMaxPrice,
        strLogoFilePath,
        strOperatingLicense
    )
    VALUES (
        @intVendorID,
        @intCuisineTypeID,
        @strTruckName,
        @monMinPrice,
        @monMaxPrice,
        @strLogoFilePath,
        @strOperatingLicense
    );

    SET @intFoodTruckID = SCOPE_IDENTITY();

COMMIT TRANSACTION

GO
--testing create foodtruck
--select * from TFoodTrucks

--DECLARE @NewFoodTruckID INT;

--EXEC uspCreateFoodTruck
--    @intFoodTruckID = @NewFoodTruckID OUTPUT,
--    @intVendorID = 1,
--    @intCuisineTypeID = 2,
--    @strTruckName = 'Tasty Tacos',
--    @monMinPrice = 5.00,
--    @monMaxPrice = 15.00,
--    @strLogoFilePath = 'images/tastytacoslogo.gif',
--    @strOperatingLicense = 'TX123456';


--SELECT @NewFoodTruckID AS NewFoodTruckID;

--select * from TFoodTrucks




-- CREATE EVENT
-- also auto populates TEventSpaces with correct number of available spaces, and they're all set to "available" initially
CREATE PROCEDURE uspCreateEvent
    @intEventID AS INTEGER OUTPUT,       
    @intOrganizerID AS INTEGER,
    @strEventName AS VARCHAR(50),
    @dtDateOfEvent AS DATETIME,
    @dtSetUpTime AS DATETIME,
    @strLocation AS VARCHAR(50),
    @intTotalSpaces AS INTEGER,
    @intAvailableSpaces AS INTEGER,
    @monPricePerSpace AS MONEY,
    @intExpectedGuests AS INTEGER,
    @intStatusID AS INTEGER,
    @strLogoFilePath AS VARCHAR(500) = NULL,  -- optional, null if not provided
    @monTotalRevenue AS MONEY = NULL    -- will be updated at a later time after event      
AS
SET NOCOUNT ON        
SET XACT_ABORT ON     

BEGIN TRANSACTION

  
    INSERT INTO TEvents WITH (TABLOCKX) (
        intOrganizerID,
        strEventName,
        dtDateOfEvent,
        dtSetUpTime,
        strLocation,
        intTotalSpaces,
        intAvailableSpaces,
        monPricePerSpace,
        intExpectedGuests,
        intStatusID,
        strLogoFilePath,
        monTotalRevenue
    )
    VALUES (
        @intOrganizerID,
        @strEventName,
        @dtDateOfEvent,
        @dtSetUpTime,
        @strLocation,
        @intTotalSpaces,
        @intAvailableSpaces,
        @monPricePerSpace,
        @intExpectedGuests,
        @intStatusID,
        @strLogoFilePath,
        @monTotalRevenue
    );

   
    SET @intEventID = SCOPE_IDENTITY();

    
	-- loop and add spaces for event. they will be "A, B, C" etc
    DECLARE @index INT = 1;
    DECLARE @strSpaceNum CHAR(1);

    WHILE @index <= @intAvailableSpaces
    BEGIN
        
        SET @strSpaceNum = CHAR(64 + @index); 

        INSERT INTO TEventSpaces (intEventID, strSpaceNum, strSize, boolIsAvailable)
        VALUES (@intEventID, @strSpaceNum, '10x10', 1); 

        SET @index = @index + 1;
    END

COMMIT TRANSACTION

GO
-- testing create event
--select * from TEvents

--DECLARE @NewEventID INT;

--EXEC uspCreateEvent
--    @intEventID = @NewEventID OUTPUT,
--    @intOrganizerID = 5,
--    @strEventName = 'New Event',
--    @dtDateOfEvent = '2024-12-15',
--    @dtSetUpTime = '2024-12-15 09:00:00',
--    @strLocation = 'Central Park',
--    @intTotalSpaces = 10,
--    @intAvailableSpaces = 10,
--    @monPricePerSpace = 100.00,
--    @intExpectedGuests = 2000,
--    @intStatusID = 1,
--    @strLogoFilePath = 'images/eventlogo.gif',
--    @monTotalRevenue = null;


--SELECT @NewEventID AS NewEventID;

--select * from TEvents
--select * from TEventSpaces where intEventID = @NewEventID;



-- UPDATE VENDOR
CREATE PROCEDURE uspUpdateVendor
    @intVendorID INT,
    @strFirstName VARCHAR(50) = NULL,
    @strLastName VARCHAR(50) = NULL,
    @strPassword VARCHAR(50) = NULL,
    @strEmail VARCHAR(50) = NULL,
    @strPhone VARCHAR(15) = NULL
AS
BEGIN
    SET NOCOUNT ON;  
    SET XACT_ABORT ON;  

    BEGIN TRANSACTION; 

    BEGIN TRY
        
        UPDATE TVendors
        SET 
            strFirstName = COALESCE(@strFirstName, strFirstName),
            strLastName = COALESCE(@strLastName, strLastName),
            strPassword = COALESCE(@strPassword, strPassword),
            strEmail = COALESCE(@strEmail, strEmail),
            strPhone = COALESCE(@strPhone, strPhone)
        WHERE intVendorID = @intVendorID;

        COMMIT TRANSACTION;  
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;  
    END CATCH
END
GO
-- testing uspUpdateVendor
-- SELECT * FROM TVendors WHERE intVendorID = 1; 

--DECLARE @intVendorID INT = 1; 

--EXEC uspUpdateVendor 
--    @intVendorID = @intVendorID, 
--    @strFirstName = NULL,          
--    @strLastName = 'Johnson',       
--    @strPassword = NULL,           
--    @strEmail = NULL,               
--    @strPhone = NULL;                     

-- SELECT * FROM TVendors WHERE intVendorID = 1; 



-- UPDATE ORGANIZER
CREATE PROCEDURE uspUpdateOrganizer
    @intOrganizerID INT,
    @strFirstName VARCHAR(50) = NULL,
    @strLastName VARCHAR(50) = NULL,
    @strPassword VARCHAR(50) = NULL,
    @strEmail VARCHAR(50) = NULL,
    @strPhone VARCHAR(15) = NULL
AS
BEGIN
    SET NOCOUNT ON;  
    SET XACT_ABORT ON;  

    BEGIN TRANSACTION; 

    BEGIN TRY
        
        UPDATE TOrganizers
        SET 
            strFirstName = COALESCE(@strFirstName, strFirstName),
            strLastName = COALESCE(@strLastName, strLastName),
            strPassword = COALESCE(@strPassword, strPassword),
            strEmail = COALESCE(@strEmail, strEmail),
            strPhone = COALESCE(@strPhone, strPhone)
        WHERE intOrganizerID = @intOrganizerID;

        COMMIT TRANSACTION;  
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;  
    END CATCH
END
GO
-- testing uspUpdateOrganizer
-- SELECT * FROM TOrganizers WHERE intOrganizerID = 1; 

--DECLARE @intOrganizerID INT = 1; 

--EXEC uspUpdateOrganizer 
--    @intOrganizerID = @intOrganizerID, 
--    @strFirstName = NULL,          
--    @strLastName = 'Williams',       
--    @strPassword = NULL,           
--    @strEmail = NULL,               
--    @strPhone = NULL;                     

-- SELECT * FROM TOrganizers WHERE intOrganizerID = 1; 


GO

-- UPDATE EVENT
CREATE PROCEDURE uspUpdateEvent
    @intEventID INT,
    @intOrganizerID INT = NULL,
    @strEventName VARCHAR(50) = NULL,
    @dtDateOfEvent DATETIME = NULL,
    @dtSetUpTime DATETIME = NULL,
    @strLocation VARCHAR(50) = NULL,
    @intTotalSpaces INT = NULL,
    @intAvailableSpaces INT = NULL,
    @monPricePerSpace MONEY = NULL,
    @intExpectedGuests INT = NULL,
    @intStatusID INT = NULL,
    @strLogoFilePath VARCHAR(500) = NULL,
    @monTotalRevenue MONEY = NULL
AS
BEGIN
    SET NOCOUNT ON;  
    SET XACT_ABORT ON;  

    BEGIN TRANSACTION; 

    BEGIN TRY
        UPDATE TEvents
        SET 
            intOrganizerID = COALESCE(@intOrganizerID, intOrganizerID),
            strEventName = COALESCE(@strEventName, strEventName),
            dtDateOfEvent = COALESCE(@dtDateOfEvent, dtDateOfEvent),
            dtSetUpTime = COALESCE(@dtSetUpTime, dtSetUpTime),
            strLocation = COALESCE(@strLocation, strLocation),
            intTotalSpaces = COALESCE(@intTotalSpaces, intTotalSpaces),
            intAvailableSpaces = COALESCE(@intAvailableSpaces, intAvailableSpaces),
            monPricePerSpace = COALESCE(@monPricePerSpace, monPricePerSpace),
            intExpectedGuests = COALESCE(@intExpectedGuests, intExpectedGuests),
            intStatusID = COALESCE(@intStatusID, intStatusID),
            strLogoFilePath = COALESCE(@strLogoFilePath, strLogoFilePath),
            monTotalRevenue = COALESCE(@monTotalRevenue, monTotalRevenue)
        WHERE intEventID = @intEventID;

        COMMIT TRANSACTION;  
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;  
        THROW;
    END CATCH
END
GO
-- testing update event
--select * from TEvents where intEventID = 1;

--EXEC uspUpdateEvent 
--    @intEventID = 1,                   
--    @intOrganizerID = 1,                     
--    @strEventName = 'Halloween Fest'
 

--	select * from TEvents where intEventID = 1;



GO

-- UPDATE FOODTRUCK
CREATE PROCEDURE uspUpdateFoodTruck
    @intFoodTruckID INT,
    @intVendorID INT = NULL,
    @intCuisineTypeID INT = NULL,
    @strTruckName VARCHAR(50) = NULL,
    @monMinPrice MONEY = NULL,
    @monMaxPrice MONEY = NULL,
    @strLogoFilePath VARCHAR(500) = NULL,
    @strOperatingLicense VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;  
    SET XACT_ABORT ON;  

    BEGIN TRANSACTION; 

    BEGIN TRY
        UPDATE TFoodTrucks
        SET 
            intVendorID = COALESCE(@intVendorID, intVendorID),
            intCuisineTypeID = COALESCE(@intCuisineTypeID, intCuisineTypeID),
            strTruckName = COALESCE(@strTruckName, strTruckName),
            monMinPrice = COALESCE(@monMinPrice, monMinPrice),
            monMaxPrice = COALESCE(@monMaxPrice, monMaxPrice),
            strLogoFilePath = COALESCE(@strLogoFilePath, strLogoFilePath),
            strOperatingLicense = COALESCE(@strOperatingLicense, strOperatingLicense)
        WHERE intFoodTruckID = @intFoodTruckID;

        COMMIT TRANSACTION;  
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;  
        THROW;
    END CATCH
END
GO

-- testing update food truck

--select * from TFoodTrucks where intFoodTruckID = 1;

--EXEC uspUpdateFoodTruck 
--    @intFoodTruckID = 1,                   
--    @intVendorID = 1,                     
--    @strOperatingLicense = 'dfgdgd57'
 

--select * from TFoodTrucks where intFoodTruckID = 1;


GO

-- GET VENDOR
CREATE PROCEDURE uspGetVendor
    @intVendorID INT
AS
BEGIN
    SET NOCOUNT ON;  

    SELECT 
        strFirstName,
        strLastName,
        strPassword,
        strEmail,
        strPhone,
        dtDateCreated,
        dtLastLogin
    FROM TVendors
    WHERE intVendorID = @intVendorID;
END
GO
-- testing uspGetVendor
--EXEC uspGetVendor @intVendorID = 1; 

GO



-- GET ORGANIZER
CREATE PROCEDURE uspGetOrganizer
    @intOrganizerID INT
AS
BEGIN
    SET NOCOUNT ON;  

    SELECT 
        strFirstName,
        strLastName,
        strPassword,
        strEmail,
        strPhone,
        dtDateCreated,
        dtLastLogin
    FROM TOrganizers
    WHERE intOrganizerID = @intOrganizerID;
END
GO
-- testing uspGetOrganizer
--EXEC uspGetOrganizer @intOrganizerID = 1; 





GO
-- GET FOODTRUCK 
CREATE PROCEDURE uspGetFoodTruck
    @intFoodTruckID INT
AS
BEGIN
    SET NOCOUNT ON;  

    SELECT 
        intVendorID,
        intCuisineTypeID,
        strTruckName,
        monMinPrice,
        monMaxPrice,
        strLogoFilePath,
        strOperatingLicense
    FROM TFoodTrucks
    WHERE intFoodTruckID = @intFoodTruckID;
END

GO
-- testing get foodtruck
--EXEC uspGetFoodTruck @intFoodTruckID = 1;



-- GET EVENT
CREATE PROCEDURE uspGetEvent
    @intEventID INT
AS
BEGIN
    SET NOCOUNT ON;  

    SELECT 
        intOrganizerID,
        strEventName,
        dtDateOfEvent,
        dtSetUpTime,
        strLocation,
        intTotalSpaces,
        intAvailableSpaces,
        monPricePerSpace,
        intExpectedGuests,
        intStatusID,
        strLogoFilePath,
        monTotalRevenue
    FROM TEvents
    WHERE intEventID = @intEventID;
END

GO
-- testing get event
--EXEC uspGetEvent @intEventID = 1;



-- DELETE VENDOR
CREATE PROCEDURE uspDeleteVendor
    @intVendorID INT
AS
BEGIN
    SET NOCOUNT ON;  
    SET XACT_ABORT ON;  

    BEGIN TRANSACTION;

    DELETE FROM TVendors
    WHERE intVendorID = @intVendorID;

    COMMIT TRANSACTION;  
END
GO
-- testing uspDeleteVendor
--select * from TVendors;
--EXEC uspDeleteVendor @intVendorID = 2;
--select * from TVendors;



-- DELETE ORGANIZER
CREATE PROCEDURE uspDeleteOrganizer
    @intOrganizerID INT
AS
BEGIN
    SET NOCOUNT ON;  
    SET XACT_ABORT ON;  

    BEGIN TRANSACTION;

    DELETE FROM TOrganizers
    WHERE intOrganizerID = @intOrganizerID;

    COMMIT TRANSACTION;  
END
GO
-- testing uspDeleteOrganizer
--select* from TOrganizers;
--EXEC uspDeleteOrganizer @intOrganizerID = 1;
--select* from TOrganizers;