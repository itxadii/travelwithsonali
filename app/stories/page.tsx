import React from "react";
import StoriesClientView from "./StoriesClientView";
import { getStories } from "@/lib/sanity/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Stories & Guides | Travel With Sonali",
  description: "Trip stories, destination guides and practical travel tips from the Travel With Sonali community.",
};

export const revalidate = 60;

export default async function StoriesPage() {
  const stories = await getStories();

  return <StoriesClientView initialStories={stories} />;
}
