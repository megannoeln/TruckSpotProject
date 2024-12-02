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

IF OBJECT_ID( 'uspCountOrganizersTotalEvents') IS NOT NULL DROP PROCEDURE  uspCountOrganizersTotalEvents

GO


CREATE PROCEDURE uspCountOrganizersTotalEvents
    @intOrganizerID INT 
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        COUNT(*) AS TotalEventCount
    FROM 
        TEvents
    WHERE 
        intOrganizerID = @intOrganizerID;
END;

GO

exec uspCountOrganizersTotalEvents 1