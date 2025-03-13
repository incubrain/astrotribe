drop trigger if exists "update_circuit_breaker_states_timestamp" on "public"."circuit_breaker_states";

drop trigger if exists "update_embedding_reviews_timestamp" on "public"."embedding_reviews";

drop trigger if exists "update_feedbacks_timestamp" on "public"."feedbacks";

drop trigger if exists "update_news_summaries_timestamp" on "public"."news_summaries";

drop trigger if exists "update_research_embeddings_timestamp" on "public"."research_embeddings";

revoke delete on table "public"."circuit_breaker_states" from "anon";

revoke insert on table "public"."circuit_breaker_states" from "anon";

revoke references on table "public"."circuit_breaker_states" from "anon";

revoke select on table "public"."circuit_breaker_states" from "anon";

revoke trigger on table "public"."circuit_breaker_states" from "anon";

revoke truncate on table "public"."circuit_breaker_states" from "anon";

revoke update on table "public"."circuit_breaker_states" from "anon";

revoke delete on table "public"."circuit_breaker_states" from "authenticated";

revoke insert on table "public"."circuit_breaker_states" from "authenticated";

revoke references on table "public"."circuit_breaker_states" from "authenticated";

revoke select on table "public"."circuit_breaker_states" from "authenticated";

revoke trigger on table "public"."circuit_breaker_states" from "authenticated";

revoke truncate on table "public"."circuit_breaker_states" from "authenticated";

revoke update on table "public"."circuit_breaker_states" from "authenticated";

revoke delete on table "public"."circuit_breaker_states" from "service_role";

revoke insert on table "public"."circuit_breaker_states" from "service_role";

revoke references on table "public"."circuit_breaker_states" from "service_role";

revoke select on table "public"."circuit_breaker_states" from "service_role";

revoke trigger on table "public"."circuit_breaker_states" from "service_role";

revoke truncate on table "public"."circuit_breaker_states" from "service_role";

revoke update on table "public"."circuit_breaker_states" from "service_role";

revoke delete on table "public"."embedding_reviews" from "anon";

revoke insert on table "public"."embedding_reviews" from "anon";

revoke references on table "public"."embedding_reviews" from "anon";

revoke select on table "public"."embedding_reviews" from "anon";

revoke trigger on table "public"."embedding_reviews" from "anon";

revoke truncate on table "public"."embedding_reviews" from "anon";

revoke update on table "public"."embedding_reviews" from "anon";

revoke delete on table "public"."embedding_reviews" from "authenticated";

revoke insert on table "public"."embedding_reviews" from "authenticated";

revoke references on table "public"."embedding_reviews" from "authenticated";

revoke select on table "public"."embedding_reviews" from "authenticated";

revoke trigger on table "public"."embedding_reviews" from "authenticated";

revoke truncate on table "public"."embedding_reviews" from "authenticated";

revoke update on table "public"."embedding_reviews" from "authenticated";

revoke delete on table "public"."embedding_reviews" from "service_role";

revoke insert on table "public"."embedding_reviews" from "service_role";

revoke references on table "public"."embedding_reviews" from "service_role";

revoke select on table "public"."embedding_reviews" from "service_role";

revoke trigger on table "public"."embedding_reviews" from "service_role";

revoke truncate on table "public"."embedding_reviews" from "service_role";

revoke update on table "public"."embedding_reviews" from "service_role";

revoke delete on table "public"."feed_categories_id_mapping" from "anon";

revoke insert on table "public"."feed_categories_id_mapping" from "anon";

revoke references on table "public"."feed_categories_id_mapping" from "anon";

revoke select on table "public"."feed_categories_id_mapping" from "anon";

revoke trigger on table "public"."feed_categories_id_mapping" from "anon";

revoke truncate on table "public"."feed_categories_id_mapping" from "anon";

revoke update on table "public"."feed_categories_id_mapping" from "anon";

revoke delete on table "public"."feed_categories_id_mapping" from "authenticated";

revoke insert on table "public"."feed_categories_id_mapping" from "authenticated";

revoke references on table "public"."feed_categories_id_mapping" from "authenticated";

revoke select on table "public"."feed_categories_id_mapping" from "authenticated";

revoke trigger on table "public"."feed_categories_id_mapping" from "authenticated";

revoke truncate on table "public"."feed_categories_id_mapping" from "authenticated";

