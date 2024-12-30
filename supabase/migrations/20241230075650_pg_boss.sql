create schema if not exists "pgboss";

create type "pgboss"."job_state" as enum ('created', 'retry', 'active', 'completed', 'cancelled', 'failed');

create table "pgboss"."archive" (
    "id" uuid not null,
    "name" text not null,
    "priority" integer not null,
    "data" jsonb,
    "state" pgboss.job_state not null,
    "retry_limit" integer not null,
    "retry_count" integer not null,
    "retry_delay" integer not null,
    "retry_backoff" boolean not null,
    "start_after" timestamp with time zone not null,
    "started_on" timestamp with time zone,
    "singleton_key" text,
    "singleton_on" timestamp without time zone,
    "expire_in" interval not null,
    "created_on" timestamp with time zone not null,
    "completed_on" timestamp with time zone,
    "keep_until" timestamp with time zone not null,
    "output" jsonb,
    "dead_letter" text,
    "policy" text,
    "archived_on" timestamp with time zone not null default now()
);

create table "pgboss"."job" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "priority" integer not null default 0,
    "data" jsonb,
    "state" pgboss.job_state not null default 'created'::pgboss.job_state,
    "retry_limit" integer not null default 2,
    "retry_count" integer not null default 0,
    "retry_delay" integer not null default 0,
    "retry_backoff" boolean not null default false,
    "start_after" timestamp with time zone not null default now(),
    "started_on" timestamp with time zone,
    "singleton_key" text,
    "singleton_on" timestamp without time zone,
    "expire_in" interval not null default '00:15:00'::interval,
    "created_on" timestamp with time zone not null default now(),
    "completed_on" timestamp with time zone,
    "keep_until" timestamp with time zone not null default (now() + '14 days'::interval),
    "output" jsonb,
    "dead_letter" text,
    "policy" text
) partition by LIST (name);

create table "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111" partition of "pgboss"."job" FOR VALUES IN ('news_links');
create table "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3" partition of "pgboss"."job" FOR VALUES IN ('__pgboss__send-it');


create table "pgboss"."queue" (
    "name" text not null,
    "policy" text,
    "retry_limit" integer,
    "retry_delay" integer,
    "retry_backoff" boolean,
    "expire_seconds" integer,
    "retention_minutes" integer,
    "dead_letter" text,
    "partition_name" text,
    "created_on" timestamp with time zone not null default now(),
    "updated_on" timestamp with time zone not null default now()
);

create table "pgboss"."schedule" (
    "name" text not null,
    "cron" text not null,
    "timezone" text,
    "data" jsonb,
    "options" jsonb,
    "created_on" timestamp with time zone not null default now(),
    "updated_on" timestamp with time zone not null default now()
);

create table "pgboss"."subscription" (
    "event" text not null,
    "name" text not null,
    "created_on" timestamp with time zone not null default now(),
    "updated_on" timestamp with time zone not null default now()
);

create table "pgboss"."version" (
    "version" integer not null,
    "maintained_on" timestamp with time zone,
    "cron_on" timestamp with time zone,
    "monitored_on" timestamp with time zone
);

CREATE INDEX archive_i1 ON pgboss.archive USING btree (archived_on);

CREATE UNIQUE INDEX archive_pkey ON pgboss.archive USING btree (name, id);

CREATE UNIQUE INDEX j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_i1 ON pgboss.j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111 USING btree (name, COALESCE(singleton_key, ''::text)) WHERE ((state = 'created'::pgboss.job_state) AND (policy = 'short'::text));

CREATE UNIQUE INDEX j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_i2 ON pgboss.j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111 USING btree (name, COALESCE(singleton_key, ''::text)) WHERE ((state = 'active'::pgboss.job_state) AND (policy = 'singleton'::text));

CREATE UNIQUE INDEX j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_i3 ON pgboss.j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111 USING btree (name, state, COALESCE(singleton_key, ''::text)) WHERE ((state <= 'active'::pgboss.job_state) AND (policy = 'stately'::text));

CREATE UNIQUE INDEX j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_i4 ON pgboss.j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111 USING btree (name, singleton_on, COALESCE(singleton_key, ''::text)) WHERE ((state <> 'cancelled'::pgboss.job_state) AND (singleton_on IS NOT NULL));

CREATE INDEX j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_i5 ON pgboss.j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111 USING btree (name, start_after) INCLUDE (priority, created_on, id) WHERE (state < 'active'::pgboss.job_state);

CREATE UNIQUE INDEX j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_pkey ON pgboss.j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111 USING btree (name, id);

CREATE UNIQUE INDEX j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_i1 ON pgboss.j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3 USING btree (name, COALESCE(singleton_key, ''::text)) WHERE ((state = 'created'::pgboss.job_state) AND (policy = 'short'::text));

CREATE UNIQUE INDEX j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_i2 ON pgboss.j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3 USING btree (name, COALESCE(singleton_key, ''::text)) WHERE ((state = 'active'::pgboss.job_state) AND (policy = 'singleton'::text));

CREATE UNIQUE INDEX j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_i3 ON pgboss.j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3 USING btree (name, state, COALESCE(singleton_key, ''::text)) WHERE ((state <= 'active'::pgboss.job_state) AND (policy = 'stately'::text));

