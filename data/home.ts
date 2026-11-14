import type { Img } from "./types";

const LOGO_1 = "/assets/icons/placeholder-logo-1.svg";
const LOGO_2 = "/assets/icons/placeholder-logo-2.svg";
const PLACEHOLDER: Img = { src: "/assets/images/offer-placeholder.png", width: 1440, height: 800, alt: "" };
const QUOTE =
  '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."';

export type Offer = {
  image: Img;
  /** Short label at the top of the card… */
  tag?: string;
  /** …or a testimonial quote above the footer. */
  quote?: string;
  title: string;
  subtitle: string;
  logo: string;
};

export const OFFERS: Offer[] = [
  {
    image: {
      src: "/assets/images/offer-model-y-l.jpg",
      width: 1536,
      height: 870,
      alt: "Цагаан Model Y L ойн дундах замаар явж байна",
    },
    tag: "Long Wheelbase Midsize SUV",
    title: "Model Y L Premium",
    subtitle: "Starting at $61,9902",
    logo: LOGO_1,
  },
  {
    image: {
      src: "/assets/images/offer-model-y.jpg",
      width: 1536,
      height: 870,
      alt: "Цагаан Model Y уулын замаар явж байна",
    },
    tag: "Midsize SUV",
    title: "Model Y",
    subtitle: "Lease From $499/mo",
    logo: LOGO_2,
  },
  { image: PLACEHOLDER, quote: QUOTE, title: "Name Surname", subtitle: "Position, Company name", logo: LOGO_1 },
  { image: PLACEHOLDER, quote: QUOTE, title: "Name Surname", subtitle: "Position, Company name", logo: LOGO_2 },
  { image: PLACEHOLDER, quote: QUOTE, title: "Name Surname", subtitle: "Position, Company name", logo: LOGO_1 },
  { image: PLACEHOLDER, quote: QUOTE, title: "Name Surname", subtitle: "Position, Company name", logo: LOGO_2 },
];

/** `href` is where the "Дэлгэрэнгүй" button goes ("#" when omitted). */
export type Cta = { title: string; text: string; href?: string; image: Img };

export const CTAS: Cta[] = [
  {
    title: "Санал болгох",
    text: "Tesla автомашины загваруудтай танилцаарай",
    image: {
      src: "/assets/images/cta-recommend.jpg",
      width: 790,
      height: 990,
      alt: "Cybertruck, Model Y болон Model 3 зэрэгцэн зогсож байна",
    },
  },
  {
    title: "2026 оны Хувьцаа эзэмшигчдийн ээлжит хурал",
    text: "Tesla-ийн ирээдүй таны гарт. Таны санал яагаад чухал болохыг мэдэж аваарай.",
    image: {
      src: "/assets/images/cta-shareholder.jpg",
      width: 1831,
      height: 2240,
      alt: "Roadster-ийн арын төрх, харанхуй дэвсгэр дээр",
    },
  },
];

export type ChargingStat = { value: string; label: string };

/* The lists above are the fallback content; the live content is edited in /admin (Supabase). */
export const CHARGING_STATS: ChargingStat[] = [
  { value: "39,653", label: "Түргэн цэнэглэгч" },
  { value: "401", label: "Суурин цэнэглэх төв" },
];
