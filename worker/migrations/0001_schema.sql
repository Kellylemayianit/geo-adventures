-- Geo Adventures Kenya — D1 schema
-- Run: wrangler d1 execute geo-adventures-db --file=./migrations/0001_schema.sql --remote

CREATE TABLE IF NOT EXISTS destinations (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  region TEXT,
  tagline TEXT,
  description TEXT,
  image TEXT,
  activities TEXT,        -- JSON array, e.g. ["Game drives","Kilimanjaro viewpoints"]
  best_for TEXT,
  price_from_kes INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS stay_tiers (
  id TEXT PRIMARY KEY,          -- 'budget' | 'midrange' | 'luxury'
  label TEXT NOT NULL,
  price_per_night_kes INTEGER NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS transport_options (
  id TEXT PRIMARY KEY,          -- 'saloon' | '4x4' | 'motorbike' | 'tuktuk'
  label TEXT NOT NULL,
  price_per_day_kes INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  icon TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  class_label TEXT,
  days INTEGER NOT NULL,
  destination_ids TEXT NOT NULL,   -- JSON array of destination ids
  stay_tier TEXT NOT NULL,
  transport_id TEXT NOT NULL,
  price_per_person_kes INTEGER NOT NULL,
  image TEXT,
  summary TEXT,
  highlights TEXT,                 -- JSON array of strings
  itinerary TEXT                   -- JSON array of {day,title,text}
);

CREATE TABLE IF NOT EXISTS team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  image TEXT
);

CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  date TEXT,
  excerpt TEXT,
  image TEXT,
  body TEXT
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',   -- 'client' | 'admin'
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  user_id TEXT,                    -- nullable: guest bookings allowed
  type TEXT NOT NULL,              -- 'package' | 'custom'
  title TEXT NOT NULL,
  package_id TEXT,
  destination_ids TEXT,            -- JSON array, custom bookings only
  stay_tier TEXT,
  transport_id TEXT,
  travelers INTEGER NOT NULL DEFAULT 1,
  days INTEGER,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  date TEXT,
  total_kes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'confirmed' | 'cancelled'
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
