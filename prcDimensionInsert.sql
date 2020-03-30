-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		

-- =============================================
CREATE PROCEDURE [dbo].[prcDimensionInsert]
	 @DataMartID INT,
	 @Name NVARCHAR(65)
AS
BEGIN
	SET NOCOUNT ON;
	
	--Insert new Dimension
	INSERT INTO dbo.Dimension
	        ( DataMartID,
			  [Name])
	VALUES  (@DataMartID, @Name)
	      
	    
	     
	
	--Return Identity
	SELECT CAST(SCOPE_IDENTITY() AS INT) AS LAST_IDENTITY
END

GO

