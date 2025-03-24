#### Technology Stack and Infrastructure

1. **Core Technologies:**

   - **Frontend:** Vue 3, Nuxt 3, TypeScript
   - **Backend:** Nitro for Nuxt Server, Dockerized TypeScript Node server for scraping and AI
     agents
   - **Scraping:** Playwright, Cheerio, Node.js
   - **AI:** ChatGPT, OpenAI embeddings, OpenAI small-text-embeddings model
   - **Database:** PostgreSQL hosted by Supabase, PG Vector for storing embeddings
   - **Authentication:** Supabase Auth
   - **Storage:** Supabase storage via S3
   - **User Queries:** Supabase edge functions for embedding queries
   - **Future Plans:** Relational Graph Database for scaling RAG system, LlamaParse for PDF to
     Markdown extraction, Python for scaling scraping server and AI agents.

2. **Infrastructure:**

   - **Database/File Storage/Auth:** Supabase
   - **Hosting:** Vercel
   - **Logging and Monitoring:** Logtail
   - **Metrics and Event Capture:** PostHog (already implemented, with plans to expand events and
     pipelines tracked)
   - **Scraping Server:** Digital Ocean App platform

3. **Scalability:**
   - The platform is designed to scale past 1 million users. Infrastructure elements like Supabase,
     Vercel, and Logtail are inherently scalable. Implementing limits to prevent unexpected bills
     due to cyber attacks or massive unexpected virality overnight. In-house scaling for scraping
     and data ingestion will be developed as needed.
