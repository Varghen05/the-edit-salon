"use client";

import { useState } from "react";
import SplitReveal from "../motion/SplitReveal";
import Reveal from "../motion/Reveal";
import Image from "next/image";
import { priceMenu, services, site, whatsappLink } from "@/lib/site";
import { ArrowUpRight } from "../icons";

type Form = { name: string; phone: string; service: string; date: string; time: string; guests: string; notes: string };
const empty: Form = { name: "", phone: "", service: "", date: "", time: "", guests: "1", notes: "" };

/**
 * Appointment request. Builds a tidy message and opens WhatsApp so the salon can
 * confirm the slot personally. Nothing is stored on a server.
 */
export default function Booking() {
  const [form, setForm] = useState<Form>(empty);
  const [preview, setPreview] = useState<string | null>(null);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const date = new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const text = [
      `Hello THE EDIT ✦ I'd like to book an appointment.`,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Service: ${form.service}`,
      `Date: ${date}`,
      `Time: ${form.time || "Any available time"}`,
      `Guests: ${form.guests}`,
      form.notes ? `Notes: ${form.notes}` : "",
    ]
      .filter((l, i) => i === 1 || l !== "")
      .join("\n");
    const link = whatsappLink(text);
    if (link) window.open(link, "_blank", "noopener");
    else setPreview(text); // WhatsApp number not configured yet: show the request instead
  };

  return (
    <section id="book" className="light relative z-10 overflow-hidden py-28 md:py-40">
      {/* Soft diagonal shaft of light across the whole section */}
      <div aria-hidden className="pointer-events-none absolute -top-1/4 left-[8%] h-[150%] w-[38%] rotate-[24deg] bg-[linear-gradient(90deg,transparent,rgba(240,213,156,0.07),transparent)] blur-2xl" />
      <div className="wrap grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="eyebrow">Book an appointment</p>
          <SplitReveal text="A little time, just for you." className="display mt-6 text-[clamp(2.6rem,5.6vw,4.8rem)] text-silver" />
          <Reveal className="mt-8 space-y-8">
            <p className="max-w-[440px] font-light text-muted">
              Choose your service and a time that suits you. Your request opens in WhatsApp, and we&rsquo;ll confirm your slot
              personally.
            </p>
            <ol className="space-y-5">
              {["Choose a service and time", "Send the request on WhatsApp", "We confirm your appointment"].map((s, i) => (
                <li key={s} className="flex items-center gap-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/50 font-serif text-gold-hi">
                    {i + 1}
                  </span>
                  <span className="text-sm tracking-wide text-silver/80">{s}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <div className="glass mt-12 hidden max-w-[440px] rounded-[30px] p-2.5 lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
              <Image src="/images/studio/interior-maroon.jpg" alt="Styling chairs at the mirror" fill sizes="440px" className="object-cover" />
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="card relative grid self-start gap-x-8 gap-y-7 p-7 sm:grid-cols-2 sm:p-10">
          <span className="absolute -top-px left-10 h-px w-24 bg-gradient-to-r from-transparent via-gold-hi to-transparent" />
          <label className="flex flex-col">
            <span className="label">Your name *</span>
            <input required className="field" value={form.name} onChange={set("name")} autoComplete="name" />
          </label>
          <label className="flex flex-col">
            <span className="label">Phone *</span>
            <input required type="tel" className="field" value={form.phone} onChange={set("phone")} autoComplete="tel" inputMode="tel" />
          </label>
          <label className="flex flex-col sm:col-span-2">
            <span className="label">Service *</span>
            <select required className="field" value={form.service} onChange={set("service")}>
              <option value="">Choose a service</option>
              {priceMenu.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((i) => (
                    <option key={i.name}>{i.name}</option>
                  ))}
                </optgroup>
              ))}
              <optgroup label="Not sure yet">
                {services.map((s) => (
                  <option key={s.key}>{s.title} consultation</option>
                ))}
              </optgroup>
            </select>
          </label>
          <label className="flex flex-col">
            <span className="label">Preferred date *</span>
            <input required type="date" onFocus={(e) => (e.currentTarget.min = new Date().toISOString().slice(0, 10))} className="field [color-scheme:dark]" value={form.date} onChange={set("date")} />
          </label>
          <label className="flex flex-col">
            <span className="label">Preferred time</span>
            <select className="field" value={form.time} onChange={set("time")}>
              <option value="">Any available time</option>
              {site.timeSlots.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="label">Guests</span>
            <select className="field" value={form.guests} onChange={set("guests")}>
              {["1", "2", "3", "4+"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col sm:col-span-2">
            <span className="label">Anything we should know?</span>
            <textarea rows={2} className="field resize-none" value={form.notes} onChange={set("notes")} />
          </label>
          <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
            <button type="submit" className="btn btn-solid">
              Request on WhatsApp <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} />
            </button>
            <span className="text-[0.66rem] tracking-wide text-muted">We reply during opening hours.</span>
          </div>

          {preview && (
            <div className="sm:col-span-2" role="status">
              <p className="label">Your request</p>
              <pre className="mt-3 border border-line bg-cream p-4 font-sans text-sm whitespace-pre-wrap text-silver/80">{preview}</pre>
              <p className="mt-3 text-xs text-muted">WhatsApp booking goes live once the salon number is added.</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
