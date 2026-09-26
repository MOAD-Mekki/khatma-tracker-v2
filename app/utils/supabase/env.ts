export function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Check your .env file locally, or your project's Environment Variables settings on Vercel.`
    );
  }
  return value;
}