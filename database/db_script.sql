-- --------------------------------------------------------------------------------
-- Capstone Project Fall '24
-- TruckSpot (FoodTruck & Event App)
-- Team C 
-- Megan Noel, Seth Lubic, Testimony Awuzie & Apiwat Anachai
--
-- Last update: Added uspCreateUser, uspCreateFoodTruck, uspCreateEvent. Modified 
-- uspLoginUser to update last login to current session
--
-- --------------------------------------------------------------------------------
-- --------------------------------------------------------------------------------
-- Options
-- --------------------------------------------------------------------------------
USE dbTruckSpot; -- ** make sure your local database is also called dbTruckSpot **
				 -- 1. Right click on databases in object explorer, new database, 
				 -- name it dbTruckSpot, click ok 
				 -- 2. Before running make sure to the left of the "Execute" button
				 -- you have the correct database selected when you run the script
				 -- 3. Sometimes the server will give errors when running it all 
				 -- together such as "xyz table already exists", if this happens
				 -- try running it in chunks. For example run all drop statements,
				 -- then run create tables and so on. Usually solves the issue

SET NOCOUNT ON; 

 

-- --------------------------------------------------------------------------------
-- Drop statements (Tables, Procedures)
-- --------------------------------------------------------------------------------
 
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
IF OBJECT_ID('TUsers')				IS NOT NULL DROP TABLE TUsers;               
IF OBJECT_ID('TUserTypes')			IS NOT NULL DROP TABLE TUserTypes;  
IF OBJECT_ID('TStatuses')			IS NOT NULL DROP TABLE TStatuses; 


IF OBJECT_ID( 'uspLoginUser' )	    IS NOT NULL DROP PROCEDURE  uspLoginUser

IF OBJECT_ID( 'uspCreateUser' )	    IS NOT NULL DROP PROCEDURE  uspCreateUser
IF OBJECT_ID( 'uspCreateFoodTruck')	IS NOT NULL DROP PROCEDURE  uspCreateFoodTruck
IF OBJECT_ID( 'uspCreateEvent')	    IS NOT NULL DROP PROCEDURE  uspCreateEvent

IF OBJECT_ID( 'uspUpdateUser')	    IS NOT NULL DROP PROCEDURE  uspUpdateUser
IF OBJECT_ID( 'uspUpdateEvent')	    IS NOT NULL DROP PROCEDURE  uspUpdateEvent
IF OBJECT_ID( 'uspUpdateFoodTruck')	IS NOT NULL DROP PROCEDURE  uspUpdateFoodTruck


-- --------------------------------------------------------------------------------
-- Tables
-- --------------------------------------------------------------------------------
CREATE TABLE TUserTypes
(
	 intUserTypeID			INTEGER	IDENTITY		NOT NULL
	,strUserType			VARCHAR(50)				NOT NULL
	,CONSTRAINT TUserTypes_PK PRIMARY KEY ( intUserTypeID )
);

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


CREATE TABLE TUsers
(
	 intUserID				INTEGER	IDENTITY		NOT NULL
	,intUserTypeID			INTEGER					NOT NULL
	,strFirstName			VARCHAR(50)				NOT NULL
	,strLastName			VARCHAR(50)				NOT NULL
	,strPassword			VARCHAR(50)				NOT NULL
	,strEmail				VARCHAR(50)				NOT NULL UNIQUE
	,strPhone				VARCHAR(50)				NOT NULL
	,dtDateCreated			DATETIME				NOT NULL
	,dtLastLogin			DATETIME				NOT NULL
	,CONSTRAINT TUsers_PK PRIMARY KEY ( intUserID )
	,FOREIGN KEY ( intUserTypeID ) REFERENCES TUserTypes ( intUserTypeID )
);

CREATE TABLE TEvents
(
	 intEventID				INTEGER	IDENTITY		NOT NULL
	,intUserID				INTEGER					NOT NULL
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
	,FOREIGN KEY ( intUserID ) REFERENCES TUsers ( intUserID ) 
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
    ,FOREIGN KEY (intEventID) REFERENCES TEvents (intEventID) 
    ,FOREIGN KEY (intCuisineTypeID) REFERENCES TCuisineTypes (intCuisineTypeID)
   ,CONSTRAINT chk_LimitPerCuisine CHECK (intLimit > 0)
);

