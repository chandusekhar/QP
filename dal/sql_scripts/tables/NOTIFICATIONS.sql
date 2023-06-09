if not exists(select * from INFORMATION_SCHEMA.COLUMNS where COLUMN_NAME = 'TEMPLATE_ID' and TABLE_NAME = 'NOTIFICATIONS')
    alter table [NOTIFICATIONS]
    add [TEMPLATE_ID] numeric(18,0) NULL

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where COLUMN_NAME = 'HIDE_RECIPIENTS' and TABLE_NAME = 'NOTIFICATIONS')
    alter table [NOTIFICATIONS] add [HIDE_RECIPIENTS] BIT NOT NULL DEFAULT 0

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where COLUMN_NAME = 'USE_EMAIL_FROM_CONTENT' and TABLE_NAME = 'NOTIFICATIONS')
    alter table [NOTIFICATIONS] add [USE_EMAIL_FROM_CONTENT] BIT NOT NULL DEFAULT 0

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where COLUMN_NAME = 'CATEGORY_ATTRIBUTE_ID' and TABLE_NAME = 'NOTIFICATIONS')
    alter table [NOTIFICATIONS] add CATEGORY_ATTRIBUTE_ID NUMERIC(18,0) CONSTRAINT FK_CATEGORY_ATTRIBUTE_ID FOREIGN KEY (CATEGORY_ATTRIBUTE_ID) REFERENCES CONTENT_ATTRIBUTE(ATTRIBUTE_ID)

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where COLUMN_NAME = 'CONFIRMATION_TEMPLATE_ID' and TABLE_NAME = 'NOTIFICATIONS')
    alter table [NOTIFICATIONS]
    add [CONFIRMATION_TEMPLATE_ID] numeric(18,0) NULL
