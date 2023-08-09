import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  console.log("supa middleware 1", event.path);
  if (event.context._supabaseClient) return;
  if (event.path.includes("nuxt")) return;
  console.log("supa middleware 2", event.path);
  await serverSupabaseClient(event);
  console.log("supa middleware client");
  if (!event.context._supabaseClient) {
    throw createError({
      statusCode: 401,
      message: "Error creating supabase client",
    });
  }
});