CREATE UNIQUE INDEX j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_i4 ON pgboss.j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3 USING btree (name, singleton_on, COALESCE(singleton_key, ''::text)) WHERE ((state <> 'cancelled'::pgboss.job_state) AND (singleton_on IS NOT NULL));

CREATE INDEX j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_i5 ON pgboss.j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3 USING btree (name, start_after) INCLUDE (priority, created_on, id) WHERE (state < 'active'::pgboss.job_state);

CREATE UNIQUE INDEX j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_pkey ON pgboss.j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3 USING btree (name, id);

CREATE UNIQUE INDEX queue_pkey ON pgboss.queue USING btree (name);

CREATE UNIQUE INDEX schedule_pkey ON pgboss.schedule USING btree (name);

CREATE UNIQUE INDEX subscription_pkey ON pgboss.subscription USING btree (event, name);

CREATE UNIQUE INDEX version_pkey ON pgboss.version USING btree (version);

alter table "pgboss"."archive" add constraint "archive_pkey" PRIMARY KEY using index "archive_pkey";

alter table "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111" add constraint "j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_pkey" PRIMARY KEY using index "j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_pkey";

alter table "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3" add constraint "j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_pkey" PRIMARY KEY using index "j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_pkey";

alter table "pgboss"."queue" add constraint "queue_pkey" PRIMARY KEY using index "queue_pkey";

alter table "pgboss"."schedule" add constraint "schedule_pkey" PRIMARY KEY using index "schedule_pkey";

alter table "pgboss"."subscription" add constraint "subscription_pkey" PRIMARY KEY using index "subscription_pkey";

alter table "pgboss"."version" add constraint "version_pkey" PRIMARY KEY using index "version_pkey";

alter table "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111" add constraint "cjc" CHECK ((name = 'news_links'::text)) not valid;

alter table "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111" validate constraint "cjc";

alter table "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111" add constraint "dlq_fkey" FOREIGN KEY (dead_letter) REFERENCES pgboss.queue(name) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED not valid;

alter table "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111" validate constraint "dlq_fkey";

alter table "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111" add constraint "q_fkey" FOREIGN KEY (name) REFERENCES pgboss.queue(name) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED not valid;

alter table "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111" validate constraint "q_fkey";

alter table "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3" add constraint "cjc" CHECK ((name = '__pgboss__send-it'::text)) not valid;

alter table "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3" validate constraint "cjc";

alter table "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3" add constraint "dlq_fkey" FOREIGN KEY (dead_letter) REFERENCES pgboss.queue(name) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED not valid;

alter table "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3" validate constraint "dlq_fkey";

alter table "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3" add constraint "q_fkey" FOREIGN KEY (name) REFERENCES pgboss.queue(name) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED not valid;

alter table "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3" validate constraint "q_fkey";

alter table "pgboss"."queue" add constraint "queue_dead_letter_fkey" FOREIGN KEY (dead_letter) REFERENCES pgboss.queue(name) not valid;

alter table "pgboss"."queue" validate constraint "queue_dead_letter_fkey";

alter table "pgboss"."schedule" add constraint "schedule_name_fkey" FOREIGN KEY (name) REFERENCES pgboss.queue(name) ON DELETE CASCADE not valid;

alter table "pgboss"."schedule" validate constraint "schedule_name_fkey";

alter table "pgboss"."subscription" add constraint "subscription_name_fkey" FOREIGN KEY (name) REFERENCES pgboss.queue(name) ON DELETE CASCADE not valid;

alter table "pgboss"."subscription" validate constraint "subscription_name_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION pgboss.create_queue(queue_name text, options json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
    DECLARE
      table_name varchar := 'j' || encode(sha224(queue_name::bytea), 'hex');

queue_created_on timestamptz;

BEGIN

      WITH q as (
      INSERT INTO pgboss.queue (
        name,
        policy,
        retry_limit,
        retry_delay,
        retry_backoff,
        expire_seconds,
        retention_minutes,
        dead_letter,
        partition_name
      )
      VALUES (
        queue_name,
        options->>'policy',
        (options->>'retryLimit')::int,
        (options->>'retryDelay')::int,
        (options->>'retryBackoff')::bool,
        (options->>'expireInSeconds')::int,
        (options->>'retentionMinutes')::int,
        options->>'deadLetter',
        table_name
      )
      ON CONFLICT DO NOTHING
      RETURNING created_on
      )
      SELECT created_on into queue_created_on from q;

IF queue_created_on IS NULL THEN
        RETURN;

END IF;

EXECUTE format('CREATE TABLE pgboss.%I (LIKE pgboss.job INCLUDING DEFAULTS)', table_name);

EXECUTE format('ALTER TABLE pgboss.%1$I ADD PRIMARY KEY (name, id)', table_name);

EXECUTE format('ALTER TABLE pgboss.%1$I ADD CONSTRAINT q_fkey FOREIGN KEY (name) REFERENCES pgboss.queue (name) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED', table_name);

EXECUTE format('ALTER TABLE pgboss.%1$I ADD CONSTRAINT dlq_fkey FOREIGN KEY (dead_letter) REFERENCES pgboss.queue (name) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED', table_name);

