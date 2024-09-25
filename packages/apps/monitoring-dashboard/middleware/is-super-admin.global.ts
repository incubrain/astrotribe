export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();

  // Check for super_admin role
  const role = user.app_metadata?.role || [];
  if (role !== 'super_admin') {
    return navigateTo('/not-authorized');
  }
});
