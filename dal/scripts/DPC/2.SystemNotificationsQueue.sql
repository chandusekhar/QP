exec qp_drop_existing 'SYSTEM_NOTIFICATION_QUEUE', 'IsUserTable'
GO


CREATE TABLE [dbo].[SYSTEM_NOTIFICATION_QUEUE](
	[ID] numeric(18, 0) IDENTITY(1,1) NOT NULL,
	[TRANSACTION_DATE] DATETIME NOT NULL,
	[EVENT] nvarchar(25) NULL,
	[TYPE] nvarchar(25) NULL,
	[URL] nvarchar(1024) NOT NULL,
	[TRIES] numeric(18, 0) NOT NULL,
	[JSON] nvarchar(max),
	[SENT] bit NOT NULL,
	[CREATED] datetime NOT NULL,
	[MODIFIED] datetime NOT NULL
PRIMARY KEY CLUSTERED
(
	[ID] ASC
)
)

GO

ALTER TABLE [dbo].[SYSTEM_NOTIFICATION_QUEUE] ADD  CONSTRAINT [DF_SYSTEM_NOTIFICATION_QUEUE_CREATED]  DEFAULT (getdate()) FOR [CREATED]
GO

ALTER TABLE [dbo].[SYSTEM_NOTIFICATION_QUEUE] ADD  CONSTRAINT [DF_SYSTEM_NOTIFICATION_QUEUE_TRIES]  DEFAULT ((0)) FOR [TRIES]
GO

ALTER TABLE [dbo].[SYSTEM_NOTIFICATION_QUEUE] ADD  CONSTRAINT [DF_SYSTEM_NOTIFICATION_QUEUE_SENT]  DEFAULT ((0)) FOR [SENT]
GO

ALTER TABLE [dbo].[SYSTEM_NOTIFICATION_QUEUE] ADD  CONSTRAINT [DF_SYSTEM_NOTIFICATION_QUEUE_MODIFIED]  DEFAULT (getdate()) FOR [MODIFIED]
GO
