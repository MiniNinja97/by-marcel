const AUTH_URL =
  "https://www.bymarcel.se/Server/api/auth";

export interface AdminUser {
  email: string;
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<AdminUser> {
  const response = await fetch(`${AUTH_URL}/login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Kunde inte logga in",
    );
  }

  return data.admin;
}

export async function checkAdminSession(): Promise<AdminUser | null> {
  const response = await fetch(
    `${AUTH_URL}/check-session.php`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (response.status === 401) {
    return null;
  }

  const data = await response.json();

  if (!response.ok || !data.authenticated) {
    return null;
  }

  return data.admin;
}

export async function logoutAdmin(): Promise<void> {
  const response = await fetch(`${AUTH_URL}/logout.php`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Kunde inte logga ut");
  }
}

export async function forgotAdminPassword(
  email: string,
): Promise<string> {
  const response = await fetch(
    "https://www.bymarcel.se/Server/api/auth/forgot-password.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Kunde inte skicka återställningsmejlet",
    );
  }

  return data.message;
}