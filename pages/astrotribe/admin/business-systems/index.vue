<template>
  <div>
    <AppMermaid>
      sequenceDiagram participant User participant AppServer participant Supabase User->>AppServer:
      Submit email and password AppServer->>Supabase: Create new user with email and password
      Supabase->>AppServer: User created AppServer->>Supabase: Assign plan/role to app_metadata
      Supabase->>User: Send confirmation email User->>Supabase: Confirm email Supabase->>AppServer:
      Email confirmed AppServer->>User: Registration complete
    </AppMermaid>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
