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

IF OBJECT_ID( 'uspGetFoodTruckThumbnail') IS NOT NULL DROP PROCEDURE uspGetFoodTruckThumbnail



GO

-- GET FOODTRUCK THUMBNAIL
-- for displaying the little thumbnails for foodtrucks
CREATE PROCEDURE uspGetFoodTruckThumbnail
    @intFoodTruckID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        TFoodTrucks.intFoodTruckID,
        TFoodTrucks.strTruckName,
		TFoodTrucks.strLogoFilePath,
		TCuisineTypes.strCuisineType

    FROM 
        TFoodTrucks 
		join TCuisineTypes on TCuisineTypes.intCuisineTypeID = TFoodTrucks.intCuisineTypeID
    WHERE 
        intFoodTruckID = @intFoodTruckID;
END;

GO

--EXECUTE uspGetFoodTruckThumbnail 1