CREATE TABLE TFoodTrucks
(
	 intFoodTruckID			INTEGER	IDENTITY		NOT NULL
	,intUserID				INTEGER					NOT NULL
	,intCuisineTypeID		INTEGER					NOT NULL
	,strTruckName			VARCHAR(50)				NOT NULL
	,monMinPrice			MONEY					NOT NULL -- min and max price are for finding price range 															 
	,monMaxPrice			MONEY					NOT NULL 
	,strLogoFilePath		VARCHAR(500)				    -- will be a relative file path in our project. ex: "images/logo.gif"
	,strOperatingLicense	VARCHAR(50)				NOT NULL
	,CONSTRAINT TFoodTrucks_PK PRIMARY KEY ( intFoodTruckID )
	,FOREIGN KEY ( intUserID ) REFERENCES TUsers ( intUserID )
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
	,FOREIGN KEY ( intEventID ) REFERENCES TEvents ( intEventID ) 
);

CREATE TABLE TReservations
(
	 intReservationID		INTEGER	IDENTITY		NOT NULL
	,intEventSpaceID		INTEGER					NOT NULL
	,intFoodTruckID			INTEGER					NOT NULL
	,dtReservationDate		DATETIME				NOT NULL -- the date they made the reservation, not the date of the event that it's for lol
	,intStatusID			INTEGER				NOT NULL
	,CONSTRAINT TReservations_PK PRIMARY KEY ( intReservationID )
	,FOREIGN KEY ( intEventSpaceID ) REFERENCES TEventSpaces ( intEventSpaceID )
	,FOREIGN KEY ( intFoodTruckID ) REFERENCES TFoodTrucks ( intFoodTruckID ) 
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
	,FOREIGN KEY ( intEventID ) REFERENCES TEvents ( intEventID ) 
	,FOREIGN KEY ( intFoodTruckID ) REFERENCES TFoodTrucks ( intFoodTruckID )
	,CONSTRAINT chk_TotalRevenue CHECK (monTotalRevenue >= 0) 
);

CREATE TABLE TEventSponsors
(
	 intEventSponsorID		INTEGER	IDENTITY		NOT NULL
	,intEventID				INTEGER					NOT NULL
	,intSponsorID			INTEGER					NOT NULL
	,monSponsorAmount		MONEY					NOT NULL
	,CONSTRAINT TEventSponsors_PK PRIMARY KEY ( intEventSponsorID )
	,FOREIGN KEY ( intEventID ) REFERENCES TEvents ( intEventID ) 
	,FOREIGN KEY ( intSponsorID ) REFERENCES TSponsors ( intSponsorID ) 
	,CONSTRAINT chk_SponsorAmount CHECK (monSponsorAmount >= 0) 
);

CREATE TABLE TPayments
(
	 intPaymentID			INTEGER	IDENTITY		NOT NULL
	,intReservationID		INTEGER					NOT NULL
	,monAmountPaid			MONEY					NOT NULL
	,dtPaymentDate			DATETIME				NOT NULL
	,CONSTRAINT TPayments_PK PRIMARY KEY ( intPaymentID )
	,FOREIGN KEY ( intReservationID ) REFERENCES TReservations ( intReservationID ) 
	,CONSTRAINT chk_AmountPaid CHECK (monAmountPaid >= 0) 
);

-- --------------------------------------------------------------------------------
-- Populate
-- --------------------------------------------------------------------------------

-- TUserTypes
INSERT INTO TUserTypes (strUserType)
VALUES 
('Vendor'), -- id 1
('Organizer'); -- id 2


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