EXECUTE format('CREATE UNIQUE INDEX %1$s_i1 ON pgboss.%1$I (name, COALESCE(singleton_key, '''')) WHERE state = ''created'' AND policy = ''short''', table_name);

EXECUTE format('CREATE UNIQUE INDEX %1$s_i2 ON pgboss.%1$I (name, COALESCE(singleton_key, '''')) WHERE state = ''active'' AND policy = ''singleton''', table_name);

EXECUTE format('CREATE UNIQUE INDEX %1$s_i3 ON pgboss.%1$I (name, state, COALESCE(singleton_key, '''')) WHERE state <= ''active'' AND policy = ''stately''', table_name);

EXECUTE format('CREATE UNIQUE INDEX %1$s_i4 ON pgboss.%1$I (name, singleton_on, COALESCE(singleton_key, '''')) WHERE state <> ''cancelled'' AND singleton_on IS NOT NULL', table_name);

EXECUTE format('CREATE INDEX %1$s_i5 ON pgboss.%1$I (name, start_after) INCLUDE (priority, created_on, id) WHERE state < ''active''', table_name);

EXECUTE format('ALTER TABLE pgboss.%I ADD CONSTRAINT cjc CHECK (name=%L)', table_name, queue_name);

EXECUTE format('ALTER TABLE pgboss.job ATTACH PARTITION pgboss.%I FOR VALUES IN (%L)', table_name, queue_name);

END;

$function$;

CREATE OR REPLACE FUNCTION pgboss.delete_queue(queue_name text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
    DECLARE
      table_name varchar;

BEGIN  
      WITH deleted as (
        DELETE FROM pgboss.queue
        WHERE name = queue_name
        RETURNING partition_name
      )
      SELECT partition_name from deleted INTO table_name;

EXECUTE format('DROP TABLE IF EXISTS pgboss.%I', table_name);

END;

$function$;

create type "public"."job_priority" as enum ('critical', 'high', 'normal', 'low');

create type "public"."job_status" as enum ('created', 'active', 'completed', 'failed', 'cancelled', 'expired');

drop view if exists "public"."error_metrics";

alter type "public"."error_type" rename to "error_type__old_version_to_be_dropped";

create type "public"."error_type" as enum ('UPLOAD_ERROR', 'CONNECTION_ERROR', 'AUTHENTICATION_ERROR', 'VALIDATION_ERROR', 'NOT_FOUND_ERROR', 'SERVER_ERROR', 'NETWORK_ERROR', 'DATABASE_ERROR', 'UNKNOWN_ERROR', 'SLOW_QUERY', 'ERROR_SPIKE', 'AUTH_ERROR', 'TABLE_ERROR', 'TABLE_OPERATION');

create table "public"."circuit_breaker_states" (
    "id" uuid not null default gen_random_uuid(),
    "job_name" text not null,
    "state" text not null default 'closed'::text,
    "failure_count" integer default 0,
    "last_failure" timestamp with time zone,
    "last_success" timestamp with time zone,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);

alter table "public"."circuit_breaker_states" enable row level security;

create table "public"."job_configs" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "schedule" text,
    "priority" public.job_priority default 'normal'::public.job_priority,
    "timeout_ms" integer default 30000,
    "retry_limit" integer default 3,
    "circuit_breaker_enabled" boolean default true,
    "circuit_breaker_threshold" integer default 5,
    "circuit_breaker_timeout_ms" integer default 300000,
    "enabled" boolean default true,
    "metadata" jsonb,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);

alter table "public"."job_configs" enable row level security;

create table "public"."job_locks" (
    "id" uuid not null default gen_random_uuid(),
    "job_name" text not null,
    "lock_key" text not null,
    "lock_value" text not null,
    "acquired_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "expires_at" timestamp with time zone not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);

alter table "public"."job_locks" enable row level security;

create table "public"."job_metrics" (
    "id" uuid not null default gen_random_uuid(),
    "job_name" text not null,
    "job_id" uuid not null,
    "status" public.job_status not null,
    "started_at" timestamp with time zone not null,
    "completed_at" timestamp with time zone,
    "failed_at" timestamp with time zone,
    "duration_ms" integer,
    "items_processed" integer,
    "error_message" text,
    "error_stack" text,
    "metadata" jsonb,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);

alter table "public"."job_metrics" enable row level security;

create table "public"."job_queue_stats" (
    "id" uuid not null default gen_random_uuid(),
    "queue_name" text not null,
    "created_count" integer default 0,
    "retry_count" integer default 0,
    "active_count" integer default 0,
    "completed_count" integer default 0,
    "cancelled_count" integer default 0,
    "failed_count" integer default 0,
    "total_count" integer default 0,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);

alter table "public"."job_queue_stats" enable row level security;

create table "public"."job_versions" (
    "id" uuid not null default gen_random_uuid(),
    "job_name" text not null,
    "version" text not null,
    "changes" text[] not null,
    "config" jsonb not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP
);

alter table "public"."job_versions" enable row level security;

create table "public"."workflow_jobs" (
    "id" uuid not null default gen_random_uuid(),
    "workflow_id" uuid not null,
    "job_id" uuid not null,
    "job_name" text not null,
    "status" public.job_status not null default 'created'::public.job_status,
    "sequence_number" integer not null,
    "depends_on" uuid[] default ARRAY[]::uuid[],
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);

alter table "public"."workflow_jobs" enable row level security;

create table "public"."workflows" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "status" public.job_status not null default 'created'::public.job_status,
    "metadata" jsonb,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);

