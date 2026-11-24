// Every fact the salon still has to confirm lives in this file.
// Anything marked TODO is placeholder content: replace it before launch.

export const site = {
  name: "THE EDIT",
  descriptor: "UNISEX SALON",
  tagline: "WHERE ELEGANCE BEGINS!",
  owners: ["Rekha", "Saranya"],
  domain: "https://theeditsalonkochi.com", // TODO: confirm exact domain + TLD

  // Original master logo supplied by the owners. Use as-is: never redraw or rearrange.
  logo: "/logo.svg",

  address: {
    line1: "1st Floor, Providence Square",
    line2: "Opposite Bank of Maharashtra",
    locality: "Pukkattupady",
    region: "Kochi, Kerala",
    postalCode: "683561",
    country: "IN",
  },
  // Address exactly as confirmed by the owners (used for the map embed and directions)
  mapsQuery: "The Edit Salon, 1st Floor, Providence Square, opposite to Bank of Maharashtra, Pukkattupady, Kochi, Keralam 683561",
  geo: { lat: 10.0466, lng: 76.3651 }, // TODO: approximate, confirm from the Maps pin

  phone: "", // TODO: e.g. "+91 98xxxxxxxx"
  whatsapp: "", // TODO: digits only with country code, e.g. "9198xxxxxxxx"
  email: "", // TODO
  instagram: "", // TODO: full URL
  facebook: "", // TODO: full URL

  // TODO: sample hours from the prototype, confirm with the owners.
  hours: [{ days: "Monday – Sunday", time: "10:00 AM – 8:00 PM" }],
  timeSlots: ["10 AM – 12 PM", "12 PM – 2 PM", "2 PM – 4 PM", "4 PM – 6 PM", "6 PM – 8 PM"],

  // Invitation artwork shows both 10:00 AM and 12:00 PM. TODO: confirm the time.
  grandOpening: "2026-12-12T10:00:00+05:30",

  // Set after the Google Business Profile is verified, e.g. https://g.page/r/XXXX/review
  googleReviewUrl: "",
};

export type ServiceKey = "hair" | "skin" | "beauty" | "nails" | "grooming";

export const services: {
  key: ServiceKey;
  title: string;
  line: string;
  body: string;
  img: string;
}[] = [
  {
    key: "hair",
    img: "/images/studio/hair-styling.jpg",
    title: "Hair",
    line: "Cut · Colour · Care",
    body: "Precision cuts, considered colour and nourishing rituals, shaped around your face, texture and lifestyle.",
  },
  {
    key: "skin",
    img: "/images/studio/skin-mask.jpg",
    title: "Skin",
    line: "Facials · Rituals",
    body: "Facials and skin-care rituals tailored to what your skin needs today, not a one-size routine.",
  },
  {
    key: "beauty",
    img: "/images/studio/beauty-brush.jpg",
    title: "Beauty",
    line: "Occasion · Make-up",
    body: "Thoughtful finishing touches for the moments that matter, from everyday polish to celebrations.",
  },
  {
    key: "nails",
    img: "/images/studio/nails-salon.jpg",
    title: "Nails",
    line: "Manicure · Pedicure",
    body: "Clean, polished nail care with a detail-first, hygiene-first approach.",
  },
  {
    key: "grooming",
    img: "/images/studio/groom-beard.jpg",
    title: "Grooming",
    line: "Beard · Fade · Finish",
    body: "Modern grooming, beard sculpting and sharp finishing for a look that holds all week.",
  },
];

// TODO: indicative prices carried over from the prototype. Replace with the approved menu.
export const priceMenu: {
  group: string;
  img: string;
  items: { name: string; price: string; note?: string }[];
}[] = [
  {
    group: "Hair & Styling",
    img: "/images/studio/hair-curl.jpg",
    items: [
      { name: "Haircut & finish", price: "₹499" },
      { name: "Wash & blow-dry", price: "₹399" },
      { name: "Hair spa", price: "₹999" },
      { name: "Hair colour", price: "₹1,499" },
      { name: "Keratin / smoothening", price: "On consultation" },
    ],
  },
  {
    group: "Skin & Beauty",
    img: "/images/studio/skin-massage.jpg",
    items: [
      { name: "Express facial", price: "₹799" },
      { name: "Signature facial", price: "₹1,499" },
      { name: "Threading / waxing", price: "₹99" },
      { name: "Make-up", price: "On consultation" },
      { name: "Bridal / occasion styling", price: "On consultation" },
    ],
  },
  {
    group: "Nails",
    img: "/images/studio/nails-pink.jpg",
    items: [
      { name: "Manicure", price: "₹399" },
      { name: "Pedicure", price: "₹599" },
    ],
  },
  {
    group: "Grooming",
    img: "/images/studio/groom-chair.jpg",
    items: [
      { name: "Classic haircut", price: "₹299" },
      { name: "Beard trim & shape", price: "₹199" },
      { name: "Haircut + beard", price: "₹449" },
      { name: "Head massage", price: "₹299" },
    ],
  },
];

export const owners = [
  { name: "Rekha", role: "Co-founder" },
  { name: "Saranya", role: "Co-founder" },
];

