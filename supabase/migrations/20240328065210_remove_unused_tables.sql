revoke insert on table "public"."seo_data" from "service_role";

revoke select on table "public"."seo_data" from "service_role";

revoke update on table "public"."seo_data" from "service_role";

revoke insert on table "public"."statuses" from "service_role";

revoke select on table "public"."statuses" from "service_role";

revoke update on table "public"."statuses" from "service_role";

alter table "public"."seo_data" drop constraint "seo_data_pkey";

alter table "public"."statuses" drop constraint "statuses_pkey";

drop index if exists "public"."idx_seodata_country";

drop index if exists "public"."idx_seodata_date";

drop index if exists "public"."idx_seodata_domain";

drop index if exists "public"."idx_seodata_keyword";

drop index if exists "public"."seo_data_pkey";

drop index if exists "public"."statuses_pkey";

drop table "public"."seo_data";

drop table "public"."statuses";

drop sequence if exists "public"."seo_data_id_seq";

drop sequence if exists "public"."statuses_id_seq";


