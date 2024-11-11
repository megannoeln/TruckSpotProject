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

IF OBJECT_ID( 'uspGetVendorsUpcomingReservations') IS NOT NULL DROP PROCEDURE  uspGetVendorsUpcomingReservations



GO

CREATE PROCEDURE uspGetVendorsUpcomingReservations
    @intVendorID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @intEventID INT;

    
    DECLARE eventCursor CURSOR FOR
    SELECT 
        TEvents.intEventID
    FROM 
        TVendors
        JOIN TFoodTrucks ON TVendors.intVendorID = TFoodTrucks.intVendorID
        JOIN TFoodTruckEvents ON TFoodTrucks.intFoodTruckID = TFoodTruckEvents.intFoodTruckID
        JOIN TEvents ON TEvents.intEventID = TFoodTruckEvents.intEventID
    WHERE 
        TVendors.intVendorID = @intVendorID
        AND TEvents.dtDateOfEvent > GETDATE() 
    ORDER BY 
        TEvents.dtDateOfEvent; 

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

--EXECUTE uspGetVendorsUpcomingReservations 1