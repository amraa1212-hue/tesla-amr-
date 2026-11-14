/**
 * Content types editable from /admin. Each maps a URL slug to a Supabase
 * table and describes its form. Must stay serializable: it is passed to
 * Client Components.
 */

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "image" | "select" | "link";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Spans both form columns. */
  wide?: boolean;
};

export type Entity = {
  slug: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  /** Columns shown in the collapsed row. */
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  fields: Field[];
  defaults: Record<string, string | number | boolean>;
};

export type Row = {
  id: string;
  position: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  [column: string]: unknown;
};

const POSITION: Field = {
  name: "position",
  label: "Дараалал",
  type: "number",
  hint: "Бага тоо нь эхэнд харагдана.",
};
const PUBLISHED: Field = { name: "published", label: "Сайт дээр харуулах", type: "checkbox" };

export const ENTITIES: Entity[] = [
  {
    slug: "offers",
    table: "offers",
    label: "Урамшуулал",
    singular: "урамшуулал",
    description: "Нүүр хуудасны «Одоогийн урамшуулал» слайдерын картууд.",
    titleField: "title",
    subtitleField: "subtitle",
    imageField: "image_url",
    fields: [
      { name: "image_url", label: "Зураг", type: "image", required: true, wide: true },
      { name: "image_alt", label: "Зургийн тайлбар (alt)", type: "text", wide: true, hint: "Дэлгэц уншигчид зориулсан." },
      { name: "title", label: "Гарчиг", type: "text", required: true },
      { name: "subtitle", label: "Дэд гарчиг", type: "text", placeholder: "Lease From $499/mo" },
      {
        name: "tag",
        label: "Шошго",
        type: "text",
        placeholder: "Midsize SUV",
        hint: "Картын дээд хэсэгт. Хоосон бол ишлэл харагдана.",
      },
      {
        name: "logo",
        label: "Лого",
        type: "select",
        options: [
          { value: "/assets/icons/placeholder-logo-1.svg", label: "Лого 1" },
          { value: "/assets/icons/placeholder-logo-2.svg", label: "Лого 2" },
        ],
      },
      { name: "quote", label: "Ишлэл", type: "textarea", wide: true, hint: "Шошго хоосон үед л харагдана." },
      POSITION,
      PUBLISHED,
    ],
    defaults: {
      image_url: "",
      image_alt: "",
      title: "",
      subtitle: "",
      tag: "",
      logo: "/assets/icons/placeholder-logo-1.svg",
      quote: "",
      position: 100,
      published: true,
    },
  },
  {
    slug: "ctas",
    table: "ctas",
    label: "CTA блок",
    singular: "CTA блок",
    description: "Нүүр хуудасны зурагтай, товчтой том картууд.",
    titleField: "title",
    subtitleField: "body",
    imageField: "image_url",
    fields: [
      { name: "image_url", label: "Зураг", type: "image", required: true, wide: true },
      { name: "image_alt", label: "Зургийн тайлбар (alt)", type: "text", wide: true },
      { name: "title", label: "Гарчиг", type: "text", required: true, wide: true },
      { name: "body", label: "Текст", type: "textarea", wide: true },
      {
        name: "link_url",
        label: "«Дэлгэрэнгүй» товчны холбоос",
        type: "link",
        placeholder: "/model3 эсвэл https://…",
        hint: "Холбоосгүй бол # гэж бичнэ.",
      },
      POSITION,
      PUBLISHED,
    ],
    defaults: { image_url: "", image_alt: "", title: "", body: "", link_url: "#", position: 100, published: true },
  },
  {
    slug: "stats",
    table: "charging_stats",
    label: "Цэнэглэгчийн тоо",
    singular: "үзүүлэлт",
    description: "«Миний байршил» хэсгийн том тоонууд.",
    titleField: "value",
    subtitleField: "label",
    fields: [
      { name: "value", label: "Тоо", type: "text", required: true, placeholder: "39,653" },
      { name: "label", label: "Нэр", type: "text", required: true, placeholder: "Түргэн цэнэглэгч" },
      POSITION,
      PUBLISHED,
    ],
    defaults: { value: "", label: "", position: 100, published: true },
  },
];

export function getEntity(slug: string) {
  return ENTITIES.find((entity) => entity.slug === slug);
}
