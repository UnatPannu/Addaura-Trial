// src/app/blog/page.tsx
import { client } from "./sanity/client"; // fixed relative path
import Link from "next/link";
import Image from "next/image";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  image?: { asset?: { url: string }; size?: string };
  body?: Array<{ _type: string; children?: Array<{ text: string }> }>;
}

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc)[0...50]{
  _id,
  title,
  slug,
  image { asset->{url}, size },
  body[]{..., _type == "image" => {asset->{_id, url}, alt, size}},
}`;

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(POSTS_QUERY);

  return (
    <main className="flex flex-col bg-white text-gray-900">
      {/* Header */}
      <header
        className="relative h-[100vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/cover.png')" }}
      >
        {/* optional title overlay */}
        {/* <h1 className="text-5xl font-bold text-white drop-shadow-lg">Blog</h1> */}
      </header>

      {/* Blog grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {posts.map((post) => (
            <Link key={post._id} href={`/${post.slug.current}`} className="h-full">
              <a className="h-full"> {/* Always wrap Link children in <a> */}
                <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
                  {/* Image */}
                  {post.image?.asset?.url && (
                    <div className="relative w-full h-48">
                      <Image
                        src={post.image.asset.url}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-gray-600 text-sm flex-1">
                      {post.body && post.body[0]?._type === "block"
                        ? post.body[0].children?.[0].text.slice(0, 100) + "..."
                        : ""}
                    </p>
                    <span className="mt-4 text-black-600 font-medium">Read more →</span>
                  </div>
                </div>
              </a>import { client } from "./sanity/client";
import Link from "next/link";
import Image from "next/image";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  image?: { asset?: { url: string }; size?: string };
  body?: Array<{ _type: string; children?: Array<{ text: string }> }>;
}

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc)[0...50]{
  _id,
  title,
  slug,
  image { asset->{url}, size },
  body[]{..., _type == "image" => {asset->{_id, url}, alt, size}},
}`;

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(POSTS_QUERY);

  return (
    <main className="flex flex-col bg-white text-gray-900">
      <header
        className="relative h-[100vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/cover.png')" }}
      >
        {/* Optional title overlay */}
      </header>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {posts.map((post) => (
            <Link key={post._id} href={`/${post.slug.current}`}>
              <a className="h-full">
                <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
                  {post.image?.asset?.url && (
                    <div className="relative w-full h-48">
                      <Image
                        src={post.image.asset.url}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                      />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-gray-600 text-sm flex-1">
                      {post.body && post.body[0]?._type === "block"
                        ? post.body[0].children?.[0].text.slice(0, 100) + "..."
                        : ""}
                    </p>
                    <span className="mt-4 text-black-600 font-medium">Read more →</span>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
