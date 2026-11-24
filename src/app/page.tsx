import SmoothScroll from "@/components/motion/SmoothScroll";
import WhatsAppFab from "@/components/WhatsAppFab";
import FlowNav from "@/components/flow/FlowNav";
import FlowHero from "@/components/flow/FlowHero";
import ServiceRing from "@/components/flow/ServiceRing";
import Founders from "@/components/flow/Founders";
import DepthGallery from "@/components/flow/DepthGallery";
import GlassPrices from "@/components/flow/GlassPrices";
import ChairScene from "@/components/flow/ChairScene";
import CtaFooter from "@/components/flow/CtaFooter";
import Booking from "@/components/sections/Booking";
import MapReveal from "@/components/sections/MapReveal";
import Faq from "@/components/sections/Faq";
import { getLogoSvg } from "@/lib/logoSvg";

export default async function Home() {
  const logoSvg = await getLogoSvg();
  return (
    <>
      <SmoothScroll />
      <FlowNav />
      <main className="relative">
        <FlowHero logoSvg={logoSvg} />
        <ServiceRing />
        <Founders />
        <DepthGallery />
        <GlassPrices />
        <Booking />
        <MapReveal />
        <Faq />
        <ChairScene />
      </main>
      <CtaFooter logoSvg={logoSvg} />
      <WhatsAppFab />
    </>
  );
}
