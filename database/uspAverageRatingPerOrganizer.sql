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

IF OBJECT_ID('uspAverageRatingPerOrganizer') IS NOT NULL DROP PROCEDURE  uspAverageRatingPerOrganizer

GO

CREATE PROCEDURE uspAverageRatingPerOrganizer
    @intOrganizerID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        AVG(intRating) as AverageRating
    FROM
        TFoodTruckEvents INNER JOIN TEvents
    ON
        TFoodTruckEvents.intEventID = TEvents.intEventID
    WHERE
        intOrganizerID = @intOrganizerID
END;

GO
