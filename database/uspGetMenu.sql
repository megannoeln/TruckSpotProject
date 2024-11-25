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

IF OBJECT_ID( 'uspGetMenu') IS NOT NULL DROP PROCEDURE  uspGetMenu

GO

-- gets a menu for a specific vendor
CREATE PROCEDURE uspGetMenu
    @intVendorID INT       
              
AS
BEGIN
    
    DECLARE @intFoodTruckID INT;

 
    SELECT @intFoodTruckID = intFoodTruckID
    FROM TFoodTrucks
    WHERE intVendorID = @intVendorID;

   
    IF @intFoodTruckID IS NOT NULL
    BEGIN
        
		SELECT 
            TMenus.intFoodTruckID,
            TMenus.strItem,
            TMenus.monPrice,
            TMenus.intUnitsSold,
            TMenuCategories.strCategory
        FROM 
            TMenus
        JOIN 
            TMenuCategories
        ON 
            TMenus.intMenuCategoryID = TMenuCategories.intMenuCategoryID
        WHERE 
            TMenus.intFoodTruckID = @intFoodTruckID;

    END
    ELSE
    BEGIN
        PRINT 'No menu found for this vendor.';
    END
END;
GO

GO

--exec uspGetMenu 1

