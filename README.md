<h1 align="center" style="margin-top: 0px;">AstroTribe</h1>
<!-- <p align="center" style="margin-bottom: 0px !important;">
  <img width="200" src="https://github.com/Drew-Macgibbon/design-portfolio/blob/main/public/readme/doom-logo.png" align="center">
</p> -->
<p align="center" >The AstroTribe App is a social network for astronomers and wannabe astronomers around the globe.</p>

<p align="center">
  <a href="https://astronera.org/">Production</a> --- |  .  | --- <a href="https://astrotribe.vercel.app/">Development</a>
</p>

We're currently working towards an open beta release. If you'd like to be notified when we launch,
register your interest [here](https://astrotribe.vercel.app/auth/register)

### Contributing:

Clone the `develop` Branch Create your Feature Branch `git checkout -b feature/amazing-feature` Open
a Pull Request against `develop` when the feature is ready for review

### Development Setup:

supabase: http://localhost:54323/project/default

#### Find Work:

##### Categories

1. **`infra:` Infrastructure & Foundations**
   - **Scope**: This domain encompasses all backend infrastructure elements critical to application functionality. It includes the management of server environments, authentication systems, application programming interfaces (APIs), data storage solutions, logging systems, and any other foundational services or protocols that support application operations.
   - **Example Tasks**: Set up secure authentication methods, optimize API performance, implement comprehensive logging systems, and configure cloud storage solutions.

2. **`logic:` Business Logic & Processing**
   - **Scope**: Focuses on the core functionality that users interact with directly. This domain includes the creation and maintenance of the operational logic that drives the application's primary features—from user inputs leading to actions (like button clicks) to data processing and output formatting.
   - **Example Tasks**: Develop a new feature that formats user data for reports, refactor validation logic to enhance security, create storage procedures for user inputs.

3. **`design:` User Interface & Experience Design**
   - **Scope**: Dedicated to the aesthetic and functional design of user interfaces and the underlying software architecture. This domain covers everything from UI/UX design for improved user interaction to strategic database and software architecture planning for efficient data management and flow.
   - **Example Tasks**: Redesign the user interface for enhanced usability, create a responsive design for mobile platforms, plan and model a new database schema for scalability.

4. **`test:` Quality Assurance & Testing**
   - **Scope**: Ensures that all features operate as intended before they reach end-users. This domain involves developing and maintaining a robust testing framework, including unit tests, integration tests, system tests, and ensuring new functionalities are covered as they are developed.
   - **Example Tasks**: Write integration tests for a new API endpoint, update existing tests to cover recent changes in business logic, automate regression testing scenarios.

5. **`bug:` Issue Resolution & Debugging**
   - **Scope**: A cross-domain responsibility focused on identifying, tracking, and resolving bugs throughout the application. This domain ensures that issues are promptly addressed to maintain the integrity and performance of the application across all other domains.
   - **Example Tasks**: Fix a critical bug affecting user login, resolve a recurring error in data formatting, debug a performance issue in database queries.



##### Search for Jobs

Key = category | priority | difficulty | time estimate
<!-- // teams work in small groups on single feature end to end -->

**Remove '~' from your search, it's for doc search exclusion**

```ts
// Frontend Work
// 
// ~infra:low:easy:1 - Routine Check: Perform daily server status check.
// ~logic:med:med:3 - Update Rollout: Deploy new software updates to the server cluster.
// ~design:high:hard:4 - Infrastructure Overhaul: Redesign the network architecture for increased efficiency.
// ~test:urgent:challenge:8 - Disaster Recovery: Implement immediate fixes following a critical system failure.
// ~bug:todo:critical:extreme:12 - Full System Rebuild: Reconstruct server environment and restore all critical services post-major outage.
```

**Backend uses a ! prefix**

```ts
// Backend Work (! prefix)
//
// ~!infra:low:easy:1
```

**Database uses # for comments**

```bash
# Database Work (# for comments) 
#
# ~infra:low:easy:1
```

#### Stack

- Nuxt
- Vercel
- Supabase

#### Links

- Dev Site: https://astrotribe-git-develop-incubrain.vercel.app

#### Supabase:

install supabase locally if you don't have it already.

```bash
brew install supabase/tap/supabase
```

```bash
// make sure docker is open
// download the images
supabase start
//
supabase login
// link the local project to production
supabase link --project-ref <project-id>
// pull down the database
supabase db pull
```

#### Migrations:

```bash
// create a migration based on changes made in local studio
supabase db diff -f new_employee
// reset db to verify changes
supabase db reset
```
