import React, { use } from "react";
import HomeClientView from "./HomeClientView";
import { getFeaturedTours, getDestinations, getInstagramSection } from "@/lib/sanity/queries";

export default function Home() {
  const tours = use(getFeaturedTours());
  const destinations = use(getDestinations());
  const instagramData = use(getInstagramSection());

  return <HomeClientView tours={tours} destinations={destinations} instagramData={instagramData} />;
}
