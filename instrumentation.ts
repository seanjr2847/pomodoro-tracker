export async function register() {
  // Validate required environment variables on server startup.
  // Throws immediately with a clear error message if any required var is missing or invalid.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./lib/env");
  }
}
