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
    @intFoodTruckID INT
AS
BEGIN
    SET NOCOUNT ON

    SELECT
        TEvents.strEventName, TFoodTruckEvents.monTotalRevenue
    FROM
        TFoodTruckEvents INNER JOIN TEvents
    ON
        TFoodTruckEvents.intEventID = TEvents.intEventID
    WHERE
          TFoodTruckEvents.intFoodTruckID = @intFoodTruckID
        AND TFoodTruckEvents.monTotalRevenue = (
            SELECT
                MAX(monTotalRevenue)
            FROM
                TFoodTruckEvents
            WHERE
                intFoodTruckID = @intFoodTruckID
            )
END;

GO
