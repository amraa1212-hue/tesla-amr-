export type NavLink = { label: string; href: string };

export const MODEL_LINKS: NavLink[] = [
  { label: "Model 3", href: "/model3" },
  { label: "Model Y", href: "#" },
  { label: "Cybertruck", href: "#" },
  { label: "Roadster", href: "#" },
  { label: "Роботакси", href: "#" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Model 3", href: "/model3" },
  { label: "Model Y", href: "#" },
  { label: "Cybertruck", href: "#" },
  { label: "Model S", href: "#" },
  { label: "Roadster", href: "#" },
  { label: "Роботакси", href: "#" },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookies Settings", href: "#" },
];

export const NAV_LABEL = "Үндсэн цэс";
export const TEST_DRIVE_LABEL = "Туршилтын жолоодлого";
export const TEST_DRIVE_URL = "https://www.tesla.com/drive";
/** Signed-out visitors are sent on to /admin/login by proxy.ts. */
export const LOGIN_LABEL = "Нэвтрэх";
export const LOGIN_URL = "/admin";
export const COPYRIGHT = "© 2025 Tesla, Inc. All rights reserved.";
