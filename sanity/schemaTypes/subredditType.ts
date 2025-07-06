import { defineField, defineType } from "sanity";
import { TagIcon } from "lucide-react";

export const subredditType = defineType({
  name: "subreddit",
  title: "Subreddit",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Name of the subreddit",
      validation: (rule) => rule.required().error("Title is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "A breif description of what this subreddit is about",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The slug of the subreddit",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required().error("Slug is required"),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "The Icon or banner image for the subreddit",
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Alternative text for the image",
        },
      ],
    }),
    defineField({
      name: "moderator",
      title: "Moderator",
      type: "reference",
      description: "The user who moderates this subreddit",
      to: [{ type: "user" }],
      validation: (rule) => rule.required().error("Moderator is required"),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      description: "The date and time the subreddit was created",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required().error("Created date is required"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
