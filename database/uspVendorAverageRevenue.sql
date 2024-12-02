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

SET NOCOUNT ON;

-- --------------------------------------------------------------------------------
-- Drop
-- --------------------------------------------------------------------------------

IF OBJECT_ID('uspVendorAverageRevenue') IS NOT NULL DROP PROCEDURE  uspVendorAverageRevenue

GO

CREATE PROCEDURE uspVendorAverageRevenue
    @intVendorID INT
AS
BEGIN
    SET NOCOUNT ON;

 
    DECLARE @intFoodTruckID INT;

   
    SELECT 
        @intFoodTruckID = TFoodTrucks.intFoodTruckID
    FROM 
        TFoodTrucks
    WHERE 
        TFoodTrucks.intVendorID = @intVendorID;

   
    SELECT
        AVG(TFoodTruckEvents.monTotalRevenue) AS AverageRevenue
    FROM
        TFoodTruckEvents
    WHERE
        TFoodTruckEvents.intFoodTruckID = @intFoodTruckID;
END;


GO

--exec uspVendorAverageRevenue 1