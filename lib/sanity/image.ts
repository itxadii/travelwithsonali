import createImageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (!source) return null;
  // If source is already a full image URL string, return it directly
  if (typeof source === "string") {
    return {
      url: () => source,
    };
  }
  return builder.image(source);
}