revoke update on table "public"."feed_categories_id_mapping" from "authenticated";

revoke delete on table "public"."feed_categories_id_mapping" from "service_role";

revoke insert on table "public"."feed_categories_id_mapping" from "service_role";

revoke references on table "public"."feed_categories_id_mapping" from "service_role";

revoke select on table "public"."feed_categories_id_mapping" from "service_role";

revoke trigger on table "public"."feed_categories_id_mapping" from "service_role";

revoke truncate on table "public"."feed_categories_id_mapping" from "service_role";

revoke update on table "public"."feed_categories_id_mapping" from "service_role";

revoke delete on table "public"."feed_sources_id_mapping" from "anon";

revoke insert on table "public"."feed_sources_id_mapping" from "anon";

revoke references on table "public"."feed_sources_id_mapping" from "anon";

revoke select on table "public"."feed_sources_id_mapping" from "anon";

revoke trigger on table "public"."feed_sources_id_mapping" from "anon";

revoke truncate on table "public"."feed_sources_id_mapping" from "anon";

revoke update on table "public"."feed_sources_id_mapping" from "anon";

revoke delete on table "public"."feed_sources_id_mapping" from "authenticated";

revoke insert on table "public"."feed_sources_id_mapping" from "authenticated";

revoke references on table "public"."feed_sources_id_mapping" from "authenticated";

revoke select on table "public"."feed_sources_id_mapping" from "authenticated";

revoke trigger on table "public"."feed_sources_id_mapping" from "authenticated";

revoke truncate on table "public"."feed_sources_id_mapping" from "authenticated";

revoke update on table "public"."feed_sources_id_mapping" from "authenticated";

revoke delete on table "public"."feed_sources_id_mapping" from "service_role";

revoke insert on table "public"."feed_sources_id_mapping" from "service_role";

revoke references on table "public"."feed_sources_id_mapping" from "service_role";

revoke select on table "public"."feed_sources_id_mapping" from "service_role";

revoke trigger on table "public"."feed_sources_id_mapping" from "service_role";

revoke truncate on table "public"."feed_sources_id_mapping" from "service_role";

revoke update on table "public"."feed_sources_id_mapping" from "service_role";

revoke delete on table "public"."feedbacks" from "anon";

revoke insert on table "public"."feedbacks" from "anon";

revoke references on table "public"."feedbacks" from "anon";

revoke select on table "public"."feedbacks" from "anon";

revoke trigger on table "public"."feedbacks" from "anon";

revoke truncate on table "public"."feedbacks" from "anon";

revoke update on table "public"."feedbacks" from "anon";

revoke delete on table "public"."feedbacks" from "authenticated";

revoke insert on table "public"."feedbacks" from "authenticated";

revoke references on table "public"."feedbacks" from "authenticated";

revoke select on table "public"."feedbacks" from "authenticated";

revoke trigger on table "public"."feedbacks" from "authenticated";

revoke truncate on table "public"."feedbacks" from "authenticated";

revoke update on table "public"."feedbacks" from "authenticated";

revoke delete on table "public"."feedbacks" from "service_role";

revoke insert on table "public"."feedbacks" from "service_role";

revoke references on table "public"."feedbacks" from "service_role";

revoke select on table "public"."feedbacks" from "service_role";

revoke trigger on table "public"."feedbacks" from "service_role";

revoke truncate on table "public"."feedbacks" from "service_role";

revoke update on table "public"."feedbacks" from "service_role";

revoke delete on table "public"."news_summaries" from "anon";

revoke insert on table "public"."news_summaries" from "anon";

revoke references on table "public"."news_summaries" from "anon";

revoke select on table "public"."news_summaries" from "anon";

revoke trigger on table "public"."news_summaries" from "anon";

revoke truncate on table "public"."news_summaries" from "anon";

revoke update on table "public"."news_summaries" from "anon";

revoke delete on table "public"."news_summaries" from "authenticated";

revoke insert on table "public"."news_summaries" from "authenticated";

revoke references on table "public"."news_summaries" from "authenticated";

revoke select on table "public"."news_summaries" from "authenticated";

revoke trigger on table "public"."news_summaries" from "authenticated";

revoke truncate on table "public"."news_summaries" from "authenticated";

revoke update on table "public"."news_summaries" from "authenticated";

revoke delete on table "public"."news_summaries" from "service_role";

revoke insert on table "public"."news_summaries" from "service_role";