alter table "public"."workflows" enable row level security;

alter table "public"."error_logs" alter column error_type type "public"."error_type" using error_type::text::"public"."error_type";

drop type "public"."error_type__old_version_to_be_dropped";

alter table "public"."error_logs" add column "domain" character varying;

CREATE UNIQUE INDEX circuit_breaker_states_job_name_key ON public.circuit_breaker_states USING btree (job_name);

CREATE UNIQUE INDEX circuit_breaker_states_pkey ON public.circuit_breaker_states USING btree (id);

CREATE INDEX idx_circuit_breaker_job_name ON public.circuit_breaker_states USING btree (job_name);

CREATE INDEX idx_job_locks_expires_at ON public.job_locks USING btree (expires_at);

CREATE INDEX idx_job_metrics_created_at ON public.job_metrics USING btree (created_at);

CREATE INDEX idx_job_metrics_job_name ON public.job_metrics USING btree (job_name);

CREATE INDEX idx_job_metrics_status ON public.job_metrics USING btree (status);

CREATE INDEX idx_job_queue_stats_queue_name ON public.job_queue_stats USING btree (queue_name);

CREATE INDEX idx_job_versions_created_at ON public.job_versions USING btree (created_at);

CREATE INDEX idx_job_versions_job_name ON public.job_versions USING btree (job_name);

CREATE INDEX idx_workflow_jobs_status ON public.workflow_jobs USING btree (status);

CREATE INDEX idx_workflow_jobs_workflow_id ON public.workflow_jobs USING btree (workflow_id);

CREATE UNIQUE INDEX job_configs_name_key ON public.job_configs USING btree (name);

CREATE UNIQUE INDEX job_configs_pkey ON public.job_configs USING btree (id);

CREATE UNIQUE INDEX job_locks_job_name_lock_key_key ON public.job_locks USING btree (job_name, lock_key);

CREATE UNIQUE INDEX job_locks_pkey ON public.job_locks USING btree (id);

CREATE UNIQUE INDEX job_metrics_pkey ON public.job_metrics USING btree (id);

CREATE UNIQUE INDEX job_queue_stats_pkey ON public.job_queue_stats USING btree (id);

CREATE UNIQUE INDEX job_queue_stats_queue_name_key ON public.job_queue_stats USING btree (queue_name);

CREATE UNIQUE INDEX job_versions_job_name_version_key ON public.job_versions USING btree (job_name, version);

CREATE UNIQUE INDEX job_versions_pkey ON public.job_versions USING btree (id);

CREATE UNIQUE INDEX workflow_jobs_pkey ON public.workflow_jobs USING btree (id);

CREATE UNIQUE INDEX workflow_jobs_workflow_id_job_name_key ON public.workflow_jobs USING btree (workflow_id, job_name);

CREATE UNIQUE INDEX workflows_pkey ON public.workflows USING btree (id);

alter table "public"."circuit_breaker_states" add constraint "circuit_breaker_states_pkey" PRIMARY KEY using index "circuit_breaker_states_pkey";

alter table "public"."job_configs" add constraint "job_configs_pkey" PRIMARY KEY using index "job_configs_pkey";

alter table "public"."job_locks" add constraint "job_locks_pkey" PRIMARY KEY using index "job_locks_pkey";

alter table "public"."job_metrics" add constraint "job_metrics_pkey" PRIMARY KEY using index "job_metrics_pkey";

alter table "public"."job_queue_stats" add constraint "job_queue_stats_pkey" PRIMARY KEY using index "job_queue_stats_pkey";

alter table "public"."job_versions" add constraint "job_versions_pkey" PRIMARY KEY using index "job_versions_pkey";

alter table "public"."workflow_jobs" add constraint "workflow_jobs_pkey" PRIMARY KEY using index "workflow_jobs_pkey";

alter table "public"."workflows" add constraint "workflows_pkey" PRIMARY KEY using index "workflows_pkey";

alter table "public"."circuit_breaker_states" add constraint "circuit_breaker_states_job_name_key" UNIQUE using index "circuit_breaker_states_job_name_key";

alter table "public"."job_configs" add constraint "job_configs_name_key" UNIQUE using index "job_configs_name_key";

alter table "public"."job_locks" add constraint "job_locks_job_name_lock_key_key" UNIQUE using index "job_locks_job_name_lock_key_key";

alter table "public"."job_queue_stats" add constraint "job_queue_stats_queue_name_key" UNIQUE using index "job_queue_stats_queue_name_key";

alter table "public"."job_versions" add constraint "job_versions_job_name_version_key" UNIQUE using index "job_versions_job_name_version_key";

alter table "public"."workflow_jobs" add constraint "workflow_jobs_workflow_id_fkey" FOREIGN KEY (workflow_id) REFERENCES public.workflows(id) not valid;

