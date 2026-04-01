"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_BACKEND, UserWithHouse } from "../utils";

function PostLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const lt = searchParams.get("lt");

      if (!lt) {
        router.replace("/login");
        return;
      }

      try {
        // Exchange the one-time login token for a session cookie.
        // Using credentials:"include" ensures the browser stores the Set-Cookie
        // from the response, establishing a valid session for all subsequent calls.
        const response = await fetch(
          `${API_BASE_BACKEND}/api/auth/exchange-token/?lt=${encodeURIComponent(lt)}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          router.replace("/");
          return;
        }

        const user: UserWithHouse = await response.json();

        // 1) No user or missing id/email: treat as "not fully signed up"
        if (!user || !user.id || !user.email) {
          router.replace("/onboarding-user");
          return;
        }

        // 2) Profile incomplete
        const profile = user.profile;
        const hasDisplayName = !!(profile?.display_name || user.display_name);
        const hasPhone = !!profile?.phone_number;

        if (!hasDisplayName || !hasPhone) {
          router.replace("/onboarding-user");
          return;
        }

        // 3) Profile OK but no house yet
        if (!user.house) {
          router.replace("/onboarding-house");
          return;
        }

        // 4) Fully set up — go to dashboard
        router.replace("/home?new=true");
      } catch (error) {
        console.error("Error during post-login redirect:", error);
        router.replace("/");
      }
    };

    run();
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <p className="text-gray-600 text-lg">Finishing sign-in…</p>
    </main>
  );
}

export default function PostLoginRedirectPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
          <p className="text-gray-600 text-lg">Finishing sign-in…</p>
        </main>
      }
    >
      <PostLoginContent />
    </Suspense>
  );
}