revoke references on table "public"."news_summaries" from "service_role";

revoke select on table "public"."news_summaries" from "service_role";

revoke trigger on table "public"."news_summaries" from "service_role";

revoke truncate on table "public"."news_summaries" from "service_role";

revoke update on table "public"."news_summaries" from "service_role";

revoke delete on table "public"."research_embeddings" from "anon";

revoke insert on table "public"."research_embeddings" from "anon";

revoke references on table "public"."research_embeddings" from "anon";

revoke select on table "public"."research_embeddings" from "anon";

revoke trigger on table "public"."research_embeddings" from "anon";

revoke truncate on table "public"."research_embeddings" from "anon";

revoke update on table "public"."research_embeddings" from "anon";

revoke delete on table "public"."research_embeddings" from "authenticated";

revoke insert on table "public"."research_embeddings" from "authenticated";

revoke references on table "public"."research_embeddings" from "authenticated";

revoke select on table "public"."research_embeddings" from "authenticated";

revoke trigger on table "public"."research_embeddings" from "authenticated";

revoke truncate on table "public"."research_embeddings" from "authenticated";

revoke update on table "public"."research_embeddings" from "authenticated";

revoke delete on table "public"."research_embeddings" from "service_role";

revoke insert on table "public"."research_embeddings" from "service_role";

revoke references on table "public"."research_embeddings" from "service_role";

revoke select on table "public"."research_embeddings" from "service_role";

revoke trigger on table "public"."research_embeddings" from "service_role";

revoke truncate on table "public"."research_embeddings" from "service_role";

revoke update on table "public"."research_embeddings" from "service_role";

revoke delete on table "public"."strapi_migrations" from "anon";

revoke insert on table "public"."strapi_migrations" from "anon";

revoke references on table "public"."strapi_migrations" from "anon";

revoke select on table "public"."strapi_migrations" from "anon";

revoke trigger on table "public"."strapi_migrations" from "anon";

revoke truncate on table "public"."strapi_migrations" from "anon";

revoke update on table "public"."strapi_migrations" from "anon";

revoke delete on table "public"."strapi_migrations" from "authenticated";

revoke insert on table "public"."strapi_migrations" from "authenticated";

revoke references on table "public"."strapi_migrations" from "authenticated";

revoke select on table "public"."strapi_migrations" from "authenticated";

revoke trigger on table "public"."strapi_migrations" from "authenticated";

revoke truncate on table "public"."strapi_migrations" from "authenticated";

revoke update on table "public"."strapi_migrations" from "authenticated";

revoke delete on table "public"."strapi_migrations" from "service_role";

revoke insert on table "public"."strapi_migrations" from "service_role";

revoke references on table "public"."strapi_migrations" from "service_role";

revoke select on table "public"."strapi_migrations" from "service_role";

revoke trigger on table "public"."strapi_migrations" from "service_role";

revoke truncate on table "public"."strapi_migrations" from "service_role";

revoke update on table "public"."strapi_migrations" from "service_role";

revoke delete on table "public"."strapi_migrations_internal" from "anon";

revoke insert on table "public"."strapi_migrations_internal" from "anon";

revoke references on table "public"."strapi_migrations_internal" from "anon";

revoke select on table "public"."strapi_migrations_internal" from "anon";

revoke trigger on table "public"."strapi_migrations_internal" from "anon";

revoke truncate on table "public"."strapi_migrations_internal" from "anon";

revoke update on table "public"."strapi_migrations_internal" from "anon";

revoke delete on table "public"."strapi_migrations_internal" from "authenticated";

revoke insert on table "public"."strapi_migrations_internal" from "authenticated";

revoke references on table "public"."strapi_migrations_internal" from "authenticated";

revoke select on table "public"."strapi_migrations_internal" from "authenticated";

revoke trigger on table "public"."strapi_migrations_internal" from "authenticated";

revoke truncate on table "public"."strapi_migrations_internal" from "authenticated";

revoke update on table "public"."strapi_migrations_internal" from "authenticated";

revoke delete on table "public"."strapi_migrations_internal" from "service_role";

revoke insert on table "public"."strapi_migrations_internal" from "service_role";

revoke references on table "public"."strapi_migrations_internal" from "service_role";

revoke select on table "public"."strapi_migrations_internal" from "service_role";

revoke trigger on table "public"."strapi_migrations_internal" from "service_role";

