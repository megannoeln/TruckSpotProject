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

IF OBJECT_ID( 'uspAddMenuItem') IS NOT NULL DROP PROCEDURE  uspAddMenuItem

GO

-- adds a menu item
CREATE PROCEDURE uspAddMenuItem
    @intVendorID INT,   
	@intMenuCategoryID INT,
    @strItem VARCHAR(255),     
    @monPrice MONEY                
AS
BEGIN
    
    DECLARE @intFoodTruckID INT;

 
    SELECT @intFoodTruckID = intFoodTruckID
    FROM TFoodTrucks
    WHERE intVendorID = @intVendorID;

   
    IF @intFoodTruckID IS NOT NULL
    BEGIN
        
        INSERT INTO TMenus (intFoodTruckID, intMenuCategoryID, strItem, monPrice, intUnitsSold)
        VALUES (@intFoodTruckID, @intMenuCategoryID, @strItem, @monPrice, 0);

        PRINT 'Menu item added successfully.';
    END
    ELSE
    BEGIN
        PRINT 'No food truck found for the given Vendor ID.';
    END
END;
GO

GO