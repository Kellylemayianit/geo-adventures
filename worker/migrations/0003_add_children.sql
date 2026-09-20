-- Adds child-traveller capture to bookings, since some camps have age-specific rules.
-- Run: wrangler d1 execute geo-adventures-db --file=./migrations/0003_add_children.sql --remote

ALTER TABLE bookings ADD COLUMN children INTEGER NOT NULL DEFAULT 0;
ALTER TABLE bookings ADD COLUMN children_details TEXT; -- JSON array of {name, age}
