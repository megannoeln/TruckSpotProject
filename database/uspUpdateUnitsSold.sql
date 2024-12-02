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

IF OBJECT_ID('uspUpdateUnitsSold') IS NOT NULL DROP PROCEDURE  uspUpdateUnitsSold

GO

CREATE PROCEDURE uspUpdateUnitsSold
    @intVendorID INT,
	@strItem NVARCHAR(255),
    @intUnitsSold INT
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


	UPDATE TMenus
    SET 
        intUnitsSold = intUnitsSold + @intUnitsSold
    WHERE 
        intFoodTruckID = @intFoodTruckID
        AND strItem = @strItem;

END;


GO