-- TUsers
INSERT INTO TUsers (intUserTypeID, strFirstName, strLastName, strPassword, strEmail, strPhone, dtDateCreated, dtLastLogin) 
VALUES 
--vendors
(1, 'Alice', 'Smith',  'password111', 'alice@gmail.com', '123-456-7890', GETDATE(), GETDATE()), -- id 1
(1, 'Evan', 'Johnson', 'password222', 'evan@gmail.com', '123-456-7891', GETDATE(), GETDATE()), -- id 2
(1, 'Charlie', 'Williams',  'password333', 'charlie@gmail.com', '123-456-7892', GETDATE(), GETDATE()), -- id 3
(1, 'Jimmy', 'Brown',  'password444', 'jimmy@gmail.com', '123-456-7893', GETDATE(), GETDATE()), -- id 4
(1, 'Eva', 'Jones', 'password555', 'eva@gmail.com', '123-456-7894', GETDATE(), GETDATE()), -- id 5
--organizers 
(2, 'Lola', 'Garcia', 'password666', 'lola@gmail.com', '123-456-7895', GETDATE(), GETDATE()), -- id 6
(2, 'Grace', 'Martinez',  'password777', 'grace@gmail.com', '123-456-7896', GETDATE(), GETDATE()), -- id 7
(2, 'Steph', 'Davis',  'password888', 'steph@gmail.com', '123-456-7897', GETDATE(), GETDATE()), -- id 8
(2, 'Isabella', 'Rodriguez',  'password999', 'isabella@gmail.com', '123-456-7898', GETDATE(), GETDATE()), -- id 9
(2, 'Jack', 'Odell', 'password000', 'jack@gmail.com', '123-456-7899', GETDATE(), GETDATE()); -- id 10


-- TEvents
INSERT INTO TEvents (intUserID, strEventName, dtDateOfEvent, dtSetUpTime, strLocation, intTotalSpaces, intAvailableSpaces, monPricePerSpace, intExpectedGuests, intStatusID, strLogoFilePath, monTotalRevenue)
VALUES 
(6, 'Halloween Festival', '2024-11-01', '2024-11-01 09:00:00', 'City Park', 10, 5, 10.00, 500, 1, 'images/sample.jpg', null), -- id 1
(7, 'Street Food Fair', '2024-11-15', '2024-11-15 09:00:00', 'Downtown', 15, 15, 15.00, 450, 1, 'images/sample.jpg', null), -- id 2
(8, 'Local Farmers Market', '2024-11-22', '2024-11-22 08:00:00', 'Main Square', 20, 18, 20.00, 100, 1, 'images/sample.jpg', null), -- id 3
(9, 'Winter Wonderland', '2023-12-05', '2023-12-05 09:00:00', 'Ice Rink', 20, 8, 13.00, 80, 2, 'images/sample.jpg', 3000.00), -- id 4  **past event**
(10, 'Summer Splash', '2024-07-10', '2024-07-10 09:00:00', 'Community Pool', 30, 12, 20.00, 600, 2, 'images/sample.jpg', 5000.00); -- id 5  **past event**


-- TFoodTrucks
INSERT INTO TFoodTrucks (intUserID, intCuisineTypeID, strTruckName, monMinPrice, monMaxPrice, strLogoFilePath, strOperatingLicense)
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
(2, 3, null , null, null),  
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
	@strEmail			AS VARCHAR( 50 )
   ,@strPassword		AS VARCHAR( 50 )
AS
SET NOCOUNT ON		
SET XACT_ABORT ON

BEGIN TRANSACTION

	Select intUserID from TUsers
	Where strEmail = @strEmail and strPassword = @strPassword


	-- update this as their most recent login
    IF @@ROWCOUNT > 0
    BEGIN
        UPDATE TUsers
        SET dtLastLogin = GETDATE()
        WHERE strEmail = @strEmail AND strPassword = @strPassword;
    END

COMMIT TRANSACTION

GO
-- testing login procedure
-- Execute uspLoginUser 'alice@gmail.com', 'password111';






-- CREATE USER
-- this will return the primary key of the new user
CREATE PROCEDURE uspCreateUser
    @intUserID AS INTEGER OUTPUT,        
    @intUserTypeID AS INTEGER,
    @strFirstName AS VARCHAR(50),
    @strLastName AS VARCHAR(50),
    @strPassword AS VARCHAR(50),
    @strEmail AS VARCHAR(50),
    @strPhone AS VARCHAR(50)
