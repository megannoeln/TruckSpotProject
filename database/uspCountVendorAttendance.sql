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

IF OBJECT_ID( 'uspCountVendorAttendance') IS NOT NULL DROP PROCEDURE  uspCountVendorAttendance

GO

-- adds a limit for a type of cuisine at a specific event
CREATE PROCEDURE uspCountVendorAttendance
    @intOrganizerID INT,  
    @intVendorID INT      
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        COUNT(*) AS AttendanceCount
    FROM 
        TFoodTruckEvents
    INNER JOIN 
        TEvents ON TFoodTruckEvents.intEventID = TEvents.intEventID
    INNER JOIN 
        TOrganizers ON TEvents.intOrganizerID = TOrganizers.intOrganizerID
    INNER JOIN 
        TFoodTrucks ON TFoodTruckEvents.intFoodTruckID = TFoodTrucks.intFoodTruckID
    INNER JOIN 
        TVendors ON TFoodTrucks.intVendorID = TVendors.intVendorID
    WHERE 
        TOrganizers.intOrganizerID = @intOrganizerID
        AND TVendors.intVendorID = @intVendorID;
END;

GO

-- exec uspCountVendorAttendance 1, 1
