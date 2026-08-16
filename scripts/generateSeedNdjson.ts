import fs from "fs";
import path from "path";
import { DESTINATIONS_DATA } from "../app/data/destinationsData";
import { TOURS_DATA } from "../app/data/toursData";
import { STORIES_DATA } from "../app/data/storiesData";

const destinationDocs = DESTINATIONS_DATA.map((d) => ({
  _id: `dest-${d.id}`,
  _type: "destination",
  name: d.name,
  slug: { _type: "slug", current: d.slug },
  shortDescription: d.tagline,
  description: d.description,
  featured: d.featured,
}));

const tourDocs = TOURS_DATA.map((t) => {
  // Find matching destination doc
  let destRefId = "dest-manali";
  if (t.id.includes("kedarnath") || t.id.includes("dham") || t.id.includes("yatra")) {
    destRefId = "dest-kedarnath";
  } else if (t.id.includes("spiti")) {
    destRefId = "dest-spiti";
  } else if (t.id.includes("meghalaya")) {
    destRefId = "dest-meghalaya";
  } else if (t.id.includes("nepal")) {
    destRefId = "dest-nepal";
  } else if (t.id.includes("tirupati")) {
    destRefId = "dest-tirupati";
  }

  return {
    _id: `tour-${t.id}`,
    _type: "tour",
    title: t.title,
    slug: { _type: "slug", current: t.slug },
    destination: {
      _type: "reference",
      _ref: destRefId,
    },
    shortDescription: t.description,
    description: [
      {
        _type: "block",
        _key: `b-${t.id}`,
        style: "normal",
        children: [{ _type: "span", _key: `s-${t.id}`, text: t.overview }],
      },
    ],
    duration: t.duration,
    startingLocation: t.startingPoint,
    endingLocation: t.startingPoint,
    groupSize: t.groupSize,
    transport: t.transport,
    accommodation: t.accommodation,
    meals: t.meals,
    price: t.numericPrice,
    priceLabel: "Starting from",
    status: "Active",
    featured: Boolean(t.featured),
    inclusions: t.inclusions,
    exclusions: t.exclusions,
    itinerary: t.itinerary.map((item, idx) => ({
      _key: `day-${idx}`,
      day: item.day,
      title: item.title,
      description: [
        {
          _type: "block",
          _key: `id-${idx}`,
          style: "normal",
          children: [{ _type: "span", _key: `is-${idx}`, text: item.description }],
        },
      ],
      meals: item.meals || "",
      stay: item.stay || "",
    })),
    importantInformation: (t.importantInfo || []).map((info, idx) => ({
      _key: `info-${idx}`,
      title: info.title,
      details: info.details,
    })),
  };
});

const storyDocs = STORIES_DATA.map((s) => ({
  _id: `story-${s.id}`,
  _type: "story",
  title: s.title,
  slug: { _type: "slug", current: s.slug },
  category: s.category,
  excerpt: s.excerpt,
  author: s.author,
  authorRole: s.authorRole,
  date: s.date,
  readTime: s.readTime,
  featured: Boolean(s.featured),
  content: s.content,
}));

const allDocs = [...destinationDocs, ...tourDocs, ...storyDocs];
const ndjsonContent = allDocs.map((doc) => JSON.stringify(doc)).join("\n");

const outputPath = path.join(process.cwd(), "sanity-seed.ndjson");
fs.writeFileSync(outputPath, ndjsonContent, "utf-8");

console.log(`Successfully generated ${allDocs.length} documents into ${outputPath}`);