AS
SET NOCOUNT ON        
SET XACT_ABORT ON     

BEGIN TRANSACTION

    
    INSERT INTO TUsers WITH (TABLOCKX) (
        intUserTypeID,
        strFirstName,
        strLastName,
        strPassword,
        strEmail,
        strPhone,
        dtDateCreated,
        dtLastLogin
    )
    VALUES (
        @intUserTypeID,
        @strFirstName,
        @strLastName,
        @strPassword,
        @strEmail,
        @strPhone,
        GETDATE(),       
        GETDATE()        
    );

    
    SET @intUserID = SCOPE_IDENTITY();

COMMIT TRANSACTION

GO
-- testing create user
--select * From TUsers

--DECLARE @UserID INT;

--EXEC uspCreateUser
--    @intUserID = @UserID OUTPUT,
--    @intUserTypeID = 1,
--    @strFirstName = 'John',
--    @strLastName = 'Doe',
--    @strPassword = 'johnspassword',
--    @strEmail = 'johndoe@gmail.com',
--    @strPhone = '123-456-7890';

--SELECT @UserID AS NewUserID;


--select * From TUsers





-- CREATE FOODTRUCK
-- will return primary key of new food truck
CREATE PROCEDURE uspCreateFoodTruck
    @intFoodTruckID AS INTEGER OUTPUT,       
    @intUserID AS INTEGER,
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
        intUserID,
        intCuisineTypeID,
        strTruckName,
        monMinPrice,
        monMaxPrice,
        strLogoFilePath,
        strOperatingLicense
    )
    VALUES (
        @intUserID,
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
--    @intUserID = 1,
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
    @intUserID AS INTEGER,
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
        intUserID,
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
        @intUserID,
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
--    @intUserID = 5,
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




-- UPDATE USER 
CREATE PROCEDURE uspUpdateUser
    @intUserID INT,
    @intUserTypeID INT = NULL,
    @strFirstName VARCHAR(50) = NULL,
    @strLastName VARCHAR(50) = NULL,
    @strPassword VARCHAR(50) = NULL,
    @strEmail VARCHAR(50) = NULL,
    @strPhone VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;  
    SET XACT_ABORT ON;  

    BEGIN TRANSACTION; 

    BEGIN TRY
        
        UPDATE TUsers
        SET 
            intUserTypeID = COALESCE(@intUserTypeID, intUserTypeID),
            strFirstName = COALESCE(@strFirstName, strFirstName),
            strLastName = COALESCE(@strLastName, strLastName),
            strPassword = COALESCE(@strPassword, strPassword),
            strEmail = COALESCE(@strEmail, strEmail),
            strPhone = COALESCE(@strPhone, strPhone)
        WHERE intUserID = @intUserID;

        COMMIT TRANSACTION;  
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;  
    END CATCH
END

GO
-- testing update user
--select * from TUsers where intUserID = 1;

--DECLARE @intUserID INT = 1; 

--EXEC uspUpdateUser 
--    @intUserID = @intUserID, 
--    @intUserTypeID = NULL,         
--    @strFirstName = NULL,          
--    @strLastName = 'Johnson',       
--    @strPassword = NULL,           
--    @strEmail = NULL,               
--    @strPhone = NULL                     


--select * from TUsers where intUserID = 1;





-- UPDATE EVENT
CREATE PROCEDURE uspUpdateEvent
    @intEventID INT,
    @intUserID INT = NULL,
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
            intUserID = COALESCE(@intUserID, intUserID),
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
--    @intUserID = 6,                     
--    @strEventName = 'Halloween Fest'
 

--	select * from TEvents where intEventID = 1;



GO

-- UPDATE FOODTRUCK
CREATE PROCEDURE uspUpdateFoodTruck
    @intFoodTruckID INT,
    @intUserID INT = NULL,
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
            intUserID = COALESCE(@intUserID, intUserID),
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
--    @intUserID = 3,                     
--    @strOperatingLicense = 'dfgdgd57'
 

--select * from TFoodTrucks where intFoodTruckID = 1;




