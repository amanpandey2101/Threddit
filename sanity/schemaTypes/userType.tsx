import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";
import Image from "next/image";

export const userType = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'username',
      title: 'Username',
      type: 'string',
      description: 'Unique username for the user',
      validation: (rule) => rule
        .required()
        .error('Username is required')
        .min(3)
        .error('Username must be at least 3 characters')
        .max(30)
        .warning('Username should be under 30 characters for better display')
        .regex(/^[a-zA-Z0-9_-]+$/, {
          name: 'alphanumeric',
          invert: false
        })
        .error('Username can only contain letters, numbers, hyphens, and underscores')
    }),
    defineField({
      name: 'email',
      type: 'string',
      description: 'User email address',
      validation: (rule) => rule
        .required()
        .error('Email is required')
        .email()
        .error('Please enter a valid email address')
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL',
      type: 'string',
      description: 'User Clerk profile image',

    }),
    defineField({
      name: 'joinedAt',
      title: 'Joined At',
      type: 'datetime',
      description: 'When this account was created',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required().error('Join date is required')
    }),
    defineField({
      name: 'isReported',
      type: 'string',
      description: 'User reporting status',
      options: {
        list: [
          { title: 'Not Reported', value: 'not_reported' },
          { title: 'Reported', value: 'reported' },
          { title: 'Under Review', value: 'under_review' },
          { title: 'Resolved', value: 'resolved' }
        ],
        layout: 'radio'
      },
      initialValue: 'not_reported'
    })
  ],
  preview: {
    select: {
      title: 'username',
      media: 'imageUrl'
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title,
        media:media?(
          <Image src={media} alt={`${title}'s avatar`} width={40} height={40} />
        ):(
          <UserIcon/>
        )
      };
    }
  }
});