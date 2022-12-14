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
- Tailwind 3
  - [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
  - [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms)
- [Historie:](https://histoire.dev/) For developing components in isolation (Storybook alternative)
  - [@histoire/plugin-nuxt](https://github.com/histoire-dev/histoire/tree/main/packages/histoire-plugin-nuxt)


Part of the reason I've chosen to go with Postgres/Supabase is because it dramatically reduces the complexity of our application. We don't have to worry about setting up a database, or managing migrations, or writing SQL queries. We can just focus on building the app. Granted we will be paying $25 USD a month, plus $0.021 per GB of 100GB excess storage, which is about twice as much as AWS S3 Buckets, but the simplicity is easily worth it.

Simplicity is key here, and I think we can achieve that by using Postgres/Supabase for almost all our backend. We can use Postgres for caching, message queues, data warehouses, full text search, geospacial queries, and more. We can use Postgres to generate JSON in the database, write no server side code and directly give it to the API. We can use Postgres with a GraphQL adapter to deliver GraphQL if needed. We can use Postgres to generate JSON in the database, write no server side code and directly give it to the API. We can use Postgres with a GraphQL adapter to deliver GraphQL if needed.

If we get to the point where we have over 1 million users we might need to consider a change in structure, but that's a good problem to have.


## Housekeeping

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


### **story points** for estimations:

- **small**: 1 hour
- **easy**: 2 hours
- **medium**: 4 hours
- **hard**: 6 hours
- **challenging**: 12 hours


## Planned Work
I will break the below work into sprints, and will update this as we go.
I will also be using the [Project Board]() to track progress.
Each sprint should not have more than 48 hours of estimated work.  

  
### What must the MVP have?
- [ ] Landing Page
-  [ ] Login Flow
  -  [ ] Login
  -  [ ] Register
  -  [ ] Forgot Password
-  [ ] Home
  -  [ ] News Feed
  -  [ ] User Feed
  -  [ ] Search
  -  [ ] Explore
- [ ] User Profile
- [ ] Venues
  - [ ] Single Venue


### Sprint 1 - Build the skeleton (55 hour(s) projected work)
- [ ] Host master branch on render.com | 1 hour(s)
- [ ] Tailwind light/dark themeing | 2 hour(s)
- [ ] Supabase | 26 hour(s)
  - [ ] Connect to database, create composable | 2 hour(s)
  - [ ] Authenticate with email/password, register/login page | 6 hour(s)
  - [ ] Password reset, including page & functionality | 4 hour(s)
  - [ ] Setup database as per the DB design | 4 hour(s)
  - [ ] Authorize Admin Permissions | 4 hour(s)
  - [ ] Setup S3 Bucket for Image/Videos, served with optimization and via CDN | 6 hour(s)
- [ ] Create a decent landing page | 12 hour(s)
- [ ] Components | 28 hour(s) 
  - [ ] Navbar | 2 hour(s)
  - [ ] Mobile Nav | 2 hour(s)
  - [ ] Footer | 2 hour(s) 
  - [ ] Login | 2 hour(s)
  - [ ] Logout | 2 hour(s)
  - [ ] Register | 2 hour(s)
  - [ ] User Post | 4 hour(s)
  - [ ] Venue Card | 4 hour(s)
  - [ ] Avatar | 1 hour(s)
  -  [ ] Dropdowm | 1 hour(s)
  -  [ ] Basic profile | 4 hour(s)

**SPEND AT LEAST 1/4th THE TIME TAKEN REFACTORING**

### Sprint 2 - Making the MVP work! (48 hour(s) projected work)
-  [ ] Regular, mentor, instructor, astroguide, admin roles | 4 hour(s)
-  [ ] News Feed: 
  -  [ ] New posts
-  [ ] Posts: only admins can create posts to start, we will be curating news for our users. | 4 hour(s)
  -  [ ] Text post: add a simple textbox, nothing fancy for now | 2 hour(s)
  -  [ ] Images | 2 hour(s)
-  [ ] Venues | 12 hour(s)
  -  [ ] Owner: manually assigned by admins to start | 1 hour(s) 
  -  [ ] Amenities | 1 hour(s)
  -  [ ] About | 1 hour(s)
  -  [ ] Location: might integrate maps for this, if so, bump to 4 hours | 2 hour(s)
  -  [ ] Events:
    - [ ] Event Card: Venue, date, spots available, timings, title, organizers | 2 hour(s)
    - [ ] Event Functionality: searchable, RSVP button, associate users, astroguides, and venues | 4 hour(s)
    - [ ] Search Events: users sould be able to filter events by location and date - This will require fuzzy search | 12 hour(s)
    - [ ] Attach events to venue: each event should be displayable on the venue page | 4 hour(s)
    - [ ] Event page: showcase event in more detail, only bookable by phone to begin | 6 hour(s)
    - [ ] Reviews: required for events and astroguides, need to think about how to structure this in DB/Code | 12 hour(s)



### Anything below this line is outside the scope of our MVP
---


### Sprint 3 - Making the MVP work! (48 hour(s) projected work)
  -  [ ] Personal Feed
-  [ ] Comments
  -  [ ] text
  -  [ ] replies
-  [ ] reactions
-  [ ] Connections:
  -  [ ] Follow
  -  [ ] Friend
  -  [ ] Mentor/Mentee

-  [ ] User Profiles
  - [ ] User can update their profile
  - [ ] User can upload a profile picture
    - [ ] Picture
    - [ ] Username
    - [ ] First + Last Name
    - [ ] Username
    - [ ] Bio

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
Employees -->

## Sprint 4 - Optimizing
-  [ ] PWA - nuxt/pwa Allows mobile downloads of the app
-  [ ] Optimized image serving / Compression
-  [ ] User Profiles
-  [ ] User Profiles