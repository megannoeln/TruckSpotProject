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

IF OBJECT_ID( 'uspReserveSpace') IS NOT NULL DROP PROCEDURE  uspReserveSpace

GO

CREATE PROCEDURE uspReserveSpace
    @intVendorID AS INT,
    @intEventID AS INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @intReservationID INT
    DECLARE @intPaymentID INT
    DECLARE @intFoodTruckEventID INT
    DECLARE @monPricePerSpace MONEY
    DECLARE @intFoodTruckID INT
    DECLARE @intEventSpaceID INT


    BEGIN TRANSACTION;

    BEGIN TRY

        SELECT @intEventSpaceID = MIN(intEventSpaceID)
        FROM TEventSpaces
        WHERE intEventID = @intEventID
            AND boolIsAvailable = 1

        SELECT @monPricePerSpace = TEvents.monPricePerSpace
        FROM TEventSpaces
        INNER JOIN TEvents ON TEventSpaces.intEventID = TEvents.intEventID
        WHERE TEventSpaces.intEventSpaceID = @intEventSpaceID

        SELECT @intFoodTruckID = TFoodTrucks.intFoodTruckID
        FROM TVendors
        INNER JOIN TFoodTrucks ON TVendors.intVendorID = TFoodTrucks.intVendorID
        WHERE TVendors.intVendorID = @intVendorID

        IF EXISTS (
                SELECT 1
                FROM TReservations
                INNER JOIN TEventSpaces ON TReservations.intEventSpaceID = TEventSpaces.intEventSpaceID
                WHERE TEventSpaces.intEventID = @intEventID
                      AND TReservations.intFoodTruckID IN (
                        SELECT TFoodTrucks.intFoodTruckID
                        FROM TFoodTrucks
                        WHERE TFoodTrucks.intVendorID = @intVendorID
                        )
        )
        BEGIN
           RAISERROR ('Vendor already has a reservation for this event.', 16, 1);
        END;

        IF NOT EXISTS (
           SELECT 1
           FROM TEventCuisines
           WHERE intEventID = @intEventID
                 AND intCuisineTypeID = (
                     SELECT intCuisineTypeID
                     FROM TFoodTrucks
                     WHERE intFoodTruckID = @intFoodTruckID
                    )
        )
        BEGIN
            RAISERROR ('Food truck cuisine does not match the preferred type for this event.', 16, 1);
        END;

        INSERT INTO TReservations (intEventSpaceID, intFoodTruckID, dtReservationDate, intStatusID)
        VALUES (@intEventSpaceID, @intFoodTruckID, GETDATE(), 1);
        SET @intReservationID = SCOPE_IDENTITY();

        INSERT INTO TPayments (intReservationID, monAmountPaid, dtPaymentDate)
        VALUES (@intReservationID, @monPricePerSpace, GETDATE());
        SET @intPaymentID = SCOPE_IDENTITY();

        INSERT INTO TFoodTruckEvents (intEventID, intFoodTruckID)
        VALUES (@intEventID, @intFoodTruckID);
        SET @intFoodTruckEventID = SCOPE_IDENTITY();

        UPDATE TEvents
        SET intAvailableSpaces = intAvailableSpaces - 1,
            monTotalRevenue =  ISNULL(monTotalRevenue, 0) + @monPricePerSpace
        WHERE intEventID = @intEventID;

        UPDATE TEventSpaces
        SET boolIsAvailable = 0
        WHERE intEventSpaceID = @intEventSpaceID;

        UPDATE TEventCuisines
        SET intAvailable = intAvailable - 1
        WHERE intEventID = @intEventID
              AND intCuisineTypeID = (
                  SELECT intCuisineTypeID
                  FROM TFoodTrucks
                  WHERE intFoodTruckID = @intFoodTruckID
                )

    COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
        THROW;
        ROLLBACK TRANSACTION;
    END CATCH
END;
GO
