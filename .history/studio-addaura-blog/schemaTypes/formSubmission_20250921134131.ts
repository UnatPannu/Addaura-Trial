import { defineField, defineType } from "sanity";

const formSubmission = defineType({
  name: "formSubmission",
  title: "Form Submission",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "email", title: "Email", type: "string", validation: (Rule) => Rule.required().email() }),
    defineField({ name: "mobile", title: "Mobile", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({
      name: "formType",
      title: "Form Type",
      type: "string",
      options: {
        list: [
          { title: "Hiring", value: "Hiring" },
          { title: "Talent", value: "Talent" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cv",
      title: "CV File",
      type: "file",
    }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime" }),
  ],
});

export default formSubmission;
