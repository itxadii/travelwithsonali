import React from "react";
import StoriesClientView from "./StoriesClientView";
import { getStories } from "@/lib/sanity/queries";

export const revalidate = 60;

export default async function StoriesPage() {
  const stories = await getStories();

  return <StoriesClientView initialStories={stories} />;
}
