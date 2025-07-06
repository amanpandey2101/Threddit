import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: FileText,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Stores the original title if the post is deleted'
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      description: 'The user who created this post',
      to: [{type:'user'}],
      validation: (rule) => rule.required().error('Author is required'),
    }),
    defineField({
      name: 'subreddit',
      title: 'Subreddit',
      type: 'reference',
      description: 'The subreddit this post belongs to',
      to: [{type:'subreddit'}],
      validation: (rule) => rule.required().error('Subreddit is required'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type:'block'}],
      description: 'The main content of the post',
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: 'Optional image for the post',
      fields:[
        {
            name: 'alt',
            title: 'Alt text',
            type: 'string',
            description: 'Alternative text for the image',
        }
      ]
    }),
    // defineField({
    //     name: "originalImage",
    //     title: "Original Image",
    //     type: "image",
    //     description: 'Stores the original image if the post is deleted',
    //     fields:[
    //       {
    //           name: 'alt',
    //           title: 'Alt text',
    //           type: 'string'
    //       }
    //     ],
    //     hidden:true
    //   }),
    defineField({
        name: 'isReported',
        title: 'Is Reported',
        type: 'boolean',
        description: 'Whether the post has been reported',
        initialValue: false,
      }),
      defineField({
        name: 'publishedAt',
        title: 'Published At',
        type: 'datetime',
        description: 'The date and time the post was published',
        initialValue: () => new Date().toISOString(),
        validation: (rule) => rule.required().error('Published date is required'),
      }),
      defineField({
        name: 'isDeleted',
        title: 'Is Deleted',
        type: 'boolean',
        description: 'Indicated if this post has been deleted',
        initialValue: false,
      }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'author.username',
      media: 'image'
    },
    prepare(selection) {
      const { title,subtitle, media } = selection;
      return {
        title,
        subtitle,
        media
      };
    }
  }
});