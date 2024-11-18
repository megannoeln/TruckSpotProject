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

IF OBJECT_ID( 'uspDeleteReservation') IS NOT NULL DROP PROCEDURE  uspDeleteReservation

GO

-- cancels a reservation
CREATE PROCEDURE uspDeleteReservation
    @intVendorID INT,
    @intEventID INT
AS
BEGIN
    
    DECLARE @DeletedEventSpaces TABLE (intEventSpaceID INT);

   
    DELETE FROM TReservations
    OUTPUT DELETED.intEventSpaceID INTO @DeletedEventSpaces
    WHERE intFoodTruckID IN (
        SELECT intFoodTruckID
        FROM TFoodTrucks
        WHERE intVendorID = @intVendorID
    )
    AND intEventSpaceID IN (
        SELECT intEventSpaceID
        FROM TEventSpaces
        WHERE intEventID = @intEventID
    );

    
    IF EXISTS (SELECT 1 FROM @DeletedEventSpaces)
    BEGIN
        UPDATE TEventSpaces
        SET boolIsAvailable = 1
        WHERE intEventSpaceID IN (SELECT intEventSpaceID FROM @DeletedEventSpaces);

        PRINT 'Reservation deleted.';
    END
    ELSE
    BEGIN
        PRINT 'No reservation found for the given Vendor and Event.';
    END
END;

GO 

