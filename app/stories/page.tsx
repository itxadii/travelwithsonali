import React from "react";
import StoriesClientView from "./StoriesClientView";
import { getStories } from "@/lib/sanity/queries";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Travel Stories & Guides",
  description: "Trip stories, destination guides and practical travel tips from Sonali and the Travel With Sonali community.",
  path: "/stories",
});

export const revalidate = 60;

export default async function StoriesPage() {
  const stories = await getStories();

  return <StoriesClientView initialStories={stories} />;
}