alter table "public"."workflow_jobs" validate constraint "workflow_jobs_workflow_id_fkey";

alter table "public"."workflow_jobs" add constraint "workflow_jobs_workflow_id_job_name_key" UNIQUE using index "workflow_jobs_workflow_id_job_name_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cleanup_expired_locks()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM job_locks WHERE expires_at < CURRENT_TIMESTAMP;

END;

$function$;

create or replace view "public"."error_frequency" as  SELECT error_logs.service_name,
    error_logs.error_type,
    error_logs.severity,
    date_trunc('hour'::text, error_logs.created_at) AS time_bucket,
    count(*) AS error_count
   FROM public.error_logs
  GROUP BY error_logs.service_name, error_logs.error_type, error_logs.severity, (date_trunc('hour'::text, error_logs.created_at))
  ORDER BY (date_trunc('hour'::text, error_logs.created_at)) DESC;

create or replace view "public"."error_stats" as  SELECT pg_stat_statements.calls,
    pg_stat_statements.mean_exec_time,
    pg_stat_statements.max_exec_time,
    pg_stat_statements.rows,
    pg_stat_statements.query,
    pg_stat_statements.queryid,
    pg_stat_statements.toplevel
   FROM extensions.pg_stat_statements
  WHERE ((regexp_match(pg_stat_statements.query, 'ERROR|FAIL|EXCEPTION'::text) IS NOT NULL) OR (pg_stat_statements.max_exec_time > (1000)::double precision));

CREATE OR REPLACE FUNCTION public.get_errors_by_timerange(start_time timestamp with time zone, end_time timestamp with time zone)
 RETURNS TABLE(service_name text, error_count bigint, error_types text[], sample_messages text[])
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        e.service_name,
        COUNT(*),
        array_agg(DISTINCT e.error_type::text),
        array_agg(DISTINCT e.message) FILTER (WHERE e.message IS NOT NULL)
    FROM public.error_logs e
    WHERE e.created_at BETWEEN start_time AND end_time
    GROUP BY e.service_name;

END;

$function$;

create or replace view "public"."recent_errors" as  SELECT error_logs.created_at,
    error_logs.service_name,
    error_logs.error_type,
    error_logs.severity,
    error_logs.message,
    error_logs.metadata
   FROM public.error_logs
  WHERE (error_logs.created_at > (now() - '24:00:00'::interval))
  ORDER BY error_logs.created_at DESC;

create or replace view "public"."slow_query_patterns" as  SELECT (error_logs.metadata ->> 'query_id'::text) AS query_id,
    count(*) AS occurrence_count,
    avg(((error_logs.metadata ->> 'execution_time_ms'::text))::double precision) AS avg_exec_time,
    max(((error_logs.metadata ->> 'execution_time_ms'::text))::double precision) AS max_exec_time,
    min(error_logs.created_at) AS first_seen,
    max(error_logs.created_at) AS last_seen
   FROM public.error_logs
  WHERE (error_logs.error_type = 'SLOW_QUERY'::public.error_type)
  GROUP BY (error_logs.metadata ->> 'query_id'::text)
 HAVING (count(*) > 1)
  ORDER BY (avg(((error_logs.metadata ->> 'execution_time_ms'::text))::double precision)) DESC;

CREATE OR REPLACE FUNCTION public.sync_all_logs()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    last_sync_time timestamptz;

current_env text;

BEGIN
    -- Get last sync time from our logs
    SELECT COALESCE(MAX(created_at), '1970-01-01'::timestamptz)
    INTO last_sync_time
    FROM public.error_logs;

-- Get current environment
    SELECT current_setting('app.environment', true) 
    INTO current_env;

IF current_env IS NULL THEN
        current_env := 'development';

-- default to development if not set
    END IF;

-- Sync slow queries from pg_stat_statements
    INSERT INTO public.error_logs (
        service_name,
        error_type,
        severity,
        message,
        metadata,
        environment,
        context,
        created_at
    )
    SELECT 
        'database',
        'SLOW_QUERY'::public.error_type,
        'low'::public.error_severity,
        'Slow query detected: ' || substring(query, 1, 200),
        jsonb_build_object(
            'query_id', queryid,
            'execution_time_ms', max_exec_time,
            'avg_time_ms', mean_exec_time,
            'calls', calls,
            'rows_affected', rows
        ),
        current_env,
        '{}'::jsonb,
        now()
    FROM extensions.pg_stat_statements
    WHERE max_exec_time > 1000
    AND calls > 1;

END;

$function$;

CREATE OR REPLACE VIEW public.error_metrics AS
SELECT 
    date_trunc('hour'::text, error_logs.created_at) AS time_bucket,
    error_logs.service_name,
    error_logs.error_type,
    error_logs.severity,
    count(*) AS error_count
FROM public.error_logs
GROUP BY 
    date_trunc('hour'::text, error_logs.created_at),
    error_logs.service_name,
    error_logs.error_type,
    error_logs.severity;

CREATE UNIQUE INDEX IF NOT EXISTS news_details_id_idx ON public.news_details USING btree (id);

grant delete on table "public"."circuit_breaker_states" to "anon";

