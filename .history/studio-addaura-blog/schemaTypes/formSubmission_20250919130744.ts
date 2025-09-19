import { defineField, defineType } from "sanity";

const formSubmission = defineType({
  name: "formSubmission",
  title: "Form Submission",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "mobile", title: "Mobile", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({ name: "formType", title: "Form Type", type: "string" }),
    defineField({
      name: "cv",
      title: "CV File",
      type: "reference",
      to: [{ type: "file" }],
    }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime" }),
  ],
});

export default formSubmission;
