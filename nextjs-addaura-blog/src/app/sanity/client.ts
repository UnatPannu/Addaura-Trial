import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "5d4g60fj",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});


