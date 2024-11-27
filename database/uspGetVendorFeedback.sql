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

IF OBJECT_ID('uspGetVendorFeedback') IS NOT NULL DROP PROCEDURE uspGetVendorFeedback

GO

CREATE PROCEDURE uspGetVendorFeedback
    @intEventID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        strTruckName, strVendorComment, intRating
    FROM
        TFoodTruckEvents INNER JOIN TFoodTrucks
    ON
        TFoodTruckEvents.intFoodTruckID = TFoodTrucks.intFoodTruckID
    WHERE
        intEventID = @intEventID
    END;

GO
