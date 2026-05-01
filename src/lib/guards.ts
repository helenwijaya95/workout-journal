import { createClient } from "./supabase/server";

export async function getAuthenticatedUser() {
    const supabase = await createClient()

    const { data: {user}} = await supabase.auth.getUser()

    if (user && user.email === process.env.DEMO_ACCOUNT_EMAIL) {
        return {
            user:null,
            errorAuth: 'This is a demo account - sign up to log your own workouts.'
        }
    }

    return {user, errorAuth: null}
}

export async function getUser() {
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser()

    if(!user) return {user:null, errorAuth: 'Not authenticated'}

    return { user, errorAuth: null}
}