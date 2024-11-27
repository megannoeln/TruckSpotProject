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

IF OBJECT_ID('uspAverageRevenueForOrganizer') IS NOT NULL DROP PROCEDURE  uspAverageRevenueForOrganizer

GO

CREATE PROCEDURE uspAverageRevenueForOrganizer
    @intOrganizerID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        AVG(monTotalRevenue)
    FROM
        TEvents
    WHERE
        intOrganizerID = @intOrganizerID
END;

GO
