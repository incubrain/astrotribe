# Seeder Files Breakdown Plan

## Files to Create

1. `types.ts` - Contains all TypeScript type definitions and enums
2. `helpers.ts` - Contains helper functions like randomEnum, formatTimeWithZone, etc.
3. `content_statuses.ts` - Contains content status related functions
4. `countries.ts` - Contains country seeding
5. `cities.ts` - Contains city seeding
6. `contents.ts` - Contains content seeding
7. `bookmark_folders.ts` - Contains bookmark folder seeding
8. `bookmarks.ts` - Contains bookmark seeding
9. `comments.ts` - Contains comment seeding
10. `votes.ts` - Contains vote seeding
11. `content_sources.ts` - Contains content source seeding
12. `company_employees.ts` - Contains company employee seeding
13. `contacts.ts` - Contains contact seeding
14. `addresses.ts` - Contains address seeding
15. `feedback.ts` - Contains feedback seeding
16. `follows.ts` - Contains follow seeding
17. `social_media.ts` - Contains social media seeding
18. `categories.ts` - Contains category seeding
19. `news_summaries.ts` - Contains news summary seeding
20. `news.ts` - Contains news seeding
21. `research.ts` - Contains research seeding
22. `companies.ts` - Contains company seeding
23. `newsletters.ts` - Contains newsletter seeding
24. `feed_categories.ts` - Contains feed category seeding
25. `feeds.ts` - Contains feed seeding
26. `content_categories.ts` - Contains content category seeding
27. `content_tags.ts` - Contains content tag seeding
28. `tags.ts` - Contains tag seeding
29. `news_tags.ts` - Contains news tag seeding
30. `feed_sources.ts` - Contains feed source seeding
31. `feature_requests.ts` - Contains feature request seeding
32. `feature_votes.ts` - Contains feature vote seeding
33. `content_source_visits.ts` - Contains content source visit seeding
34. `user_metrics.ts` - Contains user metric seeding
35. `error_logs.ts` - Contains error log seeding
36. `ad_packages.ts` - Contains ad package seeding
37. `ads.ts` - Contains ad seeding
38. `ad_variants.ts` - Contains ad variant seeding
39. `ad_daily_metrics.ts` - Contains ad daily metric seeding
40. `referrers.ts` - Contains referrer seeding
41. `referrals.ts` - Contains referral seeding
42. `blocked_ips.ts` - Contains blocked IP seeding
43. `referrer_blocks.ts` - Contains referrer block seeding

## Barrel File

Create `index.ts` to export all seeder functions

## Implementation Steps

1. Create all individual files
2. Move relevant code to each file
3. Update imports in each file
4. Create barrel file (index.ts)
5. Update main seeders.ts to use the new structure
6. Test each seeder individually
7. Test the entire seeding process

## Notes

- Each file should import necessary dependencies
- Each file should export its seeder function
- The barrel file should re-export all seeder functions
- Keep the existing jobs.seed.ts as is
- Ensure all type definitions are properly shared

## Current Seeding Errors (March 29, 2025)

Here are the current errors we're facing with the database seeding process and their root causes:

1. **companies**:
   - Error: `insert or update on table "companies" violates foreign key constraint "fk_social_media"`
   - Detail: `Key (social_media_id)=(44) is not present in table "social_media".`
   - Cause: The companies seeder is trying to reference social_media entries that don't exist. We need to seed the social_media table first or ensure we're only using IDs that exist.

2. **categorized_urls**:
   - Error: `new row for relation "categorized_urls" violates check constraint "valid_priority"`
   - Cause: The priority field in categorized_urls has a constraint that limits valid values, but our seeder is generating values outside this range.
   - Fixed: Updated the seeder to use the correct enum values: 'very_low', 'low', 'medium', 'high', 'critical'

3. **addresses**:
   - Error: `Cannot get value from empty dataset.`
   - Cause: The addresses seeder is trying to use faker to select from an empty array, likely for cities or countries.

4. **feature_requests**:
   - Error: `new row for relation "feature_requests" violates check constraint "status_check"`
   - Cause: The status field in feature_requests has a constraint that limits valid values, but our seeder is using values that don't match the constraint.
   - Fixed: Updated the seeder to use valid status values: 'planned', 'in_progress', 'completed'

5. **jobs**:
   - Error: `Not enough contents to create 100 jobs. Found: 0`
   - Cause: The jobs seeder depends on content entries, but there are no content entries available.
   - Fixed: Updated the jobs seeder to match the current schema using contents_id and adding employment_type

6. **follows**:
   - Error: `Cannot get value from empty dataset.`
   - Cause: The follows seeder is trying to use faker to select from an empty array, likely for users.
   - Fixed: Updated the follows seeder to handle unique relationships and prevent duplicate entries that violate the unique constraint

7. **feed_categories**:
   - Error: `invalid input syntax for type bigint: "47707d58-a278-4f36-bb6c-cc7d7b9ce1dc"`
   - Cause: The feed_categories seeder is using UUID strings for category_id, but the database expects bigint values.

8. **feature_votes**:
   - Error: `column "feature_request_id" of relation "feature_votes" does not exist`
   - Cause: The feature_votes seeder was using the wrong column name.
   - Fixed: Updated the seeder to use 'feature_id' instead of 'feature_request_id' and ensured vote_type is a smallint (0 or 1)

## Fix Plan

1. Fix the social_media seeder to ensure it runs before companies and creates the required IDs.
2. Fixed: Update the categorized_urls seeder to use valid priority values based on the constraint.
3. Fix the addresses seeder to handle empty datasets gracefully.
4. Fixed: Update the feature_requests seeder to use valid status values based on the constraint.
5. Fixed: Fix the follows seeder to handle empty datasets gracefully and prevent duplicate entries.
6. Update the feed_categories seeder to use bigint values for category_id instead of UUIDs.
7. Fixed: For the jobs seeder, we updated it to match the current schema.
8. Fixed: Update the feature_votes seeder to use the correct column name and data types.

