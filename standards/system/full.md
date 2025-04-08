
- Always use PNPM instead of NPM if possible
- Use --filter=@package/name to install packages in an isolated package or `-w` for root installation.
- DOCKER: node:20-bookworm-slim for docker images
- DOCKER: RUN corepack enable && corepack prepare pnpm@9.15.2 --activate needed at the top of all DOCKERFILES
- `server.ts` file should always be inside the `bin/` directory
