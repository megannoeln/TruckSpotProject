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

SET NOCOUNT ON;

-- --------------------------------------------------------------------------------
-- Drop
-- --------------------------------------------------------------------------------

IF OBJECT_ID('uspUpcomingEventsVendor') IS NOT NULL DROP PROCEDURE  uspUpcomingEventsVendor

GO

CREATE PROCEDURE uspUpcomingEventsVendor
    @intVendorID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        TEvents.strEventName AS EventName,
        ISNULL(COUNT(DISTINCT TFoodTruckEvents.intFoodTruckID), 0) AS VendorCount,
        TEvents.intExpectedGuests AS ExpectedGuestCount,
        TEvents.dtDateOfEvent AS EventDate
    FROM 
        TEvents
    LEFT JOIN 
        TFoodTruckEvents ON TEvents.intEventID = TFoodTruckEvents.intEventID
    INNER JOIN 
        TFoodTrucks ON TFoodTruckEvents.intFoodTruckID = TFoodTrucks.intFoodTruckID
    WHERE 
        TFoodTrucks.intVendorID = @intVendorID
        AND TEvents.dtDateOfEvent >= GETDATE()
    GROUP BY 
        TEvents.strEventName,
        TEvents.intExpectedGuests,
        TEvents.dtDateOfEvent
    ORDER BY 
        TEvents.dtDateOfEvent ASC;
END;

GO

--exec uspUpcomingEventsVendor 1