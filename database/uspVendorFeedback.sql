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

IF OBJECT_ID( 'uspVendorFeedback') IS NOT NULL DROP PROCEDURE  uspVendorFeedback

GO

-- adds feedback for a past event for a vendor
CREATE PROCEDURE uspVendorFeedback
    @intVendorID INT,
    @intEventID INT,
    @monTotalRevenue MONEY = NULL,
    @intRating INT = NULL,
    @strVendorComment VARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;


    DECLARE @FoodTruckID INT;

 
    SELECT @FoodTruckID = intFoodTruckID
    FROM TFoodTrucks
    WHERE intVendorID = @intVendorID;


    IF @FoodTruckID IS NULL
    BEGIN
        PRINT 'No food truck found for the given Vendor.';
        RETURN;
    END

  
    UPDATE TFoodTruckEvents
    SET
        monTotalRevenue = ISNULL(@monTotalRevenue, monTotalRevenue),
        intRating = ISNULL(@intRating, intRating),
        strVendorComment = ISNULL(@strVendorComment, strVendorComment)
    WHERE intFoodTruckID = @FoodTruckID AND intEventID = @intEventID;

    IF @@ROWCOUNT = 0
    BEGIN
        PRINT 'No record updated. Please check the VendorID and EventID combination.';
    END
    ELSE
    BEGIN
        PRINT 'Record updated successfully.';
    END
END;

GO



