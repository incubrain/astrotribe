export function useAuth() {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const authCookie = useCookie("auth_token");

  const authFetch = (url: string, options: any = {}) => {
    return useFetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    });
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await authFetch("/auth/signup", {
      method: "POST",
      body: { email, password },
    });
    if (data.value) {
      user.value = data.value.user;
      isAuthenticated.value = true;
    }
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authFetch("/auth/signin", {
      method: "POST",
      body: { email, password },
    });
    if (data.value) {
      user.value = data.value.user;
      isAuthenticated.value = true;
    }
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await authFetch("/auth/signout", {
      method: "POST",
    });
    user.value = null;
    isAuthenticated.value = false;
    return { error };
  };

  const getUser = async () => {
    if (authCookie.value) {
      const { data, error } = await authFetch("/auth/user");
      if (data.value) {
        user.value = data.value.user;
        isAuthenticated.value = true;
      }
      return { data, error };
    }
    return { data: null, error: null };
  };

  return {
    user,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    getUser,
  };
}
