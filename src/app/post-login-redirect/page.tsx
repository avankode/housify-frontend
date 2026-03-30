"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_BACKEND, UserWithHouse } from "../utils";

export default function PostLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch(`${API_BASE_BACKEND}/api/user/`, {
          credentials: "include",
        });

        // If not authenticated at all, send back to login
        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          // Fallback: send to landing page on unexpected error
          router.replace("/");
          return;
        }

        const user: UserWithHouse = await response.json();

        // --- Branching logic ---

        // 1) No user or missing id/email: treat as "not fully signed up"
        if (!user || !user.id || !user.email) {
          router.replace("/onboarding-user");
          return;
        }

        // 2) Signed up but profile incomplete (example checks – tweak as needed)
        const profile = user.profile;
        const hasDisplayName = !!(profile?.display_name || user.display_name);
        const hasPhone = !!profile?.phone_number;

        if (!hasDisplayName || !hasPhone) {
          router.replace("/onboarding-user");
          return;
        }

        // 3) Profile OK, but no house yet
        if (!user.house) {
          router.replace("/onboarding-house");
          return;
        }

        // 4) Has house: go to home dashboard
        router.replace("/home?new=true");
      } catch (error) {
        console.error("Error during post-login redirect:", error);
        // Safe fallback on error
        router.replace("/");
      }
    };

    run();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <p className="text-gray-600 text-lg">Finishing sign-in…</p>
    </main>
  );
}
