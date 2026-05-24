import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { COLOR_CREAM } from "../constants";
import { AlbumSection } from "./AlbumSection";
import { CoupleIntroSection } from "./CoupleIntroSection";
import { FooterSection } from "./FooterSection";
import { HeroSection } from "./HeroSection";
import { InvalidCodeAlert } from "./InvalidCodeAlert";
import { InvitationHeading } from "./InvitationHeading";
import { PartyCard } from "./PartyCard";
import { QuoteSection } from "./QuoteSection";
import { SaveTheDateSection } from "./SaveTheDateSection";
import { VenueSection } from "./VenueSection";

type WeddingMainContentProps = {
  onStartMusic: () => void;
};

export function WeddingMainContent({ onStartMusic }: WeddingMainContentProps) {
  const [invalidCodeOpen, setInvalidCodeOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState<"trai" | "gai" | null>(null);

  return (
    <div className="min-w-0 w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-[420px]">
        <HeroSection />

        <div style={{ background: COLOR_CREAM }}>
          <QuoteSection />
          <CoupleIntroSection />
          <Separator className="my-8 bg-[#85491c]/25" />
          <InvitationHeading />

          <PartyCard
            side="groom"
            className="mt-8"
            open={rsvpOpen === "trai"}
            onOpenChange={(open) => setRsvpOpen(open ? "trai" : null)}
            onStartMusic={onStartMusic}
          />
          <PartyCard
            side="bride"
            className="mt-6"
            open={rsvpOpen === "gai"}
            onOpenChange={(open) => setRsvpOpen(open ? "gai" : null)}
            onStartMusic={onStartMusic}
          />

          <SaveTheDateSection />
          <InvalidCodeAlert
            open={invalidCodeOpen}
            onOpenChange={setInvalidCodeOpen}
          />
          <VenueSection />
          <AlbumSection />
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
