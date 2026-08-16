import { defineField, defineType } from "sanity";

export const storySchema = defineType({
  name: "story",
  title: "Stories & Articles",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Story Title",
      type: "string",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Trip Stories", value: "Trip Stories" },
          { title: "Travel Guides", value: "Travel Guides" },
          { title: "Travel Tips", value: "Travel Tips" },
          { title: "Behind the Journey", value: "Behind the Journey" },
        ],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short Excerpt",
      type: "text",
      rows: 3,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "author",
      title: "Author Name",
      type: "string",
      initialValue: "Sonali Sharma",
    }),
    defineField({
      name: "authorRole",
      title: "Author Role",
      type: "string",
      initialValue: "Founder & Lead Explorer",
    }),
    defineField({
      name: "authorAvatar",
      title: "Author Avatar Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "date",
      title: "Publish Date (Display String)",
      type: "string",
      placeholder: "14 May 2026",
    }),
    defineField({
      name: "readTime",
      title: "Estimated Read Time",
      type: "string",
      placeholder: "5 min read",
    }),
    defineField({
      name: "featured",
      title: "Featured Story on Homepage?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "content",
      title: "Story Paragraphs",
      type: "array",
      of: [{ type: "text" }],
      description: "Add each paragraph as a separate block item.",
    }),
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta Description", type: "text" }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "coverImage",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare(selection: Record<string, any>) {
      const { title, category, media } = selection;
      return {
        title,
        subtitle: category,
        media,
      };
    },
  },
});
