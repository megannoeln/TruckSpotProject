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

IF OBJECT_ID( 'uspGetOrganizersUpcomingEvents') IS NOT NULL DROP PROCEDURE  uspGetOrganizersUpcomingEvents



GO

--gets all upcoming reservations for a specific organizer
CREATE PROCEDURE uspGetOrganizersUpcomingEvents
    @intOrganizerID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @intEventID INT;

    
    DECLARE eventCursor CURSOR FOR
    SELECT 
        TEvents.intEventID
    FROM 
        TOrganizers
        JOIN TEvents ON TOrganizers.intOrganizerID = TEvents.intOrganizerID
    WHERE 
        TOrganizers.intOrganizerID = @intOrganizerID
        AND TEvents.dtDateOfEvent > GETDATE()
    ORDER BY 
        TEvents.dtDateOfEvent ASC;

    OPEN eventCursor;
    FETCH NEXT FROM eventCursor INTO @intEventID;

    WHILE @@FETCH_STATUS = 0
    BEGIN
       
        EXEC dbo.uspGetEventThumbnail @intEventID;
        
        FETCH NEXT FROM eventCursor INTO @intEventID;
    END;

    CLOSE eventCursor;
    DEALLOCATE eventCursor;
END;
GO


--EXECUTE uspGetOrganizersUpcomingEvents 1