
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

IF OBJECT_ID('uspOrganizerMostProfitableEvent') IS NOT NULL DROP PROCEDURE  uspOrganizerMostProfitableEvent

GO

CREATE PROCEDURE uspOrganizerMostProfitableEvent
    @intOrganizerID INT
AS
BEGIN
    SET NOCOUNT ON

    SELECT
        strEventName, monTotalRevenue
    FROM
        TEvents
    WHERE
        intOrganizerId = @intOrganizerID
        AND monTotalRevenue = (
            SELECT
                MAX(monTotalRevenue)
            FROM
                TEvents
            WHERE
                intOrganizerId = @intOrganizerID
            )

END;

GO
