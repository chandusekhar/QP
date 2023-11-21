if not exists(select * from INFORMATION_SCHEMA.COLUMNS where COLUMN_NAME = 'ID' and TABLE_NAME = 'NOTIFICATIONS_SENT')
    alter table NOTIFICATIONS_SENT
    add ID int NOT NULL IDENTITY(1,1)

IF EXISTS(SELECT * FROM information_schema.table_constraints WHERE CONSTRAINT_NAME = 'PK_NOTIFICATIONS_SENT')
    ALTER TABLE [NOTIFICATIONS_SENT] DROP CONSTRAINT PK_NOTIFICATIONS_SENT

ALTER TABLE [NOTIFICATIONS_SENT] ADD CONSTRAINT PK_NOTIFICATIONS_SENT PRIMARY KEY(ID)
