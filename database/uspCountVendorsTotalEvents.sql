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

IF OBJECT_ID( 'uspCountVendorsTotalEvents') IS NOT NULL DROP PROCEDURE  uspCountVendorsTotalEvents

GO


CREATE PROCEDURE uspCountVendorsTotalEvents
    @intVendorID INT 
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        COUNT(*) AS TotalEventCount
    FROM 
        TFoodTruckEvents
    INNER JOIN 
        TFoodTrucks ON TFoodTruckEvents.intFoodTruckID = TFoodTrucks.intFoodTruckID
    WHERE 
        TFoodTrucks.intVendorID = @intVendorID;
END;

GO

--exec uspCountVendorsTotalEvents 1