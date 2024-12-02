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

IF OBJECT_ID( 'uspCountVendorsFutureEvents') IS NOT NULL DROP PROCEDURE  uspCountVendorsFutureEvents

GO


CREATE PROCEDURE uspCountVendorsFutureEvents
    @intVendorID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        COUNT(*) AS FutureEventCount
    FROM 
        TFoodTruckEvents
    INNER JOIN 
        TFoodTrucks ON TFoodTruckEvents.intFoodTruckID = TFoodTrucks.intFoodTruckID
    INNER JOIN 
        TEvents ON TFoodTruckEvents.intEventID = TEvents.intEventID
    WHERE 
        TFoodTrucks.intVendorID = @intVendorID
        AND TEvents.dtDateOfEvent >= GETDATE(); 
END;

GO

--exec uspCountVendorsFutureEvents 1