grant insert on table "public"."circuit_breaker_states" to "anon";

grant references on table "public"."circuit_breaker_states" to "anon";

grant select on table "public"."circuit_breaker_states" to "anon";

grant trigger on table "public"."circuit_breaker_states" to "anon";

grant truncate on table "public"."circuit_breaker_states" to "anon";

grant update on table "public"."circuit_breaker_states" to "anon";

grant delete on table "public"."circuit_breaker_states" to "authenticated";

grant insert on table "public"."circuit_breaker_states" to "authenticated";

grant references on table "public"."circuit_breaker_states" to "authenticated";

grant select on table "public"."circuit_breaker_states" to "authenticated";

grant trigger on table "public"."circuit_breaker_states" to "authenticated";

grant truncate on table "public"."circuit_breaker_states" to "authenticated";

grant update on table "public"."circuit_breaker_states" to "authenticated";

grant delete on table "public"."circuit_breaker_states" to "service_role";

grant insert on table "public"."circuit_breaker_states" to "service_role";

grant references on table "public"."circuit_breaker_states" to "service_role";

grant select on table "public"."circuit_breaker_states" to "service_role";

grant trigger on table "public"."circuit_breaker_states" to "service_role";

grant truncate on table "public"."circuit_breaker_states" to "service_role";

grant update on table "public"."circuit_breaker_states" to "service_role";

grant delete on table "public"."job_configs" to "anon";

grant insert on table "public"."job_configs" to "anon";

grant references on table "public"."job_configs" to "anon";

grant select on table "public"."job_configs" to "anon";

grant trigger on table "public"."job_configs" to "anon";

grant truncate on table "public"."job_configs" to "anon";

grant update on table "public"."job_configs" to "anon";

grant delete on table "public"."job_configs" to "authenticated";

grant insert on table "public"."job_configs" to "authenticated";

grant references on table "public"."job_configs" to "authenticated";

grant select on table "public"."job_configs" to "authenticated";

grant trigger on table "public"."job_configs" to "authenticated";

grant truncate on table "public"."job_configs" to "authenticated";

grant update on table "public"."job_configs" to "authenticated";

grant delete on table "public"."job_configs" to "service_role";

grant insert on table "public"."job_configs" to "service_role";

grant references on table "public"."job_configs" to "service_role";

grant select on table "public"."job_configs" to "service_role";

grant trigger on table "public"."job_configs" to "service_role";

grant truncate on table "public"."job_configs" to "service_role";

grant update on table "public"."job_configs" to "service_role";

grant delete on table "public"."job_locks" to "anon";

grant insert on table "public"."job_locks" to "anon";

grant references on table "public"."job_locks" to "anon";

grant select on table "public"."job_locks" to "anon";

grant trigger on table "public"."job_locks" to "anon";

grant truncate on table "public"."job_locks" to "anon";

grant update on table "public"."job_locks" to "anon";

grant delete on table "public"."job_locks" to "authenticated";

grant insert on table "public"."job_locks" to "authenticated";

grant references on table "public"."job_locks" to "authenticated";

grant select on table "public"."job_locks" to "authenticated";

grant trigger on table "public"."job_locks" to "authenticated";

grant truncate on table "public"."job_locks" to "authenticated";

grant update on table "public"."job_locks" to "authenticated";

grant delete on table "public"."job_locks" to "service_role";

grant insert on table "public"."job_locks" to "service_role";

grant references on table "public"."job_locks" to "service_role";

grant select on table "public"."job_locks" to "service_role";

grant trigger on table "public"."job_locks" to "service_role";

grant truncate on table "public"."job_locks" to "service_role";

grant update on table "public"."job_locks" to "service_role";

grant delete on table "public"."job_metrics" to "anon";

grant insert on table "public"."job_metrics" to "anon";

grant references on table "public"."job_metrics" to "anon";

grant select on table "public"."job_metrics" to "anon";

grant trigger on table "public"."job_metrics" to "anon";

grant truncate on table "public"."job_metrics" to "anon";

grant update on table "public"."job_metrics" to "anon";

grant delete on table "public"."job_metrics" to "authenticated";

grant insert on table "public"."job_metrics" to "authenticated";

grant references on table "public"."job_metrics" to "authenticated";

grant select on table "public"."job_metrics" to "authenticated";

grant trigger on table "public"."job_metrics" to "authenticated";

grant truncate on table "public"."job_metrics" to "authenticated";

grant update on table "public"."job_metrics" to "authenticated";

grant delete on table "public"."job_metrics" to "service_role";

grant insert on table "public"."job_metrics" to "service_role";

grant references on table "public"."job_metrics" to "service_role";

grant select on table "public"."job_metrics" to "service_role";

grant trigger on table "public"."job_metrics" to "service_role";

grant truncate on table "public"."job_metrics" to "service_role";

grant update on table "public"."job_metrics" to "service_role";

grant delete on table "public"."job_queue_stats" to "anon";

grant insert on table "public"."job_queue_stats" to "anon";

grant references on table "public"."job_queue_stats" to "anon";

grant select on table "public"."job_queue_stats" to "anon";

grant trigger on table "public"."job_queue_stats" to "anon";

