import { cacheLife } from "next/cache";

export type Review = {
  author: string;
  photo?: string;
  rating: number;
  text: string;
  when: string;
};

export type ReviewData = { rating: number; total: number; reviews: Review[]; mapsUrl?: string } | null;

/**
 * Live Google reviews via the Places API (New). Needs GOOGLE_PLACES_API_KEY and
 * GOOGLE_PLACE_ID in the environment; returns null until both are set.
 * Cached for a few hours so we stay well inside the free quota.
 */
export async function getGoogleReviews(): Promise<ReviewData> {
  "use cache";
  cacheLife("hours");

  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      rating: data.rating ?? 0,
      total: data.userRatingCount ?? 0,
      mapsUrl: data.googleMapsUri,
      reviews: (data.reviews ?? [])
        .filter((r: { text?: { text?: string } }) => r.text?.text)
        .map((r: { authorAttribution?: { displayName?: string; photoUri?: string }; rating: number; text: { text: string }; relativePublishTimeDescription?: string }) => ({
          author: r.authorAttribution?.displayName ?? "Google user",
          photo: r.authorAttribution?.photoUri,
          rating: r.rating,
          text: r.text.text,
          when: r.relativePublishTimeDescription ?? "",
        })),
    };
  } catch {
    return null;
  }
}
