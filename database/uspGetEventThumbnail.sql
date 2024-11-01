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

IF OBJECT_ID( 'uspGetEventThumbnail') IS NOT NULL DROP PROCEDURE  uspGetEventThumbnail



GO

-- GET EVENT THUMBNAIL
-- for displaying the little thumbnails for events on home page
CREATE PROCEDURE uspGetEventThumbnail
    @intEventID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        intEventID,
        strEventName,
        dtDateOfEvent,
        strLocation,
        strLogoFilePath  
    FROM 
        TEvents
    WHERE 
        intEventID = @intEventID;
END;

GO

--EXECUTE uspGetEventThumbnail 1

