import { defineField, defineType } from "sanity";

export const instagramSectionSchema = defineType({
  name: "instagramSection",
  title: "Instagram Section (Follow Movements)",
  type: "document",
  fields: [
    defineField({
      name: "badge",
      title: "Section Badge Tag",
      type: "string",
      initialValue: "Social Community",
    }),
    defineField({
      name: "heading",
      title: "Main Heading",
      type: "string",
      initialValue: "Follow Our Moments on Instagram",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subheading / Instructions",
      type: "string",
      initialValue: "Tag @travel_withsonali to get featured in our stories.",
    }),
    defineField({
      name: "instagramHandle",
      title: "Instagram Handle",
      type: "string",
      initialValue: "@travel_withsonali",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram Profile URL",
      type: "url",
      initialValue: "https://www.instagram.com/travel_withsonali",
    }),
    defineField({
      name: "buttonText",
      title: "Follow Button Text",
      type: "string",
      initialValue: "Follow @travel_withsonali",
    }),
    defineField({
      name: "moments",
      title: "Instagram Moment Cards",
      type: "array",
      of: [
        defineField({
          name: "moment",
          title: "Moment Card",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title / Location Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "subtitle",
              title: "Subtitle / Batch Tag",
              type: "string",
              placeholder: "@travel_withsonali • Himachal Batch",
            }),
            defineField({
              name: "tag",
              title: "Floating Pill Tag",
              type: "string",
              placeholder: "Group Batch",
            }),
            defineField({
              name: "image",
              title: "Photo / Thumbnail",
              type: "image",
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: "postUrl",
              title: "Link to Instagram Reel/Post (Optional)",
              type: "url",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "subtitle",
              media: "image",
            },
            prepare(selection) {
              const { title, subtitle, media } = selection;
              return {
                title: title || "Untitled Moment",
                subtitle: subtitle || "No subtitle",
                media,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "instagramHandle",
    },
    prepare(selection) {
      return {
        title: selection.title || "Instagram Section",
        subtitle: selection.subtitle || "@travel_withsonali",
      };
    },
  },
});