revoke truncate on table "public"."strapi_migrations_internal" from "service_role";

revoke update on table "public"."strapi_migrations_internal" from "service_role";

revoke delete on table "public"."tags_id_mapping" from "anon";

revoke insert on table "public"."tags_id_mapping" from "anon";

revoke references on table "public"."tags_id_mapping" from "anon";

revoke select on table "public"."tags_id_mapping" from "anon";

revoke trigger on table "public"."tags_id_mapping" from "anon";

revoke truncate on table "public"."tags_id_mapping" from "anon";

revoke update on table "public"."tags_id_mapping" from "anon";

revoke delete on table "public"."tags_id_mapping" from "authenticated";

revoke insert on table "public"."tags_id_mapping" from "authenticated";

revoke references on table "public"."tags_id_mapping" from "authenticated";

revoke select on table "public"."tags_id_mapping" from "authenticated";

revoke trigger on table "public"."tags_id_mapping" from "authenticated";

revoke truncate on table "public"."tags_id_mapping" from "authenticated";

revoke update on table "public"."tags_id_mapping" from "authenticated";

revoke delete on table "public"."tags_id_mapping" from "service_role";

revoke insert on table "public"."tags_id_mapping" from "service_role";

revoke references on table "public"."tags_id_mapping" from "service_role";

revoke select on table "public"."tags_id_mapping" from "service_role";

revoke trigger on table "public"."tags_id_mapping" from "service_role";

revoke truncate on table "public"."tags_id_mapping" from "service_role";

revoke update on table "public"."tags_id_mapping" from "service_role";

alter table "public"."circuit_breaker_states" drop constraint "circuit_breaker_states_job_name_key";

alter table "public"."feedbacks" drop constraint "fk_user";

alter table "public"."research_embeddings" drop constraint "public_research_embeddings_embedding_review_id_fkey";

alter table "public"."research_embeddings" drop constraint "research_embeddings_id_key";

alter table "public"."research_embeddings" drop constraint "research_embeddings_research_id_key";

drop function if exists "public"."match_research"(query_embedding vector, match_threshold double precision, match_count integer);

alter table "public"."circuit_breaker_states" drop constraint "circuit_breaker_states_pkey";

alter table "public"."embedding_reviews" drop constraint "embedding_review_pkey";

alter table "public"."feedbacks" drop constraint "feedback_pkey";

alter table "public"."news_summaries" drop constraint "news_summaries_pkey";

alter table "public"."research_embeddings" drop constraint "research_embeddings_pkey";

alter table "public"."strapi_migrations" drop constraint "strapi_migrations_pkey";

alter table "public"."strapi_migrations_internal" drop constraint "strapi_migrations_internal_pkey";

drop index if exists "public"."circuit_breaker_states_job_name_key";

drop index if exists "public"."circuit_breaker_states_pkey";

drop index if exists "public"."embedding_review_pkey";

drop index if exists "public"."feedback_pkey";

drop index if exists "public"."idx_circuit_breaker_job_name";

drop index if exists "public"."news_summaries_is_current_idx";

drop index if exists "public"."news_summaries_news_id_idx";

drop index if exists "public"."news_summaries_pkey";

drop index if exists "public"."research_embeddings_id_key";

drop index if exists "public"."research_embeddings_pkey";

drop index if exists "public"."research_embeddings_research_id_key";

drop index if exists "public"."strapi_migrations_internal_pkey";

drop index if exists "public"."strapi_migrations_pkey";

drop table "public"."circuit_breaker_states";

drop table "public"."embedding_reviews" cascade;

drop table "public"."feed_categories_id_mapping";

drop table "public"."feed_sources_id_mapping";

drop table "public"."feedbacks";

drop table "public"."news_summaries";

drop table "public"."research_embeddings" cascade;
drop table "public"."strapi_migrations";


drop table "public"."strapi_migrations_internal";

drop table "public"."tags_id_mapping";

drop sequence if exists "public"."feedback_id_seq";

drop sequence if exists "public"."research_embeddings_id_seq";

drop sequence if exists "public"."strapi_migrations_id_seq";

drop sequence if exists "public"."strapi_migrations_internal_id_seq";

CREATE TRIGGER update_astronomy_events_timestamp BEFORE UPDATE ON public.astronomy_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_subscription_offers_timestamp BEFORE UPDATE ON public.customer_subscription_offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
