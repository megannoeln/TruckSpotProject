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

IF OBJECT_ID( 'uspCountOrganizersFutureEvents') IS NOT NULL DROP PROCEDURE  uspCountOrganizersFutureEvents

GO


CREATE PROCEDURE uspCountOrganizersFutureEvents
    @intOrganizerID INT 
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        COUNT(*) AS FutureEventCount
    FROM 
        TEvents
    WHERE 
        intOrganizerID = @intOrganizerID
        AND dtDateOfEvent >= GETDATE(); 
END;

GO

exec uspCountOrganizersFutureEvents 1