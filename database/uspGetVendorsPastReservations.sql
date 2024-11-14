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

IF OBJECT_ID( 'uspGetVendorsPastReservations') IS NOT NULL DROP PROCEDURE  uspGetVendorsPastReservations



GO

--gets all past reservations for a specific vendor
CREATE PROCEDURE uspGetVendorsPastReservations
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
        AND TEvents.dtDateOfEvent <= GETDATE() 
    ORDER BY 
        TEvents.dtDateOfEvent DESC; 

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


--EXECUTE uspGetVendorsPastReservations 1