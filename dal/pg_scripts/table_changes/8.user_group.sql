ALTER TABLE user_group ADD COLUMN IF NOT EXISTS can_manage_scheduled_tasks boolean NOT NULL DEFAULT false;
