import { PortableText, type PortableTextComponents, type PortableTextComponentProps, type PortableTextMarkComponentProps } from "@portabletext/react";
import { client } from "../sanity/client";
import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityDocument } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { TypedObject } from '@portabletext/types';

interface LinkMark extends TypedObject {
  _type: "link";
  href?: string;
  blank?: boolean;
}
interface Params {
  slug: string;
}

interface PortableTextImageValue {
  asset?: { url?: string };
  alt?: string;
  size?: string;
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

  const sizes = { small: 400, medium: 800, large: 1200 };
  const featuredWidth = (post.image?.size as keyof typeof sizes) || "medium";
  const postImageUrl = post.image ? urlFor(post.image)?.width(sizes[featuredWidth]).url() : null;

  const components: PortableTextComponents = {
    types: {
      image: ({ value }: { value: PortableTextImageValue }) => {
        const url = value.asset?.url;
        if (!url) return null;

        const sizeKey = (value.size as keyof typeof sizes) || "medium";
        const sizeClasses = {
          small: "w-full sm:w-2/3 md:w-1/2",
          medium: "w-full sm:w-4/5 md:w-2/3",
          large: "w-full",
        };

        return (
          <div className={`my-6 rounded-lg overflow-hidden ${sizeClasses[sizeKey]}`}>
            <Image
              src={url}
              alt={value.alt || ""}
              layout="responsive"
              width={sizes[sizeKey]}
              height={sizes[sizeKey] * 0.56}
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        );
      },
    },
    block: {
      h1: (props: PortableTextComponentProps<unknown>) => (
        <h1 className="text-5xl font-bold mt-8 mb-6">{props.children}</h1>
      ),
      h2: (props: PortableTextComponentProps<unknown>) => (
        <h2 className="text-4xl font-semibold mt-8 mb-5">{props.children}</h2>
      ),
      h3: (props: PortableTextComponentProps<unknown>) => (
        <h3 className="text-3xl font-semibold mt-6 mb-4">{props.children}</h3>
      ),
      h4: (props: PortableTextComponentProps<unknown>) => (
        <h4 className="text-2xl font-semibold mt-5 mb-3">{props.children}</h4>
      ),
      h5: (props: PortableTextComponentProps<unknown>) => (
        <h5 className="text-xl font-semibold mt-4 mb-2">{props.children}</h5>
      ),
      h6: (props: PortableTextComponentProps<unknown>) => (
        <h6 className="text-lg font-semibold mt-3 mb-2">{props.children}</h6>
      ),
      normal: (props: PortableTextComponentProps<unknown>) => (
        <p className="mb-4 leading-relaxed">{props.children}</p>
      ),
      blockquote: (props: PortableTextComponentProps<unknown>) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-6">
          {props.children}
        </blockquote>
      ),
      ul: (props: PortableTextComponentProps<unknown>) => (
        <ul className="list-disc list-inside mb-4">{props.children}</ul>
      ),
      ol: (props: PortableTextComponentProps<unknown>) => (
        <ol className="list-decimal list-inside mb-4">{props.children}</ol>
      ),
      li: (props: PortableTextComponentProps<unknown>) => (
        <li className="mb-2">{props.children}</li>
      ),
    },
    marks: {
  strong: (props: PortableTextMarkComponentProps<unknown>) => (
    <strong className="font-bold">{props.children}</strong>
  ),
  em: (props: PortableTextMarkComponentProps<unknown>) => (
    <em className="italic">{props.children}</em>
  ),
  code: (props: PortableTextMarkComponentProps<unknown>) => (
    <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded">{props.children}</code>
  ),
  link: (props: PortableTextMarkComponentProps<LinkMark>) => {
    const href = props.value?.href;
    const blank = props.value?.blank;
    if (!href) return <>{props.children}</>;
    return (
      <a
        href={href}
        target={blank ? "_blank" : "_self"}
        rel="noreferrer"
        className="text-blue-600 hover:underline"
      >
        {props.children}
      </a>
    );
  },
},
  };

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-4 flex flex-col gap-6">
      <Link href="/" className="hover:underline">
        ← Back to posts
      </Link>

      {postImageUrl && (
        <Image
          src={postImageUrl}
          alt={post.title}
          width={sizes[featuredWidth]}
          height={sizes[featuredWidth] * 0.56}
          className="rounded-xl mb-6"
          objectFit="cover"
        />
      )}

      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p className="text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</p>

      <div className="prose max-w-none">
        {Array.isArray(post.body) && (
          <PortableText value={post.body} components={components} />
        )}
      </div>
    </main>
  );
}
