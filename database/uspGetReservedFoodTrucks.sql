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
-- Drop
-- --------------------------------------------------------------------------------

IF OBJECT_ID( 'uspGetReservedFoodTrucks') IS NOT NULL DROP PROCEDURE uspGetReservedFoodTrucks



GO

-- GET RESERVED FOODTRUCKS
-- gets a thumbnail for every foodtruck reserved for a specific event
CREATE PROCEDURE uspGetReservedFoodTrucks
    @EventID INTEGER
AS
BEGIN
    SELECT 
        TFoodTrucks.strTruckName AS FoodTruckName,
        TVendors.strFirstName + ' ' + TVendors.strLastName AS VendorName,
        TVendors.strEmail AS VendorEmail,
        TVendors.strPhone AS VendorPhone,
        TCuisineTypes.strCuisineType AS FoodType
    FROM 
        TFoodTruckEvents
    INNER JOIN 
        TFoodTrucks ON TFoodTruckEvents.intFoodTruckID = TFoodTrucks.intFoodTruckID
    INNER JOIN 
        TVendors ON TFoodTrucks.intVendorID = TVendors.intVendorID
    INNER JOIN 
        TCuisineTypes ON TFoodTrucks.intCuisineTypeID = TCuisineTypes.intCuisineTypeID
    WHERE 
        TFoodTruckEvents.intEventID = @EventID;
END;
GO

--EXECUTE uspGetReservedFoodTrucks 4