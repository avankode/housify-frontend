"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_BACKEND, UserWithHouse } from "../utils";

function PostLoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      try {
        const lt = searchParams.get("lt");

        let user: UserWithHouse;

        if (lt) {
          // Token exchange: POST to backend with the one-time token.
          // The backend sets a session cookie on the onrender.com domain in this response.
          const exchangeResponse = await fetch(
            `${API_BASE_BACKEND}/api/auth/exchange-token/?lt=${encodeURIComponent(lt)}`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (!exchangeResponse.ok) {
            console.error("Token exchange failed:", exchangeResponse.status);
            router.replace("/login");
            return;
          }

          user = await exchangeResponse.json();
        } else {
          // Fallback: try existing session (for already-logged-in users)
          const response = await fetch(`${API_BASE_BACKEND}/api/user/`, {
            credentials: "include",
          });

          if (response.status === 401) {
            router.replace("/login");
            return;
          }

          if (!response.ok) {
            router.replace("/");
            return;
          }

          user = await response.json();
        }

        // --- Branching logic ---

        // 1) No user or missing id/email
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

        // 3) Profile OK, but no house yet
        if (!user.house) {
          router.replace("/onboarding-house");
          return;
        }

        // 4) Has house: go to home dashboard
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
      <PostLoginRedirect />
    </Suspense>
  );
}
