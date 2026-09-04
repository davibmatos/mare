-- Modelo inicial do Mar(é) para PostgreSQL.
-- As observações comunitárias permanecem separadas das publicações oficiais.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('admin', 'student');
CREATE TYPE record_visibility AS ENUM ('private', 'school', 'community');
CREATE TYPE bathing_status AS ENUM ('suitable', 'unsuitable', 'unknown');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  city VARCHAR(120) NOT NULL,
  state CHAR(2) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  city VARCHAR(120) NOT NULL,
  state CHAR(2) NOT NULL,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bathing_water_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id),
  status bathing_status NOT NULL,
  source_name VARCHAR(255) NOT NULL,
  source_url TEXT,
  sampling_point VARCHAR(255) NOT NULL,
  sampled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_payload JSONB,
  UNIQUE(location_id, source_name, sampling_point, published_at)
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  school_id UUID REFERENCES schools(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  modality VARCHAR(100) NOT NULL,
  activity_date DATE NOT NULL,
  started_at TIME,
  duration_minutes INTEGER CHECK (duration_minutes > 0 AND duration_minutes <= 1440),
  sea_condition VARCHAR(80),
  safety_perception SMALLINT CHECK (safety_perception BETWEEN 1 AND 5),
  notes TEXT,
  visibility record_visibility NOT NULL DEFAULT 'school',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE environmental_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  found_trash BOOLEAN NOT NULL DEFAULT FALSE,
  trash_categories TEXT[] NOT NULL DEFAULT '{}',
  approximate_quantity VARCHAR(60),
  water_color VARCHAR(80),
  odor VARCHAR(120),
  comment TEXT,
  moderation moderation_status NOT NULL DEFAULT 'pending',
  moderated_by UUID REFERENCES users(id),
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE observation_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id UUID NOT NULL REFERENCES environmental_observations(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  author_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_user_date ON activities(user_id, activity_date DESC);
CREATE INDEX idx_activities_location_date ON activities(location_id, activity_date DESC);
CREATE INDEX idx_reports_location_publication ON bathing_water_reports(location_id, published_at DESC);
CREATE INDEX idx_observations_location_date ON environmental_observations(location_id, created_at DESC);
CREATE INDEX idx_observations_moderation ON environmental_observations(moderation, created_at);
