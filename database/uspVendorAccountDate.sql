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

IF OBJECT_ID('uspVendorAccountDate') IS NOT NULL DROP PROCEDURE  uspVendorAccountDate

GO

CREATE PROCEDURE uspVendorAccountDate
    @intVendorID INT
AS
BEGIN
    SET NOCOUNT ON;

	select dtDateCreated as AccountDate
	from TVendors
	where intVendorID = @intVendorID
END;

GO



