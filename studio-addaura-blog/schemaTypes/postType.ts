import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    // Featured Image
    defineField({
      name: "image",
      type: "image",
      title: "Featured Image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "size",
          title: "Size",
          type: "string",
          options: {
            list: [
              { title: "Small", value: "small" },
              { title: "Medium", value: "medium" },
              { title: "Large", value: "large" },
            ],
            layout: "radio",
          },
          initialValue: "medium",
        }),
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    // Body content
    defineField({
      name: "body",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        defineField({
          type: "image",
          title: "Inline Image",
          name: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              options: {
                list: [
                  { title: "Small", value: "small" },
                  { title: "Medium", value: "medium" },
                  { title: "Large", value: "large" },
                ],
                layout: "radio",
              },
              initialValue: "medium",
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
});

export default postType;
