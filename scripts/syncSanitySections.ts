import { getCliClient } from "sanity/cli";
import { STORIES_DATA } from "../app/data/storiesData";
import { DEFAULT_INSTAGRAM_MOMENTS } from "../lib/sanity/queries";

async function run() {
  const client = getCliClient({ apiVersion: "2024-03-01" });
  console.log("🚀 Connected to Sanity via CLI client.");

  // 1. Sync Stories & Articles
  console.log("\n📚 Syncing Stories & Articles...");
  for (const story of STORIES_DATA) {
    console.log(`Creating Story: "${story.title}"`);

    const storyDoc = {
      _id: `story-${story.slug}`,
      _type: "story",
      title: story.title,
      slug: { _type: "slug", current: story.slug },
      category: story.category,
      excerpt: story.excerpt,
      author: story.author,
      authorRole: story.authorRole,
      date: story.date,
      readTime: story.readTime,
      featured: Boolean(story.featured),
      content: story.content,
      seo: {
        metaTitle: `${story.title} | Travel With Sonali`,
        metaDescription: story.excerpt,
      },
    };

    await client.createOrReplace(storyDoc);
    console.log(`  ✅ Story published to Sanity: ${storyDoc._id}`);
  }

  // 2. Sync Instagram Section (Follow Movements)
  console.log("\n📸 Syncing Instagram Section (Follow Movements)...");
  const processedMoments = DEFAULT_INSTAGRAM_MOMENTS.map((m, idx) => ({
    _key: `moment-${idx + 1}`,
    title: m.title,
    subtitle: m.subtitle,
    tag: m.tag,
    postUrl: m.postUrl || "https://instagram.com/travelwithsonali",
  }));

  const instagramSectionDoc = {
    _id: "instagramSection",
    _type: "instagramSection",
    badge: "Social Community",
    heading: "Follow Our Moments on Instagram",
    subheading: "Tag @travelwithsonali to get featured in our stories.",
    instagramHandle: "@travelwithsonali",
    instagramUrl: "https://instagram.com/travelwithsonali",
    buttonText: "Follow @travelwithsonali",
    moments: processedMoments,
  };

  await client.createOrReplace(instagramSectionDoc);
  console.log(`  ✅ Instagram Section published to Sanity: ${instagramSectionDoc._id}`);

  console.log("\n🎉 All demo sections successfully synced to Sanity Studio!");
}

run().catch((err) => {
  console.error("❌ Sync failed:", err);
  process.exit(1);
});
