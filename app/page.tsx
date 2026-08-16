import React, { use } from "react";
import HomeClientView from "./HomeClientView";
import { getFeaturedTours, getDestinations } from "@/lib/sanity/queries";

export default function Home() {
  const tours = use(getFeaturedTours());
  const destinations = use(getDestinations());

  return <HomeClientView tours={tours} destinations={destinations} />;
}
