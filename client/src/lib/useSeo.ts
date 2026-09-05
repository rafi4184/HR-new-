import { useEffect } from "react";

interface FaqEntry {
  question: string;
  answer: string;
}

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  faq?: FaqEntry[];
  serviceSchema?: {
    name: string;
    description: string;
  };
  noindex?: boolean;
}

const SITE_URL = "https://www.hrthemediator.com";
const DEFAULT_IMAGE = `${SITE_URL}/images/hasanur-rahman.jpg`;

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id: string, data: object | null) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSeo(opts: SeoOptions) {
  useEffect(() => {
    const url = `${SITE_URL}${opts.path}`;
    const image = opts.image ?? DEFAULT_IMAGE;

    document.title = opts.title;
    setMeta("name", "description", opts.description);
    setLink("canonical", url);
    setMeta("name", "robots", opts.noindex ? "noindex, nofollow" : "index, follow");

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "HR — The Mediator");
    setMeta("property", "og:title", opts.title);
    setMeta("property", "og:description", opts.description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);
    setMeta("property", "og:locale", "en_GB");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", opts.title);
    setMeta("name", "twitter:description", opts.description);
    setMeta("name", "twitter:image", image);

    if (opts.serviceSchema) {
      setJsonLd("service-schema", {
        "@context": "https://schema.org",
        "@type": "Service",
        name: opts.serviceSchema.name,
        description: opts.serviceSchema.description,
        provider: {
          "@type": "LocalBusiness",
          name: "HR — The Mediator",
          url: SITE_URL,
          telephone: "+8801717013150",
          address: {
            "@type": "PostalAddress",
            streetAddress: "The Meditor, 4th floor, Green Chayera Manzil, Greater Road Mosque, Kadirganj",
            addressLocality: "Rajshahi",
            postalCode: "6000",
            addressCountry: "BD",
          },
        },
        areaServed: "BD",
      });
    } else {
      setJsonLd("service-schema", null);
    }

    if (opts.faq && opts.faq.length > 0) {
      setJsonLd("faq-schema", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: opts.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
    } else {
      setJsonLd("faq-schema", null);
    }
  }, [opts.title, opts.description, opts.path, opts.image, opts.faq, opts.serviceSchema, opts.noindex]);
}
