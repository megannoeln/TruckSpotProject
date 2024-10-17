-- --------------------------------------------------------------------------------
-- Capstone Project Fall '24
-- TruckSpot (FoodTruck & Event App)
-- Team C 
-- Megan Noel, Seth Lubic, Testimony Awuzie & Apiwat Anachai
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
IF OBJECT_ID('TUserEvents')			IS NOT NULL DROP TABLE TUserEvents;          
IF OBJECT_ID('TEventRating')		IS NOT NULL DROP TABLE TEventRating;         
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
	,strUserName			VARCHAR(50)				NOT NULL
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
	,intStatusID			INTEGER				NOT NULL             
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

CREATE TABLE TUserEvents
(
	 intUserEventID			INTEGER	IDENTITY		NOT NULL
	,intEventID				INTEGER					NOT NULL
	,intUserID				INTEGER					NOT NULL
	,CONSTRAINT TUserEvents_PK PRIMARY KEY ( intUserEventID )
	,FOREIGN KEY ( intEventID ) REFERENCES TEvents ( intEventID ) 
	,FOREIGN KEY ( intUserID ) REFERENCES TUsers ( intUserID ) 
	,CONSTRAINT UQ_UserEvent UNIQUE (intEventID, intUserID) 
);

CREATE TABLE TEventRating
(
	 intEventRatingID		INTEGER	IDENTITY		NOT NULL
	,intEventID				INTEGER					NOT NULL
	,intFoodTruckID			INTEGER					NOT NULL
	,intRating				INTEGER					NOT NULL -- this could be a 1-5 value, drop down on front-end?
	,strComment				VARCHAR(500)			 
	,CONSTRAINT TEventRating_PK PRIMARY KEY ( intEventRatingID )
	,FOREIGN KEY ( intEventID ) REFERENCES TEvents ( intEventID ) 
	,FOREIGN KEY ( intFoodTruckID ) REFERENCES TFoodTrucks ( intFoodTruckID ) 
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
INSERT INTO TUsers (intUserTypeID, strFirstName, strLastName, strUserName, strPassword, strEmail, strPhone, dtDateCreated, dtLastLogin) 
VALUES 
--vendors
(1, 'Alice', 'Smith', 'asmith', 'password111', 'alice@gmail.com', '123-456-7890', GETDATE(), GETDATE()), -- id 1
(1, 'Evan', 'Johnson', 'ejohnson', 'password222', 'evan@gmail.com', '123-456-7891', GETDATE(), GETDATE()), -- id 2
(1, 'Charlie', 'Williams', 'cwilliams', 'password333', 'charlie@gmail.com', '123-456-7892', GETDATE(), GETDATE()), -- id 3
(1, 'Jimmy', 'Brown', 'jbrown', 'password444', 'jimmy@gmail.com', '123-456-7893', GETDATE(), GETDATE()), -- id 4
(1, 'Eva', 'Jones', 'ejones', 'password555', 'eva@gmail.com', '123-456-7894', GETDATE(), GETDATE()), -- id 5
--organizers 
(2, 'Lola', 'Garcia', 'lgarcia', 'password666', 'lola@gmail.com', '123-456-7895', GETDATE(), GETDATE()), -- id 6
(2, 'Grace', 'Martinez', 'gmartinez', 'password777', 'grace@gmail.com', '123-456-7896', GETDATE(), GETDATE()), -- id 7
(2, 'Steph', 'Davis', 'sdavis', 'password888', 'steph@gmail.com', '123-456-7897', GETDATE(), GETDATE()), -- id 8
(2, 'Isabella', 'Rodriguez', 'irodriguez', 'password999', 'isabella@gmail.com', '123-456-7898', GETDATE(), GETDATE()), -- id 9
(2, 'Jack', 'Odell', 'jodell', 'password000', 'jack@gmail.com', '123-456-7899', GETDATE(), GETDATE()); -- id 10


-- TEvents
INSERT INTO TEvents (intUserID, strEventName, dtDateOfEvent, dtSetUpTime, strLocation, intTotalSpaces, intAvailableSpaces, monPricePerSpace, intExpectedGuests, intStatusID, strLogoFilePath, monTotalRevenue)
VALUES 
(6, 'Halloween Festival', '2024-11-01', '2024-11-01 09:00:00', 'City Park', 10, 5, 10.00, 500, 1, 'images/event1_logo.png', null), -- id 1
(7, 'Street Food Fair', '2024-11-15', '2024-11-15 09:00:00', 'Downtown', 15, 15, 15.00, 450, 1, 'images/event2_logo.png', null), -- id 2
(8, 'Local Farmers Market', '2024-11-22', '2024-11-22 08:00:00', 'Main Square', 20, 18, 20.00, 100, 1, 'images/event3_logo.png', null), -- id 3
(9, 'Winter Wonderland', '2023-12-05', '2023-12-05 09:00:00', 'Ice Rink', 20, 8, 13.00, 80, 2, 'images/event4_logo.png', 3000.00), -- id 4  **past event**
(10, 'Summer Splash', '2024-07-10', '2024-07-10 09:00:00', 'Community Pool', 30, 12, 20.00, 600, 2, 'images/event5_logo.png', 5000.00); -- id 5  **past event**


-- TFoodTrucks
INSERT INTO TFoodTrucks (intUserID, intCuisineTypeID, strTruckName, monMinPrice, monMaxPrice, strLogoFilePath, strOperatingLicense)
VALUES 
(1, 2, 'Taco Truck Inc', 5.00, 15.00, 'images/truck1_logo.png', 'TACOS1234'), -- id 1
(2, 3, 'Burgers on Wheels', 6.00, 12.00, 'images/truck2_logo.png', 'BURGERS1234'), -- id 2
(3, 7, 'Charlies Vegan Snacks', 4.00, 12.00, 'images/truck3_logo.png', 'VEGAN1234'), -- id 3
(4, 1, 'Pizza Joes', 7.00, 20.00, 'images/truck4_logo.png', 'PIZZA1234'), -- id 4
(5, 6, 'Evas Sweet Treats', 3.00, 8.00, 'images/truck5_logo.png', 'SWEETS1234'); -- id 5


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

-- TUserEvents -- many to many with organizers to events
INSERT INTO TUserEvents (intUserID, intEventID) 
VALUES
(6, 1),
(7, 1),
(7, 2),
(8, 3),
(8, 2),
(9, 4),
(10, 5);

-- TEventRatings
INSERT INTO TEventRating (intEventID, intFoodTruckID, intRating, strComment)
VALUES
(4, 1, 4, 'Great event, well organized'),
(4, 2, 5, 'Fantastic turnout'),
(4, 3, 3, 'Decent event, but could use better marketing'),
(4, 4, 4, 'Good location and crowd, would come again'),
(5, 1, 5, 'Excellent event, we had a lot of customers'),
(5, 2, 2, 'Not enough foot traffic'),
(5, 3, 4, 'Had a blast'),
(5, 4, 3, 'It was alright, but we expected more attendees'),
(5, 5, 5, 'Wonderful event, we sold out of food!');


-- TFoodTruckEvents
INSERT INTO TFoodTruckEvents (intEventID, intFoodTruckID, monTotalRevenue)
VALUES
(1, 1, null),  
(1, 2, null), 
(2, 1, null),  
(2, 3, null),  
(3, 2, null),  
(3, 1, null),   
(3, 4, null),  
(4, 3, 300.00),  
(4, 2, 500.00), 
(4, 1, 300.00),  
(4, 4, 200.00),  
(5, 1, 1000.00),  
(5, 2, 100.00),  
(5, 3, 500.00), 
(5, 4, 300.00),  
(5, 5, 1500.00);  


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





-- quick tests
--select * from TEvents;
--select * from TUsers;
--select * from TFoodTrucks;
--select * from TEvents where intStatusID = 2;




-- note to self
-- will use "instead of delete" triggers for deletions to get around cascade deletes and foreign key constraints
-- delete records from grandchild tables, child tables, parent tables

--delete from TEventSpaces where intEventID = 1;
--delete from TUserEvents where intEventID = 1;
--delete from TEvents where intEventID = 1;

--select * from TEvents

--delete from TUserEvents where intUserID = 1;
--delete from TFoodTrucks where intUserID = 1;
--delete from TUsers where intUserID = 1;