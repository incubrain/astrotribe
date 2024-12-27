## Sources:

- Indian Academy of Sciences - JOURNAL OF ASTROPHYSICS AND ASTRONOMY
  https://www.ias.ac.in/listing/articles/joaa/045

## Basic Product

- Access all abstracts for scraped papers
- Store them in DB
- Create embeddings for all Research Abstracts, store in new table
- Connect Frontend searchbox to Supabase openai endpoint
- Create as postgres function to join the research table with research_embeddings results.
- Display the results to the user
- enable user interaction with data

## What will the user see NOW

#### General UI

- Search Box
- Have a group of buttons to configure the output. eg. Research, Direct, Summary to determine if the
  search responds with only the related content, or if it feeds it into the LLM for summarization.
- Example searches, to help them get started (clicking on this should send the query)
- Show copy button, downvote etc. (copy what chatGPT has at bottom of message), also allow users to
  star / bookmark messages to save them.
- inline LaTeX converted to equations
- Search History

#### Research Search

- User searches, and gets back N structured responses in a grid or table. No summary.
- Allow users to set their preference for grid / table

#### Direct Search

- Allow Search Filters For:
  - Dates
  - Author
  - Keywords
  - Category
  - DOI

#### Search Result (Direct & Research)

- Paper titles
- Authors (name and link)
- Figure / Page / Table # counts (as tags)
- Abstract (full or summarized)
- Link to PDF document
- Link to Arxiv (potentially)
- Published In (journal etc)
- Category

## Summary Search

- User asks a question
- N related abstracts are returned
- user should be able to configure the LLM base prompt (use presets)
  - You are a science communicator
  - You are a research writer
- The response is displayed in a chat interface
- If flagged the question / N related docs / LLM Response are stored in a table for review.

**consider creating script to extract published in from comment**

## What will user see in future

- PDF fully extracted, show full paper as HTML with LaTeX inline
- Full List of Citations, users can choose Citation Type
- Search can respond with segments of the full paper
- Extracted Keywords are displayed
- Bookmark icon for bookmarking / adding to bookmark group
- Show sources
- Show References to Tools / Institutions / Tables / Figures etc
- Ability to switch between table and grid display
- Share button for search
- Share collections of papers
- add comments under papers
- Button to "Cite"
- Ability to upload and interact with papers

## Technical Improvements

- Save all users searches (this can be used to provide recommendations to the user)
- Save flagged papers to
- Additional sources, other than ARXIV.
- Create AI agent that ranks papers based on a number of factors such as # of citations, author
  credability, published_in etc.
- Allow users to upvote
- Integrate translations API, allow users to translate N articles per month (store translations to
  benefit other users as time goes on)
  - Hire professional translators to review

## Basic Plan

- How many responses per search (can have different tiers)

## Pro Plan

## Expert Plan

## Data Storage

- Message history is temporarily stored, only starred messages are saved.
- Flagged messages are stored for review
- All questions are stored, as they will have to be vectorized, so we can save cost by storing the
  embedding for common questions.
- Storage of 300k PDFs will be approx. 1.2TB, this can be done in supabase for ~$30 a month ($25 per
  1TB)
-

## Scraping Requirements

- We may be able to use the arxiv api to get the latest articles once per day
- if not we will start by scraping the arxiv archive pages once a month or week depending on
  difficulty

## Our USP

- User Preferences (most websites cator to one type of user, researchers mostly)
- Summarization using configurable AI
- Accessablility / Saving Time
- Improved results over time using AI ranking / user feedback
