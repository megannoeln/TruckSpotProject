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

IF OBJECT_ID('uspUpcomingEventsOrg') IS NOT NULL DROP PROCEDURE  uspUpcomingEventsOrg

GO

CREATE PROCEDURE uspUpcomingEventsOrg
    @intOrganizerID INT 
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        TEvents.strEventName as EventName,
         ISNULL(TEvents.monTotalRevenue, 0) AS TotalRevenue,
         ISNULL(COUNT(DISTINCT TFoodTruckEvents.intFoodTruckID), 0) as VendorCount,
        TEvents.dtDateOfEvent as EventDate
    FROM 
        TEvents
    LEFT JOIN 
        TFoodTruckEvents ON TEvents.intEventID = TFoodTruckEvents.intEventID
    WHERE 
        TEvents.intOrganizerID = @intOrganizerID
        AND TEvents.dtDateOfEvent >= GETDATE() 
    GROUP BY 
        TEvents.strEventName,
        TEvents.monTotalRevenue,
        TEvents.dtDateOfEvent
ORDER BY 
        TEvents.dtDateOfEvent ASC;
END;

GO