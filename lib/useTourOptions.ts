"use client";

import { useEffect, useState } from "react";
import { TOURS_DATA } from "@/app/data/toursData";

export interface TourOption {
  id: string;
  title: string;
  price: string;
  numericPrice: number;
}

const FALLBACK: TourOption[] = TOURS_DATA.map((t) => ({
  id: t.id,
  title: t.title,
  price: t.price,
  numericPrice: t.numericPrice,
}));

/** Tours published in Sanity, falling back to the bundled list until (or if) the request fails. */
export function useTourOptions(): TourOption[] {
  const [tours, setTours] = useState<TourOption[]>(FALLBACK);

  useEffect(() => {
    let ignore = false;
    fetch("/api/tours")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && Array.isArray(data) && data.length > 0) setTours(data);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  return tours;
}
