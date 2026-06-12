import { Locale } from "@/enums/locale.enum";

const handleLogout = async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lang: Locale.EN,
    }),
  });
};

export async function handleAuthError(response: Response) {
  if (response.status === 401) {
    await handleLogout();

    throw new Error("Unauthorized");
  }

  return response;
}
