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


--CREATE TABLE [dbo].[DataMart](
--	[DataMartID] [int] IDENTITY(1,1) NOT NULL,
--	[Name] [varchar](55) NOT NULL,
-- CONSTRAINT [PK_DataMart] PRIMARY KEY CLUSTERED 
--(
--	[DataMartID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
--) ON [PRIMARY]
--GO




-- =============================================
-- Author:		Name
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE spBuildDimensionTable 
	@TableName NVARCHAR(128) 
	,@DataMartID INT
	,@Columns NVARCHAR(MAX)
AS
BEGIN
	
	SET NOCOUNT ON;
	DECLARE @ColumnName NVARCHAR(MAX)
	DECLARE @SQLString NVARCHAR(MAX)
	SET @SQLString = 'CREATE TABLE ' + @TableName + '( ' + @TableName +'ID INT PRIMARY KEY IDENTITY, '

	DECLARE ccLoop CURSOR FAST_FORWARD FOR
		SELECT value FROM STRING_SPLIT(@Columns,',')
	OPEN ccLoop
	FETCH next FROM ccLoop INTO @ColumnName

	WHILE @@FETCH_STATUS = 0
	BEGIN
		EXEC prcDimensionInsert @DataMartID, @ColumnName
		SET @SQLString = @SQLString + ' ' + @ColumnName + ' NVARCHAR(MAX), '

		FETCH NEXT FROM ccLoop INTO @ColumnName
	END

	SET @SQLString = @SQLString + ')'
	EXEC (@SQLString)
	DEALLOCATE ccLoop


	
END
GO
