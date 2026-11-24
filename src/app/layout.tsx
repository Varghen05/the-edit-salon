import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { site, fullAddress } from "@/lib/site";
import "./globals.css";

// Playfair Display (upright + italic) for headlines; Inter for labels, the tagline and body text.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: "THE EDIT Unisex Salon · Pukkattupady, Kochi | Where Elegance Begins",
  description:
    "THE EDIT is a premium unisex salon in Pukkattupady, Ernakulam. Hair, skin, beauty, nails and grooming, thoughtfully tailored to you. Book your appointment on WhatsApp.",
  keywords: ["salon Pukkattupady", "unisex salon Kochi", "hair salon Ernakulam", "beauty salon Kochi", "THE EDIT salon"],
  openGraph: {
    title: "THE EDIT · Unisex Salon",
    description: "Where elegance begins. A premium unisex salon in Pukkattupady, Kochi.",
    images: ["/images/studio/hair-styling.jpg"],
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1b0f1f",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "THE EDIT Unisex Salon",
  slogan: site.tagline,
  url: site.domain,
  image: `${site.domain}/brand/logo-gold.svg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.locality,
    addressRegion: "Kerala",
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
  ...(site.phone && { telephone: site.phone }),
};

// Marks the document as JS-capable before paint so reveal animations never flash.
// Picks day or night before first paint: the visitor's saved choice, otherwise the local time.
const themeScript = `(function(){try{var t=localStorage.getItem('theedit-theme');if(t!=='day'&&t!=='night'){var h=new Date().getHours();t=h>=6&&h<18?'day':'night'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='night'}})()`;

const jsFlag = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
