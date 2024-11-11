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

IF OBJECT_ID( 'uspGetReservedFoodTrucks') IS NOT NULL DROP PROCEDURE uspGetReservedFoodTrucks



GO

-- GET RESERVED FOODTRUCKS
-- gets a thumbnail for every foodtruck reserved for a specific event
CREATE PROCEDURE uspGetReservedFoodTrucks
    @intEventID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @intFoodTruckID INT;


    DECLARE foodTruckCursor CURSOR FOR
    SELECT intFoodTruckID
    FROM TFoodTruckEvents
    WHERE intEventID = @intEventID;

    OPEN foodTruckCursor;
    FETCH NEXT FROM foodTruckCursor INTO @intFoodTruckID;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- execute the uspGetFoodTruckThumbnail procedure for each food truck
        EXEC dbo.uspGetFoodTruckThumbnail @intFoodTruckID;
        
        FETCH NEXT FROM foodTruckCursor INTO @intFoodTruckID;
    END;

    CLOSE foodTruckCursor;
    DEALLOCATE foodTruckCursor;
END;
GO

--EXECUTE uspGetReservedFoodTrucks 4