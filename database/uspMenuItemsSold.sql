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

IF OBJECT_ID('uspMenuItemsSold') IS NOT NULL DROP PROCEDURE  uspMenuItemsSold

GO

CREATE PROCEDURE uspMenuItemsSold
    @intVendorID INT
AS
BEGIN
    SET NOCOUNT ON;


    DECLARE @intFoodTruckID INT;

   
    SELECT 
        @intFoodTruckID = TFoodTrucks.intFoodTruckID
    FROM 
        TFoodTrucks
    WHERE 
        TFoodTrucks.intVendorID = @intVendorID;

    
    SELECT 
        TMenus.strItem AS Item,
        TMenus.intUnitsSold AS UnitsSold
    FROM 
        TMenus 
    WHERE 
        TMenus.intFoodTruckID = @intFoodTruckID
		ORDER BY UnitsSold desc;

END;


GO