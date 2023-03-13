import publicClient from '../publicClient'

export const loginWithEmail = async (email: string, password: string) => {
    const client = publicClient()
    console.log('login', client, email, password)
    const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
    })

    return {
        data,
        error,
    }
}

export async function signInWithGoogle() {
    const client = publicClient()
    const { data, error } = await client.auth.signInWithOAuth({
        provider: "google",
    });

    if (data) {
        console.log("data: ", data);
    }

    if (error) {
        console.log("error: ", error);
    }
}
