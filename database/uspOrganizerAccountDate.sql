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

IF OBJECT_ID('uspOrganizerAccountDate') IS NOT NULL DROP PROCEDURE  uspOrganizerAccountDate

GO

CREATE PROCEDURE uspOrganizerAccountDate
    @intOrganizerID INT
AS
BEGIN
    SET NOCOUNT ON;

	select dtDateCreated as AccountDate
	from TOrganizers
	where intOrganizerID = @intOrganizerID

END;

GO

--exec uspOrganizerAccountDate 1
