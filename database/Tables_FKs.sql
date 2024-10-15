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

CREATE TABLE TUsers
(
	 intUserID				INTEGER	IDENTITY		NOT NULL
	,intUserTypeID			INTEGER					NOT NULL
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
	,strEventStatus			VARCHAR(50)				NOT NULL             
	,strLogoFilePath		VARCHAR(500)      -- will be a relative file path in our project. ex: "images/logo.gif"
	,monTotalRevenue		MONEY
	,CONSTRAINT TEvents_PK PRIMARY KEY ( intEventID )
	,FOREIGN KEY ( intUserID ) REFERENCES TUsers ( intUserID )
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
	,monPrice				MONEY					NOT NULL 
	,CONSTRAINT TEventSpaces_PK PRIMARY KEY ( intEventSpaceID )
	,FOREIGN KEY ( intEventID ) REFERENCES TEvents ( intEventID )
	,CONSTRAINT chk_monPrice CHECK (monPrice > 0) 
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
	,strReservationStatus	VARCHAR(50)				NOT NULL
	,CONSTRAINT TReservations_PK PRIMARY KEY ( intReservationID )
	,FOREIGN KEY ( intEventSpaceID ) REFERENCES TEventSpaces ( intEventSpaceID )
	,FOREIGN KEY ( intFoodTruckID ) REFERENCES TFoodTrucks ( intFoodTruckID )
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
-- Foreign Key Constraints
-- --------------------------------------------------------------------------------

-- foreign key for TEvents referencing TUsers
ALTER TABLE TEvents
ADD CONSTRAINT FK_TEvents_TUsers
FOREIGN KEY (intUserID)
REFERENCES TUsers (intUserID)
ON DELETE CASCADE;  

-- foreign key for TUsers referencing TUserTypes
ALTER TABLE TUsers
ADD CONSTRAINT FK_TUsers_TUserTypes
FOREIGN KEY (intUserTypeID)
REFERENCES TUserTypes (intUserTypeID)

-- foreign key for TUserEvents referencing TUsers
ALTER TABLE TUserEvents
ADD CONSTRAINT FK_TUserEvents_TUsers
FOREIGN KEY (intUserID)
REFERENCES TUsers (intUserID);

-- foreign key for TUserEvents referencing TEvents
ALTER TABLE TUserEvents
ADD CONSTRAINT FK_TUserEvents_TEvents
FOREIGN KEY (intEventID)
REFERENCES TEvents (intEventID)
ON DELETE CASCADE;

-- foreign key for TFoodTrucks referencing TUsers
ALTER TABLE TFoodTrucks
ADD CONSTRAINT FK_TFoodTrucks_TUsers
FOREIGN KEY (intUserID)
REFERENCES TUsers (intUserID)

-- foreign key for TFoodTrucks referencing TCuisineTypes
ALTER TABLE TFoodTrucks
ADD CONSTRAINT FK_TFoodTrucks_TCuisineTypes
FOREIGN KEY (intCuisineTypeID)
REFERENCES TCuisineTypes (intCuisineTypeID);

-- foreign key for TEventCuisines referencing TEvents
ALTER TABLE TEventCuisines
ADD CONSTRAINT FK_TEventCuisines_TEvents
FOREIGN KEY (intEventID)
REFERENCES TEvents (intEventID)
ON DELETE CASCADE;

-- foreign key for TEventCuisines referencing TCuisineTypes
ALTER TABLE TEventCuisines
ADD CONSTRAINT FK_TEventCuisines_TCuisineTypes
FOREIGN KEY (intCuisineTypeID)
REFERENCES TCuisineTypes (intCuisineTypeID);

-- foreign key for TReservations referencing TEventSpaces
ALTER TABLE TReservations
ADD CONSTRAINT FK_TReservations_TEventSpaces
FOREIGN KEY (intEventSpaceID)
REFERENCES TEventSpaces (intEventSpaceID)
ON DELETE CASCADE;

-- foreign key for TReservations referencing TFoodTrucks
ALTER TABLE TReservations
ADD CONSTRAINT FK_TReservations_TFoodTrucks
FOREIGN KEY (intFoodTruckID)
REFERENCES TFoodTrucks (intFoodTruckID)
ON DELETE CASCADE;

-- foreign key for TEventSpaces referencing TEvents
ALTER TABLE TEventSpaces
ADD CONSTRAINT FK_TEventSpaces_TEvents
FOREIGN KEY (intEventID)
REFERENCES TEvents (intEventID)
ON DELETE CASCADE;

-- foreign key for TEventRating referencing TEvents
ALTER TABLE TEventRating
ADD CONSTRAINT FK_TEventRating_TEvents
FOREIGN KEY (intEventID)
REFERENCES TEvents (intEventID)
ON DELETE CASCADE;

-- foreign key for TEventRating referencing TFoodTrucks
ALTER TABLE TEventRating
ADD CONSTRAINT FK_TEventRating_TFoodTrucks
FOREIGN KEY (intFoodTruckID)
REFERENCES TFoodTrucks (intFoodTruckID);

-- foreign key for TEventSponsors referencing TEvents
ALTER TABLE TEventSponsors
ADD CONSTRAINT FK_TEventSponsors_TEvents
FOREIGN KEY (intEventID)
REFERENCES TEvents (intEventID)
ON DELETE CASCADE;

-- foreign key for TEventSponsors referencing TSponsors
ALTER TABLE TEventSponsors
ADD CONSTRAINT FK_TEventSponsors_TSponsors
FOREIGN KEY (intSponsorID)
REFERENCES TSponsors (intSponsorID);

-- foreign key for TFoodTruckEvents referencing TEvents
ALTER TABLE TFoodTruckEvents
ADD CONSTRAINT FK_TFoodTruckEvents_TEvents
FOREIGN KEY (intEventID)
REFERENCES TEvents (intEventID)
ON DELETE CASCADE;

-- foreign key for TFoodTruckEvents referencing TFoodTrucks
ALTER TABLE TFoodTruckEvents
ADD CONSTRAINT FK_TFoodTruckEvents_TFoodTrucks
FOREIGN KEY (intFoodTruckID)
REFERENCES TFoodTrucks (intFoodTruckID);

-- foreign key for TPayments referencing TReservations
ALTER TABLE TPayments
ADD CONSTRAINT FK_TPayments_TReservations
FOREIGN KEY (intReservationID)
REFERENCES TReservations (intReservationID)
ON DELETE CASCADE;