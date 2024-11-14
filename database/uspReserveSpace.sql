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
USE dbtruckspot;

--USE dbTruckSpot;

SET NOCOUNT ON;

-- --------------------------------------------------------------------------------
-- Drop
-- --------------------------------------------------------------------------------

GO

CREATE PROCEDURE uspReserveSpace
    @intReservationID AS INT OUTPUT,
    @intPaymentID AS INT OUTPUT,
    @intFoodTruckEventID AS INT OUTPUT,
    @monPricePerSpace MONEY OUTPUT,
    @intEventSpaceID AS INT,
    @intFoodTruckID AS INT,
    @intEventID AS INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    BEGIN TRY

        SELECT @monPricePerSpace = TEvents.monPricePerSpace
        FROM TEventSpaces
        INNER JOIN TEvents ON TEventSpaces.intEventID = TEvents.intEventID
        WHERE TEventSpaces.intEventSpaceID = @intEventSpaceID

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

    COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
          ROLLBACK TRANSACTION;
          THROW;
    END CATCH
END;
GO
