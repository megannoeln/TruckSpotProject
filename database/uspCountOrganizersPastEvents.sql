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

IF OBJECT_ID( 'uspCountOrganizersPastEvents') IS NOT NULL DROP PROCEDURE  uspCountOrganizersPastEvents

GO


CREATE PROCEDURE uspCountOrganizersPastEvents
    @intOrganizerID INT 
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        COUNT(*) AS PastEventCount
    FROM 
        TEvents
    WHERE 
        intOrganizerID = @intOrganizerID
        AND dtDateOfEvent < GETDATE(); 
END;

GO

exec uspCountOrganizersPastEvents 1