// The owners' story, told chapter by chapter as the visitor scrolls.
// TODO: have Rekha and Saranya review this wording.
export const ownerChapters = [
  {
    kicker: "Chapter 01 · The friendship",
    title: "Two friends. One chair at a time.",
    body: "Rekha and Saranya shared a simple belief long before they shared a salon: when someone feels cared for, it shows on their face.",
  },
  {
    kicker: "Chapter 02 · The dream",
    title: "A salon that feels like an exhale.",
    body: "They imagined a place in Pukkattupady where hair, skin and grooming are done with the same care you'd give a friend, with no rush and no guesswork.",
  },
  {
    kicker: "Chapter 03 · The vision",
    title: "To help every guest discover their most elegant self.",
    body: "Every service starts with listening. Every finish is checked twice. Every guest leaves feeling refreshed, confident and unmistakably themselves.",
  },
  {
    kicker: "Chapter 04 · The promise",
    title: "Where elegance begins.",
    body: "Personal attention, honest advice and spotless hygiene, every visit. That's THE EDIT, and it's what our names stand behind.",
  },
];

// Free-licence photos from Unsplash (unsplash.com/license), colour-graded to one house look.
// Replace with the salon's own photography when available.
export const trailImages = [
  "/images/editorial/beauty-gold.jpg",
  "/images/editorial/hair-texture.jpg",
  "/images/editorial/groom-beard-2.jpg",
  "/images/editorial/beauty-brush.jpg",
  "/images/editorial/skin-patch.jpg",
  "/images/editorial/beauty-bride-2.jpg",
  "/images/editorial/nails-dark.jpg",
  "/images/editorial/beauty-pose.jpg",
  "/images/editorial/groom-suit.jpg",
  "/images/editorial/beauty-powder.jpg",
];

// Free-licence photos from Unsplash (unsplash.com/license). Replace with the salon's own photography when available.
export const gallery = [
  { src: "/images/studio/interior-maroon.jpg", alt: "Salon chairs facing a long mirror", w: 1400, h: 933 },
  { src: "/images/studio/portrait-curls.jpg", alt: "Defined natural curls", w: 1400, h: 2100 },
  { src: "/images/studio/beauty-lips.jpg", alt: "Evening make-up with a bold lip", w: 1400, h: 1750 },
  { src: "/images/studio/groom-chair.jpg", alt: "Guest in the barber chair", w: 1400, h: 933 },
  { src: "/images/studio/hair-red-lips.jpg", alt: "Glossy dark hair", w: 1400, h: 933 },
  { src: "/images/studio/interior-mirrors.jpg", alt: "Styling stations with round mirrors", w: 1400, h: 972 },
  { src: "/images/studio/portrait-man.jpg", alt: "Textured curly crop", w: 1400, h: 2488 },
  { src: "/images/studio/nails-pink.jpg", alt: "Soft pink manicure", w: 1400, h: 933 },
];

// "The Ritual": a signature visit, step by step (inspired by barbershop ritual reels)
export const ritualSteps = [
  {
    no: "01",
    title: "Consult",
    line: "We listen first",
    body: "A quiet conversation at the mirror about your hair, skin, routine and the look you want, before anything begins.",
    img: "/images/editorial/ritual-mirrors.jpg",
  },
  {
    no: "02",
    title: "Cleanse",
    line: "A ritual, not a rinse",
    body: "Warm water, a slow scalp massage and products chosen for you. The moment most guests tell us they finally exhale.",
    img: "/images/editorial/ritual-wash.jpg",
  },
  {
    no: "03",
    title: "Craft",
    line: "Precision in every detail",
    body: "Cut, colour, shave or skin work, done with care and hygiene you can see. No rushing, no guesswork.",
    img: "/images/editorial/ritual-cut.jpg",
  },
  {
    no: "04",
    title: "Finish",
    line: "The final edit",
    body: "Styled, checked twice and finished with advice to keep it looking this good at home.",
    img: "/images/editorial/beauty-gold.jpg",
  },
];

export const values = [
  { title: "Personal, always", body: "We listen first, then tailor the experience to the person in our chair." },
  { title: "Craft with care", body: "Thoughtful technique, strict hygiene and attention to the smallest details." },
  { title: "Confidence that lasts", body: "Leave refreshed, comfortable and unmistakably yourself." },
];

export const faqs = [
  {
    q: "Do I need an appointment?",
    a: "Walk-ins are welcome when a chair is free, but booking ahead guarantees your time. Send a request below and we'll confirm on WhatsApp.",
  },
  {
    q: "Is THE EDIT for everyone?",
    a: "Yes. We're a unisex salon, with hair, skin, beauty, nail and grooming services for every guest.",
  },
  {
    q: "Why do some prices say 'on consultation'?",
    a: "Treatments like keratin, colour and bridal styling depend on hair length, products and the look you want. We'll give you a clear quote before we begin.",
  },
  {
    q: "Where are you located?",
    a: "Providence Square, 1st floor, opposite Bank of Maharashtra, Pukkattupady, Ernakulam.",
  },
];

export const fullAddress = `${site.address.line1}, ${site.address.line2}, ${site.address.locality} ${site.address.postalCode}, ${site.address.region}`;

export const whatsappLink = (text: string) =>
  site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : null;
