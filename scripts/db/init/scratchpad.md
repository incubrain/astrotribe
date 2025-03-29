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
