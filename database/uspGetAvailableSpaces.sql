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

IF OBJECT_ID( 'uspGetAvailableSpaces') IS NOT NULL DROP PROCEDURE  uspGetAvailableSpaces



GO

-- gets available spaces for an event
CREATE PROCEDURE uspGetAvailableSpaces
    @intEventID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        strSpaceNum
 
    FROM 
        TEventSpaces
    WHERE 
        intEventID = @intEventID AND boolIsAvailable = 1;
END;

GO