grant truncate on table "public"."job_queue_stats" to "anon";

grant update on table "public"."job_queue_stats" to "anon";

grant delete on table "public"."job_queue_stats" to "authenticated";

grant insert on table "public"."job_queue_stats" to "authenticated";

grant references on table "public"."job_queue_stats" to "authenticated";

grant select on table "public"."job_queue_stats" to "authenticated";

grant trigger on table "public"."job_queue_stats" to "authenticated";

grant truncate on table "public"."job_queue_stats" to "authenticated";

grant update on table "public"."job_queue_stats" to "authenticated";

grant delete on table "public"."job_queue_stats" to "service_role";

grant insert on table "public"."job_queue_stats" to "service_role";

grant references on table "public"."job_queue_stats" to "service_role";

grant select on table "public"."job_queue_stats" to "service_role";

grant trigger on table "public"."job_queue_stats" to "service_role";

grant truncate on table "public"."job_queue_stats" to "service_role";

grant update on table "public"."job_queue_stats" to "service_role";

grant delete on table "public"."job_versions" to "anon";

grant insert on table "public"."job_versions" to "anon";

grant references on table "public"."job_versions" to "anon";

grant select on table "public"."job_versions" to "anon";

grant trigger on table "public"."job_versions" to "anon";

grant truncate on table "public"."job_versions" to "anon";

grant update on table "public"."job_versions" to "anon";

grant delete on table "public"."job_versions" to "authenticated";

grant insert on table "public"."job_versions" to "authenticated";

grant references on table "public"."job_versions" to "authenticated";

grant select on table "public"."job_versions" to "authenticated";

grant trigger on table "public"."job_versions" to "authenticated";

grant truncate on table "public"."job_versions" to "authenticated";

grant update on table "public"."job_versions" to "authenticated";

grant delete on table "public"."job_versions" to "service_role";

grant insert on table "public"."job_versions" to "service_role";

grant references on table "public"."job_versions" to "service_role";

grant select on table "public"."job_versions" to "service_role";

grant trigger on table "public"."job_versions" to "service_role";

grant truncate on table "public"."job_versions" to "service_role";

grant update on table "public"."job_versions" to "service_role";

grant delete on table "public"."workflow_jobs" to "anon";

grant insert on table "public"."workflow_jobs" to "anon";

grant references on table "public"."workflow_jobs" to "anon";

grant select on table "public"."workflow_jobs" to "anon";

grant trigger on table "public"."workflow_jobs" to "anon";

grant truncate on table "public"."workflow_jobs" to "anon";

grant update on table "public"."workflow_jobs" to "anon";

grant delete on table "public"."workflow_jobs" to "authenticated";

grant insert on table "public"."workflow_jobs" to "authenticated";

grant references on table "public"."workflow_jobs" to "authenticated";

grant select on table "public"."workflow_jobs" to "authenticated";

grant trigger on table "public"."workflow_jobs" to "authenticated";

grant truncate on table "public"."workflow_jobs" to "authenticated";

grant update on table "public"."workflow_jobs" to "authenticated";

grant delete on table "public"."workflow_jobs" to "service_role";

grant insert on table "public"."workflow_jobs" to "service_role";

grant references on table "public"."workflow_jobs" to "service_role";

grant select on table "public"."workflow_jobs" to "service_role";

grant trigger on table "public"."workflow_jobs" to "service_role";

grant truncate on table "public"."workflow_jobs" to "service_role";

grant update on table "public"."workflow_jobs" to "service_role";

grant delete on table "public"."workflows" to "anon";

grant insert on table "public"."workflows" to "anon";

grant references on table "public"."workflows" to "anon";

grant select on table "public"."workflows" to "anon";

grant trigger on table "public"."workflows" to "anon";

grant truncate on table "public"."workflows" to "anon";

grant update on table "public"."workflows" to "anon";

grant delete on table "public"."workflows" to "authenticated";

grant insert on table "public"."workflows" to "authenticated";

grant references on table "public"."workflows" to "authenticated";

grant select on table "public"."workflows" to "authenticated";

grant trigger on table "public"."workflows" to "authenticated";

grant truncate on table "public"."workflows" to "authenticated";

grant update on table "public"."workflows" to "authenticated";

grant delete on table "public"."workflows" to "service_role";

grant insert on table "public"."workflows" to "service_role";

grant references on table "public"."workflows" to "service_role";

grant select on table "public"."workflows" to "service_role";

grant trigger on table "public"."workflows" to "service_role";

grant truncate on table "public"."workflows" to "service_role";

grant update on table "public"."workflows" to "service_role";

create policy "delete_policy"
on "public"."circuit_breaker_states"
as permissive
for delete
to public
using ((public.authorize('circuit_breaker_states.delete'::text) AND false));

create policy "insert_policy"
on "public"."circuit_breaker_states"
as permissive
for insert
to public
with check ((public.authorize('circuit_breaker_states.insert'::text) AND false));

create policy "select_policy"
on "public"."circuit_breaker_states"
as permissive
for select
to public
using ((public.authorize('circuit_breaker_states.select'::text) AND true));

create policy "update_policy"
on "public"."circuit_breaker_states"
as permissive
for update
to public
using ((public.authorize('circuit_breaker_states.update'::text) AND false));

