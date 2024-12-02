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

IF OBJECT_ID( 'uspCountVendorsPastEvents') IS NOT NULL DROP PROCEDURE  uspCountVendorsPastEvents

GO


CREATE PROCEDURE uspCountVendorsPastEvents
    @intVendorID INT 
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        COUNT(*) AS PastEventCount
    FROM 
        TFoodTruckEvents
    INNER JOIN 
        TFoodTrucks ON TFoodTruckEvents.intFoodTruckID = TFoodTrucks.intFoodTruckID
    INNER JOIN 
        TEvents ON TFoodTruckEvents.intEventID = TEvents.intEventID
    WHERE 
        TFoodTrucks.intVendorID = @intVendorID
        AND TEvents.dtDateOfEvent < GETDATE(); 
END;

GO

--exec uspCountVendorsPastEvents 1