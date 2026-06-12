async function getClientSession() {
  const res = await fetch("/api/auth/session");

  if (!res.ok) return null;

  const data = await res.json();

  return data.session;
}
