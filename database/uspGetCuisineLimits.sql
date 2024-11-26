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

IF OBJECT_ID( 'uspGetCuisineLimits') IS NOT NULL DROP PROCEDURE  uspGetCuisineLimits

GO

-- gets list of cuisine limits for specific event
CREATE PROCEDURE uspGetCuisineLimits
    @intEventID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        TCuisineTypes.strCuisineType AS CuisineType,
        TEventCuisines.intLimit AS Limit,
        TEventCuisines.intAvailable AS Available
    FROM 
        TEventCuisines
    INNER JOIN 
        TEvents ON TEventCuisines.intEventID = TEvents.intEventID
    INNER JOIN 
        TCuisineTypes ON TEventCuisines.intCuisineTypeID = TCuisineTypes.intCuisineTypeID
    WHERE 
        TEvents.intEventID = @intEventID;
END;
GO

--exec uspGetCuisineLimits 1
