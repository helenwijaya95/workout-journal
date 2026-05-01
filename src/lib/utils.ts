export function isDemoAccount(email: string | undefined): boolean {
    return email === process.env.DEMO_ACCOUNT_EMAIL
}