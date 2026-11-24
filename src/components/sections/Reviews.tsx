import SplitReveal from "../motion/SplitReveal";
import ReviewMarquee from "./ReviewMarquee";
import { getGoogleReviews } from "@/lib/reviews";
import { site, fullAddress } from "@/lib/site";
import { Star } from "../icons";

const Stars = ({ value }: { value: number }) => (
  <span className="flex gap-1 text-gold-hi" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={`h-4 w-4 ${i <= Math.round(value) ? "fill-gold-hi" : "opacity-25"}`} strokeWidth={1} />
    ))}
  </span>
);

export default async function Reviews() {
  const data = await getGoogleReviews();
  const reviewUrl =
    site.googleReviewUrl ||
    data?.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`THE EDIT Unisex Salon ${fullAddress}`)}`;
  const hasReviews = !!data && data.reviews.length > 0;

  return (
    <section id="reviews" className="light relative z-10 overflow-hidden py-28 md:py-36">
      <div className="wrap flex flex-col items-center text-center">
        <p className="eyebrow">Google reviews</p>
        <SplitReveal text="Words from our guests." className="display mt-6 text-[clamp(2.6rem,5.6vw,4.8rem)] text-silver" />

        {hasReviews ? (
          <div className="mt-8 flex items-center gap-4">
            <span className="font-serif text-5xl text-gold-hi">{data.rating.toFixed(1)}</span>
            <div className="text-left">
              <Stars value={data.rating} />
              <p className="mt-1 text-xs tracking-wide text-muted">{data.total} reviews on Google</p>
            </div>
          </div>
        ) : (
          <p className="mt-6 max-w-[520px] font-light text-muted">
            We&rsquo;re opening our doors on 12 December. After your visit, we&rsquo;d love to hear how we did. Your review
            helps others find their new edit.
          </p>
        )}
      </div>

      {hasReviews && (
        <ReviewMarquee>
          {data.reviews.map((r, i) => (
            <figure key={i} className="card w-[340px] shrink-0 p-7 text-left">
              <Stars value={r.rating} />
              <blockquote className="mt-4 line-clamp-6 text-sm leading-relaxed text-silver/80">{r.text}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {r.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.photo} alt="" width={36} height={36} className="rounded-full" referrerPolicy="no-referrer" />
                )}
                <span>
                  <span className="block text-sm text-silver">{r.author}</span>
                  <span className="text-[0.65rem] text-muted">{r.when}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </ReviewMarquee>
      )}

      <div className="mt-12 flex justify-center">
        <a href={reviewUrl} target="_blank" rel="noopener noreferrer" className="btn">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path fill="currentColor" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3zM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0012 22zM6.4 14a6 6 0 010-3.9V7.5H3.1a10 10 0 000 9zM12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 003.1 7.5L6.4 10C7.2 7.7 9.4 5.9 12 5.9z" />
          </svg>
          {hasReviews ? "Read all & review us" : "Review us on Google"}
        </a>
      </div>
    </section>
  );
}
