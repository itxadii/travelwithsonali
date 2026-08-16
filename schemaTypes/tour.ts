import { defineField, defineType } from "sanity";

export const tourSchema = defineType({
  name: "tour",
  title: "Tour / Package",
  type: "document",
  groups: [
    { name: "basic", title: "Basic Information" },
    { name: "images", title: "Images" },
    { name: "details", title: "Tour Details" },
    { name: "pricing", title: "Pricing & Availability" },
    { name: "itinerary", title: "Itinerary" },
    { name: "packageDetails", title: "Package Details" },
    { name: "importantInfo", title: "Important Information" },
    { name: "faqs", title: "FAQs" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // --- BASIC INFORMATION ---
    defineField({
      name: "title",
      title: "Tour Name",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "basic",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "destination",
      title: "Destination",
      type: "reference",
      to: [{ type: "destination" }],
      group: "basic",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      group: "basic",
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
      group: "basic",
    }),

    // --- IMAGES ---
    defineField({
      name: "heroImage",
      title: "Main Tour Image",
      type: "image",
      group: "images",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alternative Text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Photo Gallery",
      type: "array",
      group: "images",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alternative Text",
              type: "string",
            },
          ],
        },
      ],
    }),

    // --- TOUR DETAILS ---
    defineField({
      name: "duration",
      title: "Duration (e.g., 5 Nights / 6 Days)",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "startingLocation",
      title: "Starting Location (e.g., Mumbai / Delhi)",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "endingLocation",
      title: "Ending Location (e.g., Mumbai / Delhi)",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "groupSize",
      title: "Group Size (e.g., 10 - 15 Travellers)",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "transport",
      title: "Transport Mode (e.g., AC Volvo Bus / Tempo Traveller)",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "accommodation",
      title: "Accommodation Type (e.g., 3-Star Hotels / Deluxe Camps)",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "meals",
      title: "Meals Plan (e.g., Breakfast & Dinner Included)",
      type: "string",
      group: "details",
    }),

    // --- PRICING & AVAILABILITY ---
    defineField({
      name: "price",
      title: "Starting Price (INR Numeric value only, e.g., 18999)",
      type: "number",
      group: "pricing",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "priceLabel",
      title: "Price Label (e.g., Starting from)",
      type: "string",
      initialValue: "Starting from",
      group: "pricing",
    }),
    defineField({
      name: "status",
      title: "Business Status",
      type: "string",
      group: "pricing",
      options: {
        list: [
          { title: "Active", value: "Active" },
          { title: "Draft", value: "Draft" },
          { title: "Sold Out", value: "Sold Out" },
          { title: "Archived", value: "Archived" },
        ],
      },
      initialValue: "Active",
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      group: "pricing",
      initialValue: false,
    }),
    defineField({
      name: "departures",
      title: "Departure Dates & Seats",
      type: "array",
      group: "pricing",
      of: [
        {
          type: "object",
          fields: [
            { name: "date", title: "Departure Date", type: "string" },
            { name: "availableSeats", title: "Available Seats", type: "number" },
            { name: "totalSeats", title: "Total Seats", type: "number" },
            { name: "priceOverride", title: "Price Override (Optional)", type: "number" },
            {
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: ["Filling Fast", "Available", "Sold Out", "Completed"],
              },
            },
          ],
        },
      ],
    }),

    // --- PACKAGE DETAILS ---
    defineField({
      name: "inclusions",
      title: "Package Inclusions",
      type: "array",
      group: "packageDetails",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "exclusions",
      title: "Package Exclusions",
      type: "array",
      group: "packageDetails",
      of: [{ type: "string" }],
    }),

    // --- ITINERARY ---
    defineField({
      name: "itinerary",
      title: "Day-by-Day Itinerary",
      type: "array",
      group: "itinerary",
      of: [
        {
          type: "object",
          fields: [
            { name: "day", title: "Day (e.g., Day 01 or 1)", type: "string" },
            { name: "title", title: "Day Title", type: "string" },
            { name: "description", title: "Description", type: "array", of: [{ type: "block" }] },
            { name: "location", title: "Location (Optional)", type: "string" },
            { name: "meals", title: "Meals (Optional)", type: "string" },
            { name: "stay", title: "Accommodation (Optional)", type: "string" },
            { name: "image", title: "Day Image (Optional)", type: "image" },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "day",
            },
          },
        },
      ],
    }),

    // --- IMPORTANT INFORMATION ---
    defineField({
      name: "importantInformation",
      title: "Important Information & Guidelines",
      type: "array",
      group: "importantInfo",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Section Title", type: "string" },
            {
              name: "details",
              title: "Details List",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
        },
      ],
    }),

    // --- FAQS ---
    defineField({
      name: "faqs",
      title: "Tour FAQs",
      type: "array",
      group: "faqs",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text", rows: 3 },
          ],
        },
      ],
    }),

    // --- SEO ---
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      group: "seo",
      fields: [
        { name: "title", title: "SEO Title", type: "string" },
        { name: "description", title: "SEO Description", type: "text", rows: 3 },
        { name: "ogImage", title: "Open Graph Image", type: "image" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "duration",
      media: "heroImage",
    },
  },
});
