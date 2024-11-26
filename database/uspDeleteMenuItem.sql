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

IF OBJECT_ID( 'uspDeleteMenuItem') IS NOT NULL DROP PROCEDURE  uspDeleteMenuItem

GO

CREATE PROCEDURE uspDeleteMenuItem
    @intVendorID INT,
    @strItem VARCHAR(255) 
AS
BEGIN
    SET NOCOUNT ON;


    DECLARE @intFoodTruckID INT;

   
    SELECT @intFoodTruckID = intFoodTruckID
    FROM TFoodTrucks
    WHERE intVendorID = @intVendorID;

  
    IF @intFoodTruckID IS NOT NULL
    BEGIN
      
        DELETE FROM TMenus 
        WHERE intFoodTruckID = @intFoodTruckID 
          AND strItem = @strItem;

      
        PRINT 'Menu item deleted successfully.';
    END
    ELSE
    BEGIN
      
        PRINT 'No food truck found for the given vendor ID.';
        RETURN;
    END
END;
GO


--select * from TMenus

--exec uspDeleteMenuItem 1, test

--select * from TMenus