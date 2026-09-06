-- Raja Enterprises — production schema (Neon PostgreSQL)
--
-- Shaped by the migration plan reviewed before implementation. Two rules run
-- through it:
--
--   Business entities are relational. Projects, clients, media, capacity and
--   enquiries carry foreign keys, because they have real relationships and
--   losing one silently is expensive.
--
--   Editorial content stays JSONB. Nineteen collections already share one
--   generic admin editor at row counts in the single digits; giving each its
--   own table would buy nothing and cost a migration every time the owner
--   wants a new field.
--
-- Idempotent throughout: every object is CREATE ... IF NOT EXISTS, so running
-- this twice converges rather than failing.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

/* ------------------------------------------------------------------ auth -- */

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY,
  email         TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'owner',
  display_name  TEXT NOT NULL DEFAULT '',
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);
-- Case-insensitive rather than CITEXT: one expression index avoids requiring a
-- non-default extension, and sign-in must not fail on a capitalised address.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower ON users (lower(email));

-- token_hash, not the token. The SQLite table used the raw opaque token as its
-- primary key, which means a database read was enough to impersonate a live
-- session. Storing SHA-256 makes a leaked row useless on its own.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash   TEXT PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ,
  expires_at   TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_expires ON sessions (expires_at);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions (user_id);

/* ----------------------------------------------------------------- media -- */

