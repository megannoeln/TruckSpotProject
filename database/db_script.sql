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
IF OBJECT_ID( 'uspDeleteFoodTruck')			IS NOT NULL DROP PROCEDURE  uspDeleteOrganizer
IF OBJECT_ID( 'uspDeleteEvent')			IS NOT NULL DROP PROCEDURE  uspDeleteOrganizer


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
	,strDescription			VARCHAR(255)				
	,dtDateOfEvent			DATETIME				NOT NULL
	,dtSetUpTime			DATETIME				NOT NULL
	,strLocation			VARCHAR(50)				NOT NULL
	,intTotalSpaces			INTEGER					NOT NULL
	,intAvailableSpaces		INTEGER						NULL
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
-- allow some nulls
ALTER TABLE TEvents
ALTER COLUMN monPricePerSpace MONEY NULL;

ALTER TABLE TEvents
ALTER COLUMN intExpectedGuests INTEGER NULL;

CREATE TABLE TEventCuisines
(
    intEventCuisineID		INTEGER IDENTITY		NOT NULL
    ,intEventID				INTEGER					NOT NULL
   ,intCuisineTypeID        INTEGER					NOT NULL
   ,intLimit				INTEGER					NOT NULL
   ,intAvailable			INTEGER				    NOT NULL
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
	,monMinPrice			MONEY							 -- min and max price are for finding price range 															 
	,monMaxPrice			MONEY					 
	,strLogoFilePath		VARCHAR(500)				     -- will be a relative file path in our project. ex: "images/logo.gif"
	,strOperatingLicense	VARCHAR(50)				
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
    ,intFoodTruckID	INTEGER					NOT NULL         
    ,strItem				VARCHAR(255)			NOT NULL         
    ,monPrice				MONEY					NOT NULL  
	,intUnitsSold			MONEY					NULL
    ,CONSTRAINT TMenus_PK PRIMARY KEY ( intMenuID )
    ,FOREIGN KEY ( intFoodTruckID ) REFERENCES TFoodTrucks ( intFoodTruckID ) ON DELETE CASCADE
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
('Alice', 'Smith',  'Password111!', 'alice@gmail.com', '123-456-7890', GETDATE(), GETDATE()), -- id 1
('Evan', 'Johnson', 'Password222!', 'evan@gmail.com', '123-456-7891', GETDATE(), GETDATE()), -- id 2
('Charlie', 'Williams',  'Password333!', 'charlie@gmail.com', '123-456-7892', GETDATE(), GETDATE()), -- id 3
('Jimmy', 'Brown',  'Password444!', 'jimmy@gmail.com', '123-456-7893', GETDATE(), GETDATE()), -- id 4
('Eva', 'Jones', 'Password555!', 'eva@gmail.com', '123-456-7894', GETDATE(), GETDATE()); -- id 5


-- TOrganizers
INSERT INTO TOrganizers (strFirstName, strLastName, strPassword, strEmail, strPhone, dtDateCreated, dtLastLogin) 
VALUES 
('Lola', 'Garcia', 'Password666!', 'lola@gmail.com', '123-456-7895', GETDATE(), GETDATE()), -- id 1
('Grace', 'Martinez',  'Password777!', 'grace@gmail.com', '123-456-7896', GETDATE(), GETDATE()), -- id 2
('Steph', 'Davis',  'Password888!', 'steph@gmail.com', '123-456-7897', GETDATE(), GETDATE()), -- id 3
('Isabella', 'Rodriguez',  'Password999!', 'isabella@gmail.com', '123-456-7898', GETDATE(), GETDATE()), -- id 4
('Jack', 'Odell', 'Password000!', 'jack@gmail.com', '123-456-7899', GETDATE(), GETDATE()); -- id 5


-- TEvents
INSERT INTO TEvents (intOrganizerID, strEventName, strDescription, dtDateOfEvent, dtSetUpTime, strLocation, intTotalSpaces, intAvailableSpaces, monPricePerSpace, intExpectedGuests, intStatusID, strLogoFilePath, monTotalRevenue)
VALUES 
(1, 'Halloween Festival', 'Lively fest celebrating halloween', '2024-11-01', '2024-11-01 09:00:00', 'City Park', 10, 5, 10.00, 500, 1, 'images/sample.jpg', null), -- id 1
(2, 'Street Food Fair', 'A chance to try some great local food', '2024-11-15', '2024-11-15 09:00:00', 'Downtown', 15, 15, 15.00, 450, 1, 'images/sample.jpg', null), -- id 2
(3, 'Local Farmers Market', 'Showcasing many local food vendors and their homemade food','2024-11-22', '2024-11-22 08:00:00', 'Main Square', 20, 18, 20.00, 100, 1, 'images/sample.jpg', null), -- id 3
(4, 'Winter Wonderland', 'Get ready for the holidays in a winter wonderland','2023-12-05', '2023-12-05 09:00:00', 'Ice Rink', 20, 8, 13.00, 80, 2, 'images/sample.jpg', 3000.00), -- id 4  **past event**
(5, 'Summer Splash', 'Come cool off and enjoy some local food vendors at Summer Splash','2024-07-10', '2024-07-10 09:00:00', 'Community Pool', 30, 12, 20.00, 600, 2, 'images/sample.jpg', 5000.00), -- id 5  **past event**
(1, 'New Years Eve Celebration', 'Ring in the new year with music, food, and a spectacular fireworks show', '2024-12-31', '2024-12-31 18:00:00', 'City Plaza', 25, 25, 25.00, 1000, 1, 'images/sample.jpg', null);

-- Past events for organizer 1
INSERT INTO TEvents (intOrganizerID, strEventName, strDescription, dtDateOfEvent, dtSetUpTime, strLocation, intTotalSpaces, intAvailableSpaces, monPricePerSpace, intExpectedGuests, intStatusID, strLogoFilePath, monTotalRevenue)
VALUES 
(1, 'Spring Carnival', 'Fun carnival games and food stalls', '2024-04-15', '2024-04-15 10:00:00', 'Central Park', 50, 0, 12.00, 400, 2, 'images/sample.jpg', 4820.00), 
(1, 'Art and Craft Fair', 'Display of local crafts and art', '2024-05-10', '2024-05-10 08:00:00', 'Art District', 40, 0, 18.00, 300, 2, 'images/sample.jpg', 5400.00), 
(1, 'Community Potluck', 'Bringing the community together for shared meals', '2024-03-20', '2024-03-20 12:00:00', 'Community Hall', 30, 0, 10.00, 250, 2, 'images/sample.jpg', 2500.00), 
(1, 'Tech Expo', 'Showcase of innovative tech by local startups', '2024-02-25', '2024-02-25 09:00:00', 'Tech Hub', 100, 0, 15.00, 700, 2, 'images/sample.jpg', 15000.00), 
(1, 'Historical Reenactment', 'Interactive event recreating historic moments', '2024-03-05', '2024-03-05 11:00:00', 'Museum Grounds', 20, 0, 22.00, 200, 2, 'images/sample.jpg', 4400.00), 
(1, 'Jazz Night', 'Evening of live jazz music', '2024-06-01', '2024-06-01 19:00:00', 'Downtown Theatre', 60, 0, 30.00, 350, 2, 'images/sample.jpg', 10520.00), 
(1, 'Charity Gala', 'Fundraiser with food and live entertainment', '2024-04-02', '2024-04-02 17:00:00', 'City Ballroom', 80, 0, 50.00, 500, 2, 'images/sample.jpg', 20000.00), 
(1, 'Outdoor Film Screening', 'Watch a popular movie under the stars', '2024-05-22', '2024-05-22 20:00:00', 'Greenfield', 100, 0, 8.00, 600, 2, 'images/sample.jpg', 4800.00), 
(1, 'Marathon Expo', 'Gathering for marathon participants and supporters', '2024-03-30', '2024-03-30 06:00:00', 'Marathon Grounds', 150, 0, 5.00, 1200, 2, 'images/sample.jpg', 6000.00), 
(1, 'Book Fair', 'Large fair with local and international authors', '2024-02-15', '2024-02-15 10:00:00', 'Convention Center', 70, 0, 15.00, 500, 2, 'images/sample.jpg', 10500.00);

-- Upcoming events for organizer 1
INSERT INTO TEvents (intOrganizerID, strEventName, strDescription, dtDateOfEvent, dtSetUpTime, strLocation, intTotalSpaces, intAvailableSpaces, monPricePerSpace, intExpectedGuests, intStatusID, strLogoFilePath, monTotalRevenue)
VALUES 
(1, 'Winter Charity Concert', 'Concert to raise funds for local charities', '2024-12-20', '2024-12-20 18:00:00', 'Music Hall', 80, 60, 35.00, 500, 1, 'images/sample.jpg', null), 
(1, 'Christmas Market', 'Festive market with local crafts and food', '2024-12-21', '2024-12-21 10:00:00', 'Town Square', 100, 80, 10.00, 800, 1, 'images/sample.jpg', null), 
(1, 'New Year Countdown Party', 'Celebrate the new year with music and fireworks', '2024-12-31', '2024-12-31 21:00:00', 'Riverside Park', 200, 150, 20.00, 1000, 1, 'images/sample.jpg', null), 
(1, 'Valentine’s Day Bash', 'Celebrate love with music and food', '2025-02-14', '2025-02-14 17:00:00', 'Love Park', 50, 45, 30.00, 300, 1, 'images/sample.jpg', null), 
(1, 'Spring Music Festival', 'Outdoor music event for all ages', '2025-03-25', '2025-03-25 15:00:00', 'Open Field', 300, 250, 15.00, 1500, 1, 'images/sample.jpg', null), 
(1, 'Food Truck Rally', 'Gathering of food trucks and street food vendors', '2025-01-10', '2025-01-10 11:00:00', 'Main Boulevard', 70, 50, 12.00, 700, 1, 'images/sample.jpg', null), 
(1, 'Cultural Dance Festival', 'Performances by local dance groups', '2025-04-12', '2025-04-12 14:00:00', 'City Amphitheater', 150, 130, 25.00, 800, 1, 'images/sample.jpg', null), 
(1, 'Local Author Meetup', 'Meet and greet with local authors', '2025-03-05', '2025-03-05 10:00:00', 'Library Hall', 30, 20, 5.00, 150, 1, 'images/sample.jpg', null), 
(1, 'Art Exhibition', 'Showcase of local artwork', '2025-01-15', '2025-01-15 09:00:00', 'Art Gallery', 40, 30, 20.00, 300, 1, 'images/sample.jpg', null), 
(1, 'Community Cleanup Day', 'Join us to help clean the park', '2025-02-20', '2025-02-20 08:00:00', 'Community Park', 100, 90, 10.00, 500, 1, 'images/sample.jpg', null);

-- TFoodTrucks
INSERT INTO TFoodTrucks (intVendorID, intCuisineTypeID, strTruckName, monMinPrice, monMaxPrice, strLogoFilePath, strOperatingLicense)
VALUES 
(1, 2, 'Taco Truck Inc', 5.00, 15.00, 'images/sample.jpg', 'TACOS1234'), -- id 1
(2, 3, 'Burgers on Wheels', 6.00, 12.00, 'images/sample.jpg', 'BURGERS1234'), -- id 2
(3, 7, 'Charlies Vegan Snacks', 4.00, 12.00, 'images/sample.jpg', 'VEGAN1234'), -- id 3
(4, 1, 'Pizza Joes', 7.00, 20.00, 'images/sample.jpg', 'PIZZA1234'), -- id 4
(5, 6, 'Evas Sweet Treats', 3.00, 8.00, 'images/sample.jpg', 'SWEETS1234'); -- id 5


-- TEventCuisines
INSERT INTO TEventCuisines (intEventID, intCuisineTypeID, intLimit, intAvailable) VALUES
(1, 1, 2, 2),  -- halloween fest allowing 2 italian trucks
(1, 2, 4, 4),  -- halloween fest allowing 4 mexican trucks
(1, 7, 6, 6),  -- halloween fest allowing 6 bakery/desert trucks
(2, 3, 2, 2), -- street food fair allowing 2 american food trucks
(3, 6, 5, 5), -- local farmers market allowing 5 bakery/dessert trucks
(3, 2, 5, 5), -- local farmers market allowing 5 "other" trucks
(4, 1, 2, 2),  -- winter wonderland allowing 2 italian trucks
(4, 6, 4, 4); -- winter wonderland allowing 4 bakery/dessert trucks

-- Past events (IDs 7 - 16) belonging to organizer 1, all intAvailable set to 0
INSERT INTO TEventCuisines (intEventID, intCuisineTypeID, intLimit, intAvailable) VALUES
(7, 2, 3, 0),  -- Spring Carnival allowing 3 Mexican trucks
(7, 3, 5, 0),  -- Spring Carnival allowing 5 American trucks
(8, 2, 4, 0),  -- Art and Craft Fair allowing 4 Mexican trucks
(8, 5, 2, 0),  -- Art and Craft Fair allowing 2 Asian trucks
(9, 2, 3, 0),  -- Community Potluck allowing 3 Mexican trucks
(9, 6, 4, 0),  -- Community Potluck allowing 4 Bakery/Desserts trucks
(10, 2, 8, 0), -- Tech Expo allowing 8 Mexican trucks
(10, 1, 5, 0), -- Tech Expo allowing 5 Italian trucks
(11, 2, 4, 0), -- Historical Reenactment allowing 4 Mexican trucks
(12, 2, 6, 0), -- Jazz Night allowing 6 Mexican trucks
(13, 1, 7, 0), -- Charity Gala allowing 7 Italian trucks
(13, 2, 3, 0), -- Charity Gala allowing 3 Mexican trucks
(14, 2, 10, 0), -- Outdoor Film Screening allowing 10 Mexican trucks
(15, 2, 5, 0), -- Marathon Expo allowing 5 Mexican trucks
(16, 2, 2, 0); -- Book Fair allowing 2 Mexican trucks

-- Upcoming events (IDs 17 - 26) belonging to organizer 1, all include Mexican trucks (for vendor 1 to reserve) and have some intAvailable open
INSERT INTO TEventCuisines (intEventID, intCuisineTypeID, intLimit, intAvailable) VALUES
(17, 2, 3, 2),  -- Winter Charity Concert allowing 3 Mexican trucks, 2 available
(17, 1, 4, 2),  -- Winter Charity Concert allowing 4 Italian trucks, 2 available
(17, 6, 3, 1),  -- Winter Charity Concert allowing 3 Bakery/Desserts trucks, 1 available
(18, 2, 5, 3),  -- Christmas Market allowing 5 Mexican trucks, 3 available
(18, 3, 7, 4),  -- Christmas Market allowing 7 American trucks, 4 available
(19, 2, 4, 4),  -- New Year Countdown Party allowing 4 Mexican trucks, all available
(19, 5, 6, 6),  -- New Year Countdown Party allowing 6 Asian trucks, all available
(20, 2, 2, 1),  -- Valentine’s Day Bash allowing 2 Mexican trucks, 1 available
(20, 4, 2, 1),  -- Valentine’s Day Bash allowing 2 Indian trucks, 1 available
(20, 7, 4, 2),  -- Valentine’s Day Bash allowing 4 Other trucks, 2 available
(21, 2, 6, 5),  -- Spring Music Festival allowing 6 Mexican trucks, 5 available
(21, 1, 8, 5),  -- Spring Music Festival allowing 8 Italian trucks, 5 available
(21, 3, 10, 7), -- Spring Music Festival allowing 10 American trucks, 7 available
(22, 2, 3, 2),  -- Food Truck Rally allowing 3 Mexican trucks, 2 available
(22, 6, 5, 4),  -- Food Truck Rally allowing 5 Bakery/Desserts trucks, 4 available
(23, 2, 3, 2),  -- Cultural Dance Festival allowing 3 Mexican trucks, 2 available
(23, 5, 3, 2),  -- Cultural Dance Festival allowing 3 Asian trucks, 2 available
(24, 2, 4, 4),  -- Local Author Meetup allowing 4 Mexican trucks, all available
(25, 2, 2, 1),  -- Art Exhibition allowing 2 Mexican trucks, 1 available
(25, 1, 3, 3),  -- Art Exhibition allowing 3 Italian trucks, all available
(25, 6, 2, 1),  -- Art Exhibition allowing 2 Bakery/Desserts trucks, 1 available
(26, 2, 3, 2),  -- Community Cleanup Day allowing 3 Mexican trucks, 2 available
(26, 3, 5, 3);  -- Community Cleanup Day allowing 5 American trucks, 3 available


-- TEventSpaces
INSERT INTO TEventSpaces (intEventID, strSpaceNum, strSize, boolIsAvailable) 
VALUES
(1, 'A1', '10x10', 1),
(1, 'A2', '10x10', 1),
(1, 'A3', '10x20', 1),
(2, 'A4', '10x20', 1),
(2, 'B1', '10x10', 1),
(3, 'B2', '10x10', 1),
(4, 'B3', '10x20', 0),
(5, 'B4', '10x20', 0);
--adding event spaces for upcoming events 17 - 26
INSERT INTO TEventSpaces (intEventID, strSpaceNum, strSize, boolIsAvailable) 
VALUES
(17, 'A1', '10x10', 1),
(17, 'A2', '10x10', 1),
(17, 'A3', '10x20', 1),
(17, 'A4', '10x20', 1),
(17, 'A5', '10x10', 1),
(17, 'A6', '10x10', 1),
(18, 'B1', '10x10', 1),
(18, 'B2', '10x10', 1),
(18, 'B3', '10x20', 1),
(18, 'B4', '10x20', 1),
(18, 'B5', '10x10', 1),
(18, 'B6', '10x10', 1),
(19, 'C1', '10x10', 1),
(19, 'C2', '10x10', 1),
(19, 'C3', '10x20', 1),
(19, 'C4', '10x20', 1),
(19, 'C5', '10x10', 1),
(19, 'C6', '10x10', 1),
(20, 'D1', '10x10', 1),
(20, 'D2', '10x10', 1),
(20, 'D3', '10x20', 1),
(20, 'D4', '10x20', 1),
(20, 'D5', '10x10', 1),
(20, 'D6', '10x10', 1),
(21, 'E1', '10x10', 1),
(21, 'E2', '10x10', 1),
(21, 'E3', '10x20', 1),
(21, 'E4', '10x20', 1),
(21, 'E5', '10x10', 1),
(21, 'E6', '10x10', 1),
(22, 'F1', '10x10', 1),
(22, 'F2', '10x10', 1),
(22, 'F3', '10x20', 1),
(22, 'F4', '10x20', 1),
(22, 'F5', '10x10', 1),
(22, 'F6', '10x10', 1),
(23, 'G1', '10x10', 1),
(23, 'G2', '10x10', 1),
(23, 'G3', '10x20', 1),
(23, 'G4', '10x20', 1),
(23, 'G5', '10x10', 1),
(23, 'G6', '10x10', 1),
(24, 'H1', '10x10', 1),
(24, 'H2', '10x10', 1),
(24, 'H3', '10x20', 1),
(24, 'H4', '10x20', 1),
(24, 'H5', '10x10', 1),
(24, 'H6', '10x10', 1),
(25, 'I1', '10x10', 1),
(25, 'I2', '10x10', 1),
(25, 'I3', '10x20', 1),
(25, 'I4', '10x20', 1),
(25, 'I5', '10x10', 1),
(25, 'I6', '10x10', 1),
(26, 'J1', '10x10', 1),
(26, 'J2', '10x10', 1),
(26, 'J3', '10x20', 1),
(26, 'J4', '10x20', 1),
(26, 'J5', '10x10', 1),
(26, 'J6', '10x10', 1);


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

-- Inserting rows for intFoodTruckID 1 (belongs to vendor 1) at past events 7-12 with feedback
INSERT INTO TFoodTruckEvents (intEventID, intFoodTruckID, monTotalRevenue, intRating, strVendorComment)
VALUES
(7, 1, 500.00, 4, 'Solid event with good engagement'),
(8, 1, 450.00, 3, 'The event was decent but a bit under-advertised'),
(9, 1, 600.00, 5, 'Great event, lots of attendees and good sales'),
(10, 1, 450.00, 3, 'Average turnout, but steady sales throughout'),
(11, 1, 800.00, 4, 'Well-organized, we had consistent traffic'),
(12, 1, 550.00, 4, 'Nice crowd and well-planned event layout');

-- Other vendors 2-5 at past events 7-16 with feedback
INSERT INTO TFoodTruckEvents (intEventID, intFoodTruckID, monTotalRevenue, intRating, strVendorComment)
VALUES
(7, 1, 500.00, 4, 'Good sales, overall a nice crowd'),
(7, 3, 600.00, 5, 'Fantastic event with high engagement'),
(8, 2, 450.00, 3, 'Average turnout but made decent connections'),
(8, 4, 550.00, 4, 'Steady flow of customers, well-organized event'),
(9, 1, 800.00, 5, 'Best event we’ve attended this month'),
(9, 5, 700.00, 4, 'Great experience, lots of attendees'),
(10, 2, 300.00, 1, 'Low traffic, event needed more promotion'),
(10, 3, 450.00, 4, 'Solid sales, happy with the outcome'),
(11, 1, 600.00, 4, 'Good exposure, decent foot traffic'),
(11, 4, 400.00, 3, 'Could have been better with more advertising'),
(12, 3, 700.00, 5, 'Great day, made significant profit'),
(12, 5, 750.00, 4, 'Steady and enjoyable, well-organized'),
(13, 2, 250.00, 2, 'Turnout was low, possibly due to weather'),
(13, 5, 500.00, 4, 'Decent sales given the conditions'),
(14, 1, 900.00, 5, 'Top event for sales this season'),
(14, 4, 650.00, 4, 'Good turnout, great location'),
(15, 3, 400.00, 3, 'It was okay, not as busy as expected'),
(15, 5, 600.00, 4, 'Enjoyable event with moderate success'),
(16, 2, 850.00, 5, 'Highly successful, busy throughout the day'),
(16, 1, 700.00, 4, 'Great atmosphere and excellent sales');

-- RESERVING UPCOMING EVENTS FOR VENDOR 1
--Exec uspReserveSpace 1, 17
--Exec uspReserveSpace 1, 18
--Exec uspReserveSpace 1, 19
--Exec uspReserveSpace 1, 20
--Exec uspReserveSpace 1, 21
--select * from TFoodTruckEvents where intFoodTruckID = 1
--select * from TReservations where intFoodTruckID = 1


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

-- populate a menu for vendor 1
INSERT INTO TMenus (intFoodTruckID, strItem, monPrice, intUnitsSold)
VALUES
    (1, 'Beef Tacos', 3.50, 30),
    (1, 'Chicken Quesadilla', 4.75, 20),
    (1, 'Chips and Queso', 4.00, 22),
    (1, 'Churro', 2.00, 16);



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
    @UserID      INT OUTPUT,
    @UserType    INT OUTPUT  -- 1 for vendor, 2 for organizer
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
           
            SET @UserType = 1; -- was a vendor 

           
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
            
            SET @UserType = 2; --was a organizer

         
            UPDATE TOrganizers
            SET dtLastLogin = GETDATE()
            WHERE intOrganizerID = @UserID;
            
            COMMIT TRANSACTION;
            RETURN;
        END

        
        ROLLBACK TRANSACTION;
        SET @UserID = NULL;
        SET @UserType = 0;

    END TRY
    BEGIN CATCH
        
        ROLLBACK TRANSACTION;
        SET @UserID = NULL;
        SET @UserType = 0;
    END CATCH
END
GO
--testing login procedure
--DECLARE @UserID INT;
--DECLARE @UserType INT;
--EXEC uspLoginUser @strEmail = 'alice@gmail.com', @strPassword = 'password111', @UserID = @UserID OUTPUT, @UserType = @UserType OUTPUT;
--SELECT @UserID AS UserID;
--SELECT @UserID AS UserID, @UserType AS UserType;





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
    @monMinPrice AS MONEY = NULL,
    @monMaxPrice AS MONEY = NULL,
    @strLogoFilePath AS VARCHAR(500) = NULL,  
    @strOperatingLicense AS VARCHAR(50) = NULL
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
	@strDescription AS VARCHAR(255),
    @dtDateOfEvent AS DATETIME,
    @dtSetUpTime AS DATETIME,
    @strLocation AS VARCHAR(50),
    @intTotalSpaces AS INTEGER,
    @intAvailableSpaces AS INTEGER = NULL,
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
		strDescription,
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
		@strDescription,
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
	@strDescription VARCHAR(255) = NULL,
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
			strDescription = COALESCE(@strDescription, strDescription),
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
        TEvents.intOrganizerID,
        TOrganizers.strEmail,
        TEvents.strEventName,
        TEvents.strDescription,
        TEvents.dtDateOfEvent,
        TEvents.dtSetUpTime,
        TEvents.strLocation,
        TEvents.intTotalSpaces,
        TEvents.intAvailableSpaces,
        TEvents.monPricePerSpace,
        TEvents.intExpectedGuests,
        TEvents.intStatusID,
        TEvents.strLogoFilePath,
        TEvents.monTotalRevenue
    FROM 
        TEvents
    INNER JOIN 
        TOrganizers ON TEvents.intOrganizerID = TOrganizers.intOrganizerID
    WHERE 
        TEvents.intEventID = @intEventID;
END;
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




-- DELETE EVENT
CREATE PROCEDURE uspDeleteEvent
    @intEventID INT
AS
BEGIN
    SET NOCOUNT ON;  
    SET XACT_ABORT ON;  

    BEGIN TRANSACTION;

    DELETE FROM TEvents
    WHERE intEventID = @intEventID;

    COMMIT TRANSACTION;  
END
GO
-- testing uspDeleteEvent
--select * from TEvents;
--EXEC uspDeleteEvent @intEventID = 2;
--select * from TEvents;

GO

-- DELETE FOOD TRUCK
CREATE PROCEDURE uspDeleteFoodTruck
    @intFoodTruckID INT
AS
BEGIN
    SET NOCOUNT ON;  
    SET XACT_ABORT ON;  

    BEGIN TRANSACTION;

    DELETE FROM TFoodTrucks
    WHERE intFoodTruckID = @intFoodTruckID;

    COMMIT TRANSACTION;  
END
GO
-- testing uspDeleteFoodTruck
--select * from TFoodTrucks;
--EXEC uspDeleteFoodTruck @intFoodTruckID = 1;
--select * from TFoodTrucks;