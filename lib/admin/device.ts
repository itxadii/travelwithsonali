/** Short human label for a browser user-agent string, e.g. "Chrome on Windows". */
export function describeDevice(userAgent: string | null | undefined): string {
  const ua = userAgent || "";
  if (!ua) return "Unknown device";

  const os = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android/.test(ua)
        ? "Android"
        : /Windows/.test(ua)
          ? "Windows"
          : /Mac OS X/.test(ua)
            ? "Mac"
            : /CrOS/.test(ua)
              ? "ChromeOS"
              : /Linux/.test(ua)
                ? "Linux"
                : "Unknown OS";

  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /SamsungBrowser/.test(ua)
        ? "Samsung Internet"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Chrome\//.test(ua)
            ? "Chrome"
            : /Safari\//.test(ua)
              ? "Safari"
              : "Browser";

  return `${browser} on ${os}`;
}

export function isMobileDevice(userAgent: string | null | undefined): boolean {
  return /iPhone|iPad|Android|Mobile/.test(userAgent || "");
}
