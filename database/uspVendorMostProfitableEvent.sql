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

IF OBJECT_ID('uspVendorMostProfitableEvent') IS NOT NULL DROP PROCEDURE  uspVendorMostProfitableEvent

GO

CREATE PROCEDURE uspVendorMostProfitableEvent
    @intVendorID INT
AS
BEGIN
    SET NOCOUNT ON

	DECLARE @intFoodTruckID INT;

    SELECT 
        @intFoodTruckID = TFoodTrucks.intFoodTruckID
    FROM 
        TFoodTrucks
    WHERE 
        TFoodTrucks.intVendorID = @intVendorID;


    SELECT
        TEvents.strEventName as EventName, 
        TFoodTruckEvents.monTotalRevenue as TotalRevenue
    FROM
        TFoodTruckEvents
    INNER JOIN 
        TEvents ON TFoodTruckEvents.intEventID = TEvents.intEventID
    WHERE
        TFoodTruckEvents.intFoodTruckID = @intFoodTruckID
        AND TFoodTruckEvents.monTotalRevenue = (
            SELECT MAX(monTotalRevenue)
            FROM TFoodTruckEvents
            WHERE intFoodTruckID = @intFoodTruckID
        );
END;


GO
