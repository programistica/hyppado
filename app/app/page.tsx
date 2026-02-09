import { redirect } from "next/navigation";

/**
 * /app route redirects to /app/videos
 * Dashboard page removed — each section has its own page
 */
export default function AppPage() {
  redirect("/app/videos");
}
