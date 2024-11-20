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

IF OBJECT_ID( 'uspOrganizerFeedback') IS NOT NULL DROP PROCEDURE  uspOrganizerFeedback

GO

-- adds feedback for a past event for an organizer
CREATE PROCEDURE uspOrganizerFeedback
    @intOrganizerID INT,
    @intEventID INT,
    @monTotalRevenue MONEY
AS
BEGIN
    SET NOCOUNT ON;

    
    UPDATE TEvents
    SET monTotalRevenue = ISNULL(monTotalRevenue, 0) + @monTotalRevenue
    WHERE intOrganizerID = @intOrganizerID AND intEventID = @intEventID;

    
    IF @@ROWCOUNT = 0
    BEGIN
        PRINT 'No record updated. Please check the OrganizerID and EventID combination.';
    END
    ELSE
    BEGIN
        PRINT 'Event revenue updated successfully.';
    END
END;
GO