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

IF OBJECT_ID('uspAverageEventRating') IS NOT NULL DROP PROCEDURE  uspAverageEventRating

GO

CREATE PROCEDURE uspAverageEventRating
    @intEventID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
       AVG(intRating)
    FROM
        TFoodTruckEvents
    WHERE
        intEventID = @intEventID
END;

GO
