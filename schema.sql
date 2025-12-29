-- Cloudflare D1 Database Schema for Wedding RSVP
-- This is a SQLite database hosted on Cloudflare's edge network

-- RSVP responses table
CREATE TABLE IF NOT EXISTS rsvp_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    attending TEXT NOT NULL CHECK (attending IN ('Yes', 'No')),
    guests INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_hash TEXT,
    user_agent TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at ON rsvp_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_rsvp_attending ON rsvp_responses(attending);

-- Optional: Analytics table for tracking page views
CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    lang TEXT NOT NULL DEFAULT 'en',
    referrer TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
