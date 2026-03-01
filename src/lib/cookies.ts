const ROLE_COOKIE = "winga_role";
const TOKEN_COOKIE = "winga_token";
const MAX_AGE_DAYS = 7;

function setCookie(name: string, value: string, days: number = MAX_AGE_DAYS) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export const roleCookie = {
  set: (role: string) => setCookie(ROLE_COOKIE, role),
  get: () => getCookie(ROLE_COOKIE),
  remove: () => removeCookie(ROLE_COOKIE),
};

export const tokenCookie = {
  set: (token: string) => setCookie(TOKEN_COOKIE, token),
  get: () => getCookie(TOKEN_COOKIE),
  remove: () => removeCookie(TOKEN_COOKIE),
};