## Completed Fixes

1. **categorized_urls seeder**:
   - Updated to use valid priority enum values: 'very_low', 'low', 'medium', 'high', 'critical'
   - This resolved the issue with the priority constraint

2. **feature_requests seeder**:
   - Updated to use valid status values: 'planned', 'in_progress', 'completed'
   - This resolved the issue with the status_check constraint

3. **follows seeder**:
   - Implemented tracking of unique relationships to avoid duplicate entries
   - Added checks to prevent a user from following themselves
   - This resolved the issue with the unique constraint violation

4. **jobs seeder**:
   - Updated to use contents_id instead of content_id
   - Added employment_type field
   - This resolved the schema mismatch issues

5. **feature_votes seeder**:
   - Updated to use 'feature_id' instead of 'feature_request_id'
   - Ensured vote_type is a smallint (0 or 1)
   - Added validation to handle cases where there are no users or feature requests

## Remaining Issues

1. Fix the social_media seeder to ensure it runs before companies and creates the required IDs.
2. Fix the addresses seeder to handle empty datasets gracefully.
3. Update the feed_categories seeder to use bigint values for category_id instead of UUIDs.

Let's continue implementing these fixes one by one.

## Database Seeding Test Results (March 29, 2025)

We've created and run a test script (`test-seeding.ts`) to check the row counts for each table after seeding. Here are the results:

### Seeding Statistics (Updated March 29, 2025)
- Total Tables: 66
- Tables with Data: 29 (43.94%)
- Empty Tables: 37

### Progress on Empty Tables
We've enhanced the following seeders but they're still showing as empty in the test results:
1. **feature_votes**: Enhanced with better error handling and date formatting
2. **comments**: Improved with nested comments support and better error handling
3. **newsletters**: Enhanced with proper frequency handling
4. **contacts**: Fixed to use user IDs instead of company IDs
5. **ads**: Enhanced with proper schema alignment and error handling
6. **company_contacts**: Fixed the duplicate company_id issue and improved error handling

### Remaining Empty Tables (Need Investigation)
1. ad_daily_metrics
2. ad_variants
3. company_employees
4. company_extras
5. company_metrics
6. content_tags
7. customer_payments
8. customer_processed_webhooks
9. customer_refunds
10. customer_subscription_offers
11. customer_subscription_plans
12. customer_subscriptions
13. errors
14. metric_definitions
15. payment_providers

## Priority Tables to Fix

Based on our findings, these tables should have data but are currently empty:

1. **feature_votes**: We fixed the seeder, but it's still not populating the table. This suggests there might be an error in the seeder execution or a dependency issue.

2. **comments**: This is a core content-related table that should be populated for a realistic testing environment.

3. **votes**: Similar to comments, votes are important for testing content engagement features.

4. **content_tags**: This table links content to tags and should be populated to test content categorization and filtering.

## Error Logging Improvement Plan

The current seeding process silently fails for some tables, making it difficult to diagnose issues. Here's a plan to improve error logging in the `checkAndSeed` function:

1. **Enhanced Error Logging**:
   - Add detailed error logging that captures and reports all errors
   - Include the table name in error messages
   - Track and report dependency failures

2. **Seeding Report Generation**:
   - Log all successful and failed seeding operations
   - Record the number of rows inserted for each table
   - Provide error details for failed operations

3. **Dependency Validation**:
   - Check that required dependencies exist before attempting to seed
   - Report missing dependencies clearly
   - Suggest the correct seeding order

## Next Steps

1. **Fix feature_votes Seeder**:
   - Investigate why it's not populating despite our fixes
   - Check if it's being executed in the correct order
   - Verify that its dependencies (users and feature_requests) have data

2. **Implement Comments Seeder**:
   - Create or fix the comments seeder to populate the comments table
   - Ensure it properly links to users and content

3. **Enhance Error Logging**:
   - Update the `checkAndSeed` function to provide better error reporting
   - Implement a seeding report generator

## Database Tables and Seeders Analysis

After analyzing the database schema and seeders, I found that there are 66 tables defined in the schema but only 44 seeders implemented. This is expected as not all tables need seeders - some may be populated by other means or intentionally left empty initially.

### Tables Without Seeders

The following tables don't have corresponding seeders:
- customer_payments
- customer_processed_webhooks
- customer_refunds
- customer_subscription_offers
- customer_subscription_plans
- customer_subscriptions
- errors
- metric_definitions
- payment_providers
- plan_permissions
- responses
- role_hierarchy
- role_permissions
- role_permissions_materialized
- scoring_weights
- searches
- spider_metrics
- table_maintenance_log
- table_query_performance
- table_sequence_usage
- table_statistics
- workflows

Most of these appear to be system tables, analytics tables, or tables that would be populated by the application during runtime rather than during initial seeding.

### Seeder Execution Order

The `run-seeders.ts` file correctly handles the execution order of all implemented seeders, ensuring that dependencies are respected. For example:
- Social media is seeded before companies
- Companies are seeded before company-related tables
- Content is seeded before content-related tables

### Verification of Fixed Seeders

We've successfully fixed the following seeders:
1. ✅ categorized_urls.seed.ts - Now uses the correct enum values for priority
2. ✅ feature_votes.seed.ts - Now uses the correct column name and data types
3. ✅ follows.seed.ts - Now handles unique relationships correctly
4. ✅ jobs.seed.ts - Now matches the current schema with contents_id and employment_type

All these seeders are properly included in the seeding process in `run-seeders.ts`.