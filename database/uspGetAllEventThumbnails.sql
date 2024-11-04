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

IF OBJECT_ID( 'uspGetAllEventThumbnails') IS NOT NULL DROP PROCEDURE  uspGetAllEventThumbnails


GO



-- gets thumbnail for every event in order of date with most upcoming event first. past events are not included
CREATE PROCEDURE uspGetAllEventThumbnails
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @intEventID INT;

    
    DECLARE event_cursor CURSOR FOR
    SELECT intEventID
    FROM TEvents
	WHERE intStatusID = 1
    ORDER BY dtDateOfEvent ASC;  

    
    OPEN event_cursor;
    FETCH NEXT FROM event_cursor INTO @intEventID;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        
        EXEC dbo.uspGetEventThumbnail @intEventID;

        
        FETCH NEXT FROM event_cursor INTO @intEventID;
    END;

  
    CLOSE event_cursor;
    DEALLOCATE event_cursor;
END;

GO