create policy "delete_policy"
on "public"."job_configs"
as permissive
for delete
to public
using ((public.authorize('job_configs.delete'::text) AND false));

create policy "insert_policy"
on "public"."job_configs"
as permissive
for insert
to public
with check ((public.authorize('job_configs.insert'::text) AND false));

create policy "select_policy"
on "public"."job_configs"
as permissive
for select
to public
using ((public.authorize('job_configs.select'::text) AND true));

create policy "update_policy"
on "public"."job_configs"
as permissive
for update
to public
using ((public.authorize('job_configs.update'::text) AND false));

create policy "delete_policy"
on "public"."job_locks"
as permissive
for delete
to public
using ((public.authorize('job_locks.delete'::text) AND false));

create policy "insert_policy"
on "public"."job_locks"
as permissive
for insert
to public
with check ((public.authorize('job_locks.insert'::text) AND false));

create policy "select_policy"
on "public"."job_locks"
as permissive
for select
to public
using ((public.authorize('job_locks.select'::text) AND true));

create policy "update_policy"
on "public"."job_locks"
as permissive
for update
to public
using ((public.authorize('job_locks.update'::text) AND false));

create policy "delete_policy"
on "public"."job_metrics"
as permissive
for delete
to public
using ((public.authorize('job_metrics.delete'::text) AND false));

create policy "insert_policy"
on "public"."job_metrics"
as permissive
for insert
to public
with check ((public.authorize('job_metrics.insert'::text) AND false));

create policy "select_policy"
on "public"."job_metrics"
as permissive
for select
to public
using ((public.authorize('job_metrics.select'::text) AND true));

create policy "update_policy"
on "public"."job_metrics"
as permissive
for update
to public
using ((public.authorize('job_metrics.update'::text) AND false));

create policy "delete_policy"
on "public"."job_queue_stats"
as permissive
for delete
to public
using ((public.authorize('job_queue_stats.delete'::text) AND false));

create policy "insert_policy"
on "public"."job_queue_stats"
as permissive
for insert
to public
with check ((public.authorize('job_queue_stats.insert'::text) AND false));

create policy "select_policy"
on "public"."job_queue_stats"
as permissive
for select
to public
using ((public.authorize('job_queue_stats.select'::text) AND true));

create policy "update_policy"
on "public"."job_queue_stats"
as permissive
for update
to public
using ((public.authorize('job_queue_stats.update'::text) AND false));

create policy "delete_policy"
on "public"."job_versions"
as permissive
for delete
to public
using ((public.authorize('job_versions.delete'::text) AND false));

create policy "insert_policy"
on "public"."job_versions"
as permissive
for insert
to public
with check ((public.authorize('job_versions.insert'::text) AND false));

create policy "select_policy"
on "public"."job_versions"
as permissive
for select
to public
using ((public.authorize('job_versions.select'::text) AND true));

create policy "update_policy"
on "public"."job_versions"
as permissive
for update
to public
using ((public.authorize('job_versions.update'::text) AND false));

create policy "delete_policy"
on "public"."workflow_jobs"
as permissive
for delete
to public
using ((public.authorize('workflow_jobs.delete'::text) AND false));

create policy "insert_policy"
on "public"."workflow_jobs"
as permissive
for insert
to public
with check ((public.authorize('workflow_jobs.insert'::text) AND false));

create policy "select_policy"
on "public"."workflow_jobs"
as permissive
for select
to public
using ((public.authorize('workflow_jobs.select'::text) AND true));

create policy "update_policy"
on "public"."workflow_jobs"
as permissive
for update
to public
using ((public.authorize('workflow_jobs.update'::text) AND false));

create policy "delete_policy"
on "public"."workflows"
as permissive
for delete
to public
using ((public.authorize('workflows.delete'::text) AND false));

create policy "insert_policy"
on "public"."workflows"
as permissive
for insert
to public
with check ((public.authorize('workflows.insert'::text) AND false));

create policy "select_policy"
on "public"."workflows"
as permissive
for select
to public
using ((public.authorize('workflows.select'::text) AND true));

create policy "update_policy"
on "public"."workflows"
as permissive
for update
to public
using ((public.authorize('workflows.update'::text) AND false));

CREATE TRIGGER update_circuit_breaker_states_timestamp BEFORE UPDATE ON public.circuit_breaker_states FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_configs_timestamp BEFORE UPDATE ON public.job_configs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_metrics_timestamp BEFORE UPDATE ON public.job_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_queue_stats_timestamp BEFORE UPDATE ON public.job_queue_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_versions_timestamp BEFORE UPDATE ON public.job_versions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_jobs_timestamp BEFORE UPDATE ON public.workflow_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflows_timestamp BEFORE UPDATE ON public.workflows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Cron Jobs
-- Note: Common maintenance jobs are handled in a separate migration
-- This section only includes additional custom jobs
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM cron.job 
    WHERE command = 'SELECT sync_all_logs()'
  ) THEN
    PERFORM cron.schedule(
      'select_sync_all_logs',
      '*/5 * * * *',
      'SELECT sync_all_logs()'
    );

END IF;

END $$;
