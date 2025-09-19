import { PortableText } from "@portabletext/react";
import { client } from "../sanity/client";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityDocument } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface Params {
  slug: string;
}

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  image { asset->{url}, size },
  body[]{
    ...,
    _type == "image" => {
      asset->{_id, url},
      alt,
      size
    }
  }
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = params;
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug }, options);

  if (!post) return <p>Post not found</p>;

  // Featured image width mapping
  const sizes = { small: 400, medium: 800, large: 1200 };
  const featuredWidth = (post.image?.size as keyof typeof sizes) || "medium";
  const postImageUrl = post.image ? urlFor(post.image)?.width(sizes[featuredWidth]).url() : null;

  // PortableText components for inline content
  const components = {
    types: {
      image: ({ value }: any) => {
        const url = value.asset?.url;
        if (!url) return null;

        const sizeKey = (value.size as keyof typeof sizes) || "medium";
        const sizeClasses = {
          small: "w-full sm:w-2/3 md:w-1/2",
          medium: "w-full sm:w-4/5 md:w-2/3",
          large: "w-full",
        };

        return (
          <img
            src={url}
            alt={value.alt || ""}
            className={`my-6 rounded-lg h-auto object-cover ${sizeClasses[sizeKey]}`}
          />
        );
      },
    },
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-5xl font-bold mt-8 mb-6">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-4xl font-semibold mt-8 mb-5">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-3xl font-semibold mt-6 mb-4">{children}</h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-2xl font-semibold mt-5 mb-3">{children}</h4>
      ),
      h5: ({ children }: any) => (
        <h5 className="text-xl font-semibold mt-4 mb-2">{children}</h5>
      ),
      h6: ({ children }: any) => (
        <h6 className="text-lg font-semibold mt-3 mb-2">{children}</h6>
      ),
      normal: ({ children }: any) => <p className="mb-4 leading-relaxed">{children}</p>,
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-6">
          {children}
        </blockquote>
      ),
      ul: ({ children }: any) => <ul className="list-disc list-inside mb-4">{children}</ul>,
      ol: ({ children }: any) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
      li: ({ children }: any) => <li className="mb-2">{children}</li>,
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
      em: ({ children }: any) => <em className="italic">{children}</em>,
      code: ({ children }: any) => (
        <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded">{children}</code>
      ),
      link: ({ children, value }: any) => (
        <a
          href={value?.href}
          target={value?.blank ? "_blank" : "_self"}
          rel="noreferrer"
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-4 flex flex-col gap-6">
      <Link href="/" className="hover:underline">
        ← Back to posts
      </Link>

      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={post.title}
          className="w-full max-h-[400px] object-cover rounded-xl mb-6"
        />
      )}

      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p className="text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</p>

      <div className="prose max-w-none">
        {Array.isArray(post.body) && <PortableText value={post.body} components={components} />}
      </div>
    </main>
  );
}
