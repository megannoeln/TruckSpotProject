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

IF OBJECT_ID( 'uspAddCuisineLimit') IS NOT NULL DROP PROCEDURE  uspAddCuisineLimit

GO

-- adds a limit for a type of cuisine at a specific event
CREATE PROCEDURE uspAddCuisineLimit
    @intEventID INT,
    @intCuisineTypeID INT,
    @intLimit INT
AS
BEGIN
    DECLARE @TotalExistingLimits INT;
    DECLARE @EventAvailableSpaces INT;

    -- get totaL available spaces for event
    SELECT @EventAvailableSpaces = intAvailableSpaces
    FROM TEvents
    WHERE intEventID = @intEventID;

    -- total their existing limits
    SELECT @TotalExistingLimits = ISNULL(SUM(intLimit), 0)
    FROM TEventCuisines
    WHERE intEventID = @intEventID;

   -- error if new limit exceeds available spaces
    IF (@TotalExistingLimits + @intLimit) > @EventAvailableSpaces
    BEGIN
        RAISERROR ('Adding this limit would exceed the available spaces for this event.', 16, 1);
        RETURN;
    END

    -- check if they already set a limit
    IF EXISTS (SELECT 1 FROM TEventCuisines WHERE intEventID = @intEventID AND intCuisineTypeID = @intCuisineTypeID)
    BEGIN
        -- update the limit if it does exist
        UPDATE TEventCuisines
        SET intLimit = @intLimit, intAvailable = @intLimit
        WHERE intEventID = @intEventID AND intCuisineTypeID = @intCuisineTypeID;
    END
    ELSE
    BEGIN
        -- insert new record for limit if it doesnt exist 
        INSERT INTO TEventCuisines (intEventID, intCuisineTypeID, intLimit, intAvailable)
        VALUES (@intEventID, @intCuisineTypeID, @intLimit, @intLimit);
    END
END;

GO

