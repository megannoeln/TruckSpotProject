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
USE dbTruckSpot;

SET NOCOUNT ON;

-- --------------------------------------------------------------------------------
-- Drop
-- --------------------------------------------------------------------------------

IF OBJECT_ID( 'uspGetTop5MostPopularEvents') IS NOT NULL DROP PROCEDURE  uspGetTop5MostPopularEvents

GO

CREATE PROCEDURE uspGetTop5MostPopularEvents
    @intOrganizerID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 5 strEventName
    FROM TEvents
    WHERE intOrganizerID = @intOrganizerID
          AND TEvents.dtDateOfEvent <= GETDATE()
    ORDER BY intExpectedGuests DESC;
END;

GO

-- EXEC uspGetTop5MostPopularEvents @intOrganizerID = 1
