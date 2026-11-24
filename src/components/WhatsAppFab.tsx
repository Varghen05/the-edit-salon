import { whatsappLink } from "@/lib/site";

/** Always-reachable shortcut: WhatsApp when a number is set, otherwise the booking form. */
export default function WhatsAppFab() {
  const href = whatsappLink("Hello THE EDIT ✦ I'd like to book an appointment.") ?? "#book";
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label="Book on WhatsApp"
      className="fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full border border-gold/60 bg-ink/80 text-gold-hi shadow-[0_8px_30px_#000c,0_0_30px_#d6ad6533] backdrop-blur-md transition-transform duration-500 hover:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full border border-gold/30 [animation-duration:3s]" />
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.6.1a7.6 7.6 0 01-3.8-3.3c-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 00-.8.4 3.4 3.4 0 00-1 2.5 5.9 5.9 0 001.2 3.1 13.5 13.5 0 005.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 002-1.4 2.5 2.5 0 00.2-1.4c-.1-.1-.3-.2-.5-.3zM12 21.8a9.9 9.9 0 01-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1112 21.8zM12 0a12 12 0 00-10.3 18L0 24l6.2-1.6A12 12 0 1012 0z" />
      </svg>
    </a>
  );
}
