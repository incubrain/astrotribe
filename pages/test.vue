<template>
  <div class="wrapper pt-36">
    <div class="flex h-full w-full flex-col gap-8 p-4">
      <AppMermaid>
        sequenceDiagram; participant User; participant AppServer; participant Supabase;
        User->>AppServer: Submit email and password; AppServer->>Supabase: Create new user with
        email and password; Supabase->>AppServer: User created; AppServer->>Supabase: Assign
        plan/role to app_metadata; Supabase->>User: Send confirmation email; User->>Supabase:
        Confirm email; Supabase->>AppServer: Email confirmed; AppServer->>User: Registration
        complete;
      </AppMermaid>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
