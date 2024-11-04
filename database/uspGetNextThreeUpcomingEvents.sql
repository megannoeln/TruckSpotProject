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

IF OBJECT_ID( 'uspGetNextThreeUpcomingEvents') IS NOT NULL DROP PROCEDURE  uspGetNextThreeUpcomingEvents



GO

-- NEXT 3 UPCOMING EVENTS THUMBNAILS
CREATE PROCEDURE uspGetNextThreeUpcomingEvents
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @intEventID INT;

    
    DECLARE event_cursor CURSOR FOR
    SELECT TOP 3 intEventID
    FROM TEvents
    WHERE dtDateOfEvent >= GETDATE()
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


EXEC uspGetNextThreeUpcomingEvents