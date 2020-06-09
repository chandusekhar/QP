IF NOT EXISTS (  SELECT * FROM sys.columns WHERE  object_id = OBJECT_ID(N'[dbo].[ITEM_TO_ITEM]') AND name = 'IS_REV')
	ALTER TABLE [dbo].[ITEM_TO_ITEM] ADD [IS_REV] [bit] NOT NULL DEFAULT ((0))
GO

IF NOT EXISTS (  SELECT * FROM sys.columns WHERE  object_id = OBJECT_ID(N'[dbo].[ITEM_TO_ITEM]') AND name = 'IS_SELF')
	ALTER TABLE [dbo].[ITEM_TO_ITEM] ADD [IS_SELF] [bit] NOT NULL DEFAULT ((0))
GO