-- `clearance` is load-bearing, not descriptive. Thirteen of these files are
-- licensed stand-ins — several are demonstrably other companies' events — and
-- this column is the only thing standing between them and being published as
-- Raja's own project evidence.
CREATE TABLE IF NOT EXISTS media (
  id                UUID PRIMARY KEY,
  storage_provider  TEXT NOT NULL DEFAULT 'r2',
  bucket            TEXT NOT NULL,
  object_key        TEXT NOT NULL,
  legacy_path       TEXT,
  original_filename TEXT,
  mime_type         TEXT,
  size_bytes        BIGINT NOT NULL DEFAULT 0,
  width             INTEGER NOT NULL DEFAULT 0,
  height            INTEGER NOT NULL DEFAULT 0,
  alt_text          TEXT NOT NULL DEFAULT '',
  caption           TEXT,
  credit            TEXT,
  kind              TEXT NOT NULL DEFAULT 'image',
  clearance         TEXT NOT NULL DEFAULT 'raja-original',
  visibility        TEXT NOT NULL DEFAULT 'public',
  verified          BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS media_bucket_key ON media (bucket, object_key);
CREATE UNIQUE INDEX IF NOT EXISTS media_legacy_path ON media (legacy_path) WHERE legacy_path IS NOT NULL;
CREATE INDEX IF NOT EXISTS media_clearance ON media (clearance);

/* --------------------------------------------------------------- clients -- */

-- `alternate_name` exists because four organisations are published under two
-- different names and nobody has yet confirmed which is correct. Both are kept.
-- `event` has no column in the original specification but every one of the 27
-- records carries one; dropping it would destroy a business fact.
CREATE TABLE IF NOT EXISTS clients (
  id             UUID PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  alternate_name TEXT,
  event          TEXT,
  category       TEXT,
  logo_media_id  UUID REFERENCES media(id) ON DELETE SET NULL,
  published      BOOLEAN NOT NULL DEFAULT true,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  source_status  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS clients_listing ON clients (published, sort_order);

/* -------------------------------------------------------------- projects -- */

-- client_id is deliberately nullable and deliberately unset by the migration.
-- The project records name their client in free text and the names resemble
-- client rows, but resemblance is not a verified commercial relationship.
-- `organisation` keeps the original string until the owner confirms.
CREATE TABLE IF NOT EXISTS projects (
  id           UUID PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  client_id    UUID REFERENCES clients(id) ON DELETE SET NULL,
  organisation TEXT,
  location     TEXT,
  year         INTEGER,
  category     TEXT,
  eyebrow      TEXT,
  description  TEXT,
  scope        TEXT,
  featured     BOOLEAN NOT NULL DEFAULT false,
  published    BOOLEAN NOT NULL DEFAULT false,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS projects_listing ON projects (published, sort_order);

-- RESTRICT on media: refuse to delete an image still shown on a project,
-- rather than discovering the gap on the public site.
CREATE TABLE IF NOT EXISTS project_media (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_id   UUID NOT NULL REFERENCES media(id) ON DELETE RESTRICT,
  role       TEXT NOT NULL DEFAULT 'gallery',
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, media_id)
);
CREATE INDEX IF NOT EXISTS project_media_order ON project_media (project_id, role, sort_order);

/* -------------------------------------------------------------- capacity -- */

-- display_value is the authority; value is advisory.
--
-- The published figures are strings like "5,00,000+" and the "+" is a claim
-- about owning AT LEAST that much. Regenerating the display from the number
-- would silently strengthen a deliberately hedged figure into an exact one, so
-- nothing derives display_value from value. Five items have no figure at all
-- and stay NULL — a zero would publish as a capability of nothing.
CREATE TABLE IF NOT EXISTS capacity_items (
  id            UUID PRIMARY KEY,
  key           TEXT NOT NULL UNIQUE,
  label         TEXT NOT NULL,
  value         NUMERIC,
  display_value TEXT,
  unit          TEXT,
  description   TEXT,
  note          TEXT,
  status        TEXT NOT NULL DEFAULT 'approved',
  sort_order    INTEGER NOT NULL DEFAULT 0,
  published     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS capacity_published ON capacity_items (published, sort_order);

-- capacity_key rather than a copied number: the catalogue previously restated
-- figures the schedule also held, and the two had already drifted apart.
CREATE TABLE IF NOT EXISTS inventory_items (
  id             UUID PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  category       TEXT NOT NULL DEFAULT '',
  title          TEXT NOT NULL,
  description    TEXT,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  capacity_key   TEXT REFERENCES capacity_items(key) ON DELETE SET NULL,
  media_id       UUID REFERENCES media(id) ON DELETE SET NULL,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  published      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inventory_listing ON inventory_items (published, sort_order);

/* ------------------------------------------------------- editorial content -- */

CREATE TABLE IF NOT EXISTS content_entries (
  id         UUID PRIMARY KEY,
  collection TEXT NOT NULL,
  entry_key  TEXT NOT NULL,
  slug       TEXT,
  title      TEXT,
  data       JSONB NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS content_collection_key ON content_entries (collection, entry_key);
CREATE INDEX IF NOT EXISTS content_listing ON content_entries (collection, published, sort_order);
CREATE UNIQUE INDEX IF NOT EXISTS content_collection_slug
  ON content_entries (collection, slug) WHERE slug IS NOT NULL;

CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- An override table, not a mirror of every route: pages generate their own
-- metadata, and seeding a row per route would recreate the duplicate source of
-- truth this project has spent its time removing.
CREATE TABLE IF NOT EXISTS page_seo (
  id            UUID PRIMARY KEY,
  route         TEXT NOT NULL UNIQUE,
  title         TEXT,
  description   TEXT,
  canonical_url TEXT,
  og_media_id   UUID REFERENCES media(id) ON DELETE SET NULL,
  noindex       BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

/* ------------------------------------------------------------- enquiries -- */

-- Two band columns, because they are two different facts: `budget_band` is what
-- the buyer chose in public, `triage_band` is the internal routing signal.
--
-- attendance and event_date are TEXT, not INTEGER/DATE. The real values are
-- prose — "30,000 over four days", "March 2027, or not yet fixed" — and a buyer
-- who has no fixed date must still be able to enquire.
CREATE TABLE IF NOT EXISTS enquiries (
  id                UUID PRIMARY KEY,
  reference         TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  company           TEXT NOT NULL DEFAULT '',
  email             TEXT NOT NULL DEFAULT '',
  phone             TEXT NOT NULL DEFAULT '',
  event_type        TEXT NOT NULL DEFAULT '',
  city              TEXT NOT NULL DEFAULT '',
  event_date        TEXT NOT NULL DEFAULT '',
  attendance        TEXT NOT NULL DEFAULT '',
  venue             TEXT NOT NULL DEFAULT '',
  budget_band       TEXT NOT NULL DEFAULT '',
  triage_band       TEXT NOT NULL DEFAULT 'general',
  requirements      TEXT NOT NULL DEFAULT '',
  message           TEXT NOT NULL DEFAULT '',
  status            TEXT NOT NULL DEFAULT 'new',
  assigned_to       UUID REFERENCES users(id) ON DELETE SET NULL,
  next_follow_up_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT enquiries_status_known
    CHECK (status IN ('new','contacted','qualified','proposal','won','lost'))
);
CREATE INDEX IF NOT EXISTS enquiries_queue ON enquiries (status, next_follow_up_at);
CREATE INDEX IF NOT EXISTS enquiries_recent ON enquiries (created_at DESC);

-- Append-only history. author_id is SET NULL rather than CASCADE: the note is
-- the record, and it outlives whoever wrote it.
CREATE TABLE IF NOT EXISTS enquiry_notes (
  id         UUID PRIMARY KEY,
  enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  note       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS enquiry_notes_history ON enquiry_notes (enquiry_id, created_at);

-- Metadata only. The bytes live in raja-private-documents; SQLite held them as
-- a BLOB in the row, which is exactly what must not survive the move.
CREATE TABLE IF NOT EXISTS enquiry_files (
  id                UUID PRIMARY KEY,
  enquiry_id        UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  media_id          UUID REFERENCES media(id) ON DELETE SET NULL,
  bucket            TEXT NOT NULL DEFAULT 'raja-private-documents',
  object_key        TEXT NOT NULL,
  original_filename TEXT NOT NULL DEFAULT '',
  mime_type         TEXT NOT NULL DEFAULT '',
  size_bytes        BIGINT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS enquiry_files_owner ON enquiry_files (enquiry_id);

/* ------------------------------------------------------------- audit log -- */

-- actor_user_id is SET NULL and entity_id carries no foreign key on purpose:
-- an audit row has to survive the deletion of both the actor and the thing it
-- describes, or it is not an audit log.
CREATE TABLE IF NOT EXISTS audit_logs (
  id            UUID PRIMARY KEY,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_email   TEXT NOT NULL DEFAULT '',
  action        TEXT NOT NULL,
  entity_type   TEXT NOT NULL DEFAULT '',
  entity_id     TEXT NOT NULL DEFAULT '',
  metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_recent ON audit_logs (created_at DESC);

/* --------------------------------------------------- migration bookkeeping -- */

CREATE TABLE IF NOT EXISTS migration_runs (
  id         UUID PRIMARY KEY,
  source_sha TEXT,
  note       TEXT,
  counts     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
