<h1 align="center" style="margin-top: 0px;">Astrotribe</h1>
<!-- <p align="center" style="margin-bottom: 0px !important;">
  <img width="200" src="https://github.com/Drew-Macgibbon/design-portfolio/blob/main/public/readme/doom-logo.png" align="center">
</p> -->
<p align="center" >The Astrotribe App is a social network for astronomers and wannabe astronomers around the globe.</p>

<p align="center" ><a href="">The Website</a></p>


&nbsp;  
&nbsp;   

## Table of Contents

- **Stack**
- **Housekeeping**
- **Planned Work**
  - [Sprint 1](#sprint-1)
  - [Sprint 2](#sprint-2)


## Stack

- Nuxt 3
  - [@nuxt/content:](https://content.nuxtjs.org/guide/writing/content-directory) For rendering static pages using Markdown files
  - [@nuxtjs/color-mode:](https://color-mode.nuxtjs.org/) easy light/dark mode
  - [@nuxtjs/partytown:](https://github.com/nuxt-modules/partytown) extract blocking JS to a separate thread
- TypeScript
- Node
  - Trpc
  - Zod - Data Validation
- [Eslint:]()
  - [@nuxtjs/eslint-config-typescript]()
    [@typescript-eslint/parser:]()
    [eslint-plugin-vue:]()
- Supabase
- Cypress - For testing
- Tailwind 3
  - [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
  - [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms)
- [Historie:](https://histoire.dev/) For developing components in isolation (Storybook alternative)
  - [@histoire/plugin-nuxt](https://github.com/histoire-dev/histoire/tree/main/packages/histoire-plugin-nuxt)


## Housekeeping

#### Mindset

Because we're in the early stages, we're going to need to [do things that don't scale](http://paulgraham.com/ds.html)

For example:
- Personally verifying and venue owners, this will also allow us to establish good relationships with them.
- Manually adding events to the database.
- Receiving payment on premise or through a simple QR code.
- Manual moderation through accepting requests through support.

We **MUST** focus on keeping things simple otherwise this project will never make it off the ground.

Part of the reason I've chosen to go with Postgres/Supabase is because it dramatically reduces the complexity of our application. 

We can use Postgres for caching, message queues, data warehouses, full text search, geospacial queries, and more. We can use Postgres to generate JSON in the database, write no server side code and directly give it to the API. We can use Postgres with a GraphQL adapter to deliver GraphQL if needed.

If we get to the point where we have over 1 million users we might need to consider a change in structure, but that's a good problem to have.

#### Git Comments will follow this format:
- **build**: Build related changes (eg: npm related/ adding external dependencies)
- **chore**: A code change that external user won't see (eg: change to .gitignore file or .prettierrc file)
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation related changes
- **refactor**: A code that neither fix bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/ function name)
- **perf**: A code that improves performance
- **style**: A code that is related to styling
- **test**: Adding new test or making changes to existing test


#### Story Points for work estimations:

- **SP1**: small tasks, simple UI, predictable | 1 hour
- **SP1**: easy tasks, predictable, known technologies | 2 hours
- **SP1**: medium tasks, new technologies, semi-complex, good documentation | 4 hours
- **SP1**: time-consuming tasks, hard to predict, familiar concepts, entire functionality | 6 hours
- **SP1**: challenging tasks, complex functionality, new technologies, features | 12 hours

I will attach "**SP!**" etc. to my commits to indicate the amount of work I thought it would take. and how long it actually did.

## Planned Work
I will break the below work into sprints, and track this through the [Project Board]().
Each sprint should not have more than 48 hours of estimated work.  

  
#### MVP Pages [#18](https://github.com/astronera/astrotribe/issues/18)

## Sprints

I have broken the MVP work into 3 sprints, each sprint should not have more than 48 hours of estimated work.

1. Build Brain
2. Construct Skeleton/Muscles
3. Add Skin

#### [MVP Sprint Overview](https://github.com/orgs/astronera/projects/1/views/3)
#### [Track Current Sprint](https://github.com/orgs/astronera/projects/1/views/4)


<!-- MUST GO OVER THIS AND REMOVE ANYTHING THAT IS NOT NEEDED
Moderation
Automatically flag certain posts
Admin
Accept / Reject
Ban Users
Warn Users
Points System
Login once per day
Number of posts
Number of comments
Activity Stream
Likes
Comments
Update profile
Payments
Follow
Followed
Posts
Notifications
Followed
Comment Liked
Post liked
Mentione
Replied to
Search
Hashtags
Categories
Fuzzy search
Profanity Filter
Language Blacklist
Pornography
Memberships
Checkout
Courses
Categories
Modules
Lessons
Text
Video
Image
Quizzes
Questions
Answers
Results
Assignments
Outline
Files
Submission
Review
Result
Users
User List
Student
Moderators
Messaging
Group (By topic)
One-on-one (Network)
Features
Text
Images
Gifs
Video
Audio
@ mentions
Events
RSVP
Reviews
Attendees
Group Messaging
Blog
Blog for each user
Comments
Knowledgebase
Sorted by topic
Famouse Astronomers
By Topic / Era
Discoveries / Research
Bio
Feedback
Display feedback publically
Sort by priority
Create timeline
Changelog
GEO Location
Users near me
Venues Near me
Events near me
Reviews
Replies
Rating
Groups
News Feed
By Category
User List
Private & Public
Comments
@mentions
Posts
@mentions
Companies
Employees 
PWA - nuxt/pwa Allows mobile downloads of the app
Optimized image serving / Compression
User Profiles
-->
