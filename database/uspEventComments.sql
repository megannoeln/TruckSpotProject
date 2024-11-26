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

IF OBJECT_ID( 'uspEventComments') IS NOT NULL DROP PROCEDURE  uspEventComments

GO

-- gets a list of vendor comments on events from TFoodTruckEvents
CREATE PROCEDURE uspEventComments
    @intEventID INT       
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        TVendors.strFirstName + ' ' + TVendors.strLastName AS VendorName,
        TFoodTruckEvents.strVendorComment AS Comment,
		TFoodTruckEvents.intRating AS Rating,
		TFoodTruckEvents.monTotalRevenue AS TotalRevenue
    FROM 
        TFoodTruckEvents
    INNER JOIN 
        TEvents ON TFoodTruckEvents.intEventID = TEvents.intEventID
    INNER JOIN 
        TFoodTrucks ON TFoodTruckEvents.intFoodTruckID = TFoodTrucks.intFoodTruckID
    INNER JOIN 
        TVendors ON TFoodTrucks.intVendorID = TVendors.intVendorID
    WHERE 
        TEvents.intEventID = @intEventID
        AND TFoodTruckEvents.strVendorComment IS NOT NULL;
END;
GO

--exec uspEventComments 1