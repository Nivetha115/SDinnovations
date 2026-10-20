/** Prefix a file from /public with the site's base path (empty locally, "/SDinnovations" on GitHub Pages). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
