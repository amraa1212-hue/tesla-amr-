import type { Img } from "./types";

const IMG = "/assets/images/model3";

export const ORDER_URL = "https://www.tesla.com/model3/design";
export const COMPARE_URL = "https://www.tesla.com/compare";
export const SAFETY_URL = "https://www.tesla.com/safety";
export const SOURCE_URL = "https://www.tesla.com/model3";

/** A figure with its label, e.g. "363 миль" under "Явах зай (EPA)". `labelNote` is a footnote number. */
export type Stat = { label: string; labelNote?: number; value: string; unit?: string };

/** One spec row. An array value renders one line per item. */
export type Spec = { label: string; labelNote?: number; value: string | string[]; valueNote?: number };

export type Feature = { title: string; titleNote?: number; text: string };

export type Card = { title: string; text: string; image: Img };

/* Hero ---------------------------------------------------------------------- */

export const HERO = {
  title: "Model 3",
  lead: "Сарын $439-өөс эхлэх лизинг",
  image: {
    src: `${IMG}/hero.webp`,
    width: 2000,
    height: 849,
    alt: "Мөнгөлөг Model 3 ойн дундах муруй замаар явж байна",
  },
  panels: [
    [{ label: "Явах зай (EPA)", value: "363", unit: "миль хүртэл" }],
    [
      { label: "0-60 mph", labelNote: 4, value: "2.9", unit: "с" },
      { label: "Дээд хурд", value: "163", unit: "mph" },
    ],
  ] satisfies Stat[][],
};

/* Meet Model 3 -------------------------------------------------------------- */

export const MEET = {
  eyebrow: "Спорт седан",
  title: "Model 3-тай танилц",
  description: "Бүх Model 3-т стандартаар ирдэг онцлогуудтай танилцаарай.",
  cards: [
    {
      title: "Тав тух",
      text: "Гэртээ, замд эсвэл очсон газартаа. Цахилгаан байгаа хаана ч цэнэглэнэ.",
      image: { src: `${IMG}/meet-convenience.webp`, width: 646, height: 751, alt: "Model 3-ийг цэнэглэгчид залгаж байна" },
    },
    {
      title: "Аюулгүй байдал",
      text: "Цохилт шингээх бүс, хатуу салон, олон аюулгүйн дэр зорчигчдыг хамгаална.",
      image: { src: `${IMG}/meet-safety.webp`, width: 646, height: 751, alt: "Model 3-ийн аюулгүй байдал" },
    },
    {
      title: "Бүрэн бие даасан жолоодлого (хяналттай)",
      text: "Таны хяналт дор илүү идэвхтэй жолоодлогын туслах боломжууд.",
      image: { src: `${IMG}/meet-fsd.webp`, width: 753, height: 875, alt: "Бүрэн бие даасан жолоодлогын дэлгэц" },
    },
    {
      title: "Баталгаа",
      text: "Үндсэн баталгаа 4 жил, батарей болон хөтлөгчид 8 жилийн баталгаа.",
      image: { src: `${IMG}/meet-warranty.webp`, width: 860, height: 1000, alt: "Model 3-ийн баталгаа" },
    },
    {
      title: "Үр ашиг",
      text: "Цэнэг бүрээр аль болох хол явахаар зохион бүтээгдсэн.",
      image: { src: `${IMG}/meet-efficiency.webp`, width: 645, height: 750, alt: "Model 3 замаар явж байна" },
    },
    {
      title: "Дизайн",
      text: "Аэродинамикт зориулсан гадна төрх, минимал загвар.",
      image: { src: `${IMG}/meet-design.webp`, width: 753, height: 875, alt: "Model 3-ийн гадна дизайн" },
    },
  ] satisfies Card[],
};

/* Variants: one entry drives both the "Explore" tab and the "Specs" tab ------ */

export type VariantId = "standard" | "premium" | "performance";

export type Variant = {
  id: VariantId;
  tab: string;
  trim: { name: string; price: string; image: Img; stats: Stat[] };
  specs: {
    image: Img;
    groups: { title: string; items: Spec[] }[];
    warranty: Spec[];
  };
};

const CARGO: Spec = { label: "Ачааны багтаамж", value: "24 ft³ (680 л)" };
const SEATS: Spec = { label: "Суудал", value: "5 суудал" };
const WIDTH: Spec = { label: "Нийт өргөн", value: ['Эвхсэн толь: 76.1" (1,933 мм)', 'Дэлгэсэн толь: 82.2" (2,088 мм)'] };
const BASIC_WARRANTY: Spec = { label: "Үндсэн баталгаа", value: "4 жил эсвэл 50,000 миль" };

export const TRIMS_TITLE = "Model 3-ийг судлах";
export const SPECS_TITLE = "Техникийн үзүүлэлт";

export const VARIANTS: Variant[] = [
  {
    id: "standard",
    tab: "Model 3",
    trim: {
      name: "Model 3",
      price: "$38,630-аас эхэлнэ",
      image: { src: `${IMG}/trim-standard.webp`, width: 2000, height: 471, alt: "Цагаан Model 3" },
      stats: [
        { label: "Явах зай (EPA)", value: "321", unit: "миль" },
        { label: "0-60 mph", value: "5.8", unit: "с" },
        { label: "Ачааны багтаамж", value: "24", unit: "ft³" },
      ],
    },
    specs: {
      image: { src: `${IMG}/specs-standard.webp`, width: 1827, height: 668, alt: "Model 3-ийн хэмжээсийн зураг" },
      groups: [
        {
          title: "Хөдөлгөөн",
          items: [
            { label: "Явах зай (EPA)", value: "321 миль (517 км)" },
            { label: "Хурдатгал", value: "5.8 с, 0-60 mph" },
            { label: "Хөтлөгч", value: "Хойд дугуйн хөтлөгч" },
          ],
        },
        {
          title: "Хэмжээ",
          items: [
            { label: "Жин", value: "3,759 lbs (1,705 кг)" },
            CARGO,
            { label: "Дугуй", value: '18" эсвэл 19"' },
            SEATS,
            { label: "Дэлгэц", value: '16" төв мэдрэгч дэлгэц' },
            { label: "Газраас өндөр", value: '5.4" (137 мм)' },
            WIDTH,
            { label: "Нийт өндөр", value: '56.7" (1,440 мм)' },
            { label: "Нийт урт", value: '185.8" (4,719 мм)' },
          ],
        },
        {
          title: "Цэнэглэлт",
          items: [
            { label: "Supercharging дээд хүч", value: "225 kW, хэрэглээгээр төлнө" },
            { label: "Цэнэглэх хурд", value: "15 минутад 170 миль (274 км) хүртэл", valueNote: 2 },
          ],
        },
      ],
      warranty: [BASIC_WARRANTY, { label: "Батарей ба хөтлөгч", value: "8 жил эсвэл 100,000 миль" }],
    },
  },
  {
    id: "premium",
    tab: "Premium",
    trim: {
      name: "Model 3 Premium",
      price: "$44,130-аас эхэлнэ",
      image: { src: `${IMG}/trim-premium.webp`, width: 2000, height: 471, alt: "Model 3 Premium" },
      stats: [
        { label: "Явах зай (EPA)", value: "346", unit: "миль" },
        { label: "185 миль хүртэл цэнэглэнэ", labelNote: 2, value: "15", unit: "мин" },
        { label: "Хос мотор", value: "AWD" },
      ],
    },
    specs: {
      image: { src: `${IMG}/specs-premium.webp`, width: 1827, height: 668, alt: "Model 3 Premium-ийн хэмжээсийн зураг" },
      groups: [
        {
          title: "Хөдөлгөөн",
          items: [
            { label: "Явах зай (EPA)", value: "346 миль (557 км)" },
            { label: "Хурдатгал", value: "3.8 с, 0-60 mph" },
            { label: "Хөтлөгч", value: "Хос мотор, бүх дугуйн хөтлөгч" },
          ],
        },
        {
          title: "Хэмжээ",
          items: [
            { label: "Жин", value: "4,030 lbs (1,828 кг)" },
            CARGO,
            { label: "Дугуй", value: '18" эсвэл 19"' },
            SEATS,
            { label: "Дэлгэц", value: ['16" төв мэдрэгч дэлгэц', '8" арын мэдрэгч дэлгэц'] },
            { label: "Газраас өндөр", value: '5.4" (137 мм)' },
            WIDTH,
            { label: "Нийт өндөр", value: '56.7" (1,440 мм)' },
            { label: "Нийт урт", value: '185.8" (4,719 мм)' },
          ],
        },
        {
          title: "Цэнэглэлт",
          items: [
            { label: "Supercharging дээд хүч", value: "250 kW, хэрэглээгээр төлнө" },
            { label: "Цэнэглэх хурд", value: "15 минутад 185 миль (298 км) хүртэл", valueNote: 2 },
          ],
        },
      ],
      warranty: [BASIC_WARRANTY, { label: "Батарей ба хөтлөгч", value: "8 жил эсвэл 120,000 миль" }],
    },
  },
  {
    id: "performance",
    tab: "Performance",
    trim: {
      name: "Model 3 Performance",
      price: "$56,630-аас эхэлнэ",
      image: { src: `${IMG}/trim-performance.webp`, width: 2000, height: 471, alt: "Model 3 Performance" },
      stats: [
        { label: "Дээд хүч", value: "528", unit: "hp" },
        { label: "0-60 mph", labelNote: 4, value: "2.9", unit: "с" },
        { label: "Дээд хурд", value: "163", unit: "mph" },
      ],
    },
    specs: {
      image: {
        src: `${IMG}/specs-performance.webp`,
        width: 1296,
        height: 474,
        alt: "Model 3 Performance-ийн хэмжээсийн зураг",
      },
      groups: [
        {
          title: "Хөдөлгөөн",
          items: [
            { label: "Явах зай (EPA)", value: "316 миль (509 км)" },
            { label: "Хурдатгал", labelNote: 4, value: "2.9 с, 0-60 mph" },
            { label: "Хөтлөгч", value: "Хос мотор, бүх дугуйн хөтлөгч" },
          ],
        },
        {
          title: "Хэмжээ",
          items: [
            { label: "Жин", value: "4,054 lbs (1,839 кг)" },
            CARGO,
            { label: "Дугуй", value: '20" Warp дугуй' },
            SEATS,
            { label: "Дэлгэц", value: ['16" төв мэдрэгч дэлгэц', '8" арын мэдрэгч дэлгэц'] },
            { label: "Газраас өндөр", value: '5.0" (127 мм)' },
            WIDTH,
            { label: "Нийт өндөр", value: '56.3" (1,430 мм)' },
            { label: "Нийт урт", value: '185.9" (4,722 мм)' },
          ],
        },
        {
          title: "Цэнэглэлт",
          items: [
            { label: "Supercharging дээд хүч", value: "250 kW, хэрэглээгээр төлнө" },
            { label: "Цэнэглэх хурд", value: "15 минутад 147 миль (237 км) хүртэл", valueNote: 2 },
          ],
        },
      ],
      warranty: [BASIC_WARRANTY, { label: "Батарей ба хөтлөгч", value: "8 жил эсвэл 120,000 миль" }],
    },
  },
];

/* Most affordable ----------------------------------------------------------- */

export const AFFORDABLE = {
  title: "Хамгийн боломжийн үнэтэй",
  description:
    "Хамгийн боломжийн үнэтэй машиндаа хамгийн шилдэг онцлогуудыг багтаасан. Цаг хугацааны турш эзэмших зардал нь хамгийн бага.",
  image: { src: `${IMG}/affordable.webp`, width: 2000, height: 1000, alt: "Model 3 хурдны замаар явж байна" },
  cards: [
    {
      title: "Төвлөрсөн дизайн",
      text: "Явалтын чанар, найдвартай байдлыг тэргүүнд тавьж, минимал загвараараа чанараа алдалгүй үнийг бага байлгадаг.",
      image: { src: `${IMG}/affordable-design.webp`, width: 1600, height: 1160, alt: "Model 3-ийн минимал дизайн" },
    },
    {
      title: "Хэмнэлттэй жолоодлого",
      text: "Цэнэглэх нь ихэвчлэн бензин дүүргэхээс хямд. Model 3 цэнэг бүрийг аль болох удаан хүргэж, явах зайг дээд зэргээр нэмэгдүүлнэ.",
      image: { src: `${IMG}/affordable-drive.webp`, width: 1600, height: 1160, alt: "Model 3 цэнэглэгдэж байна" },
    },
    {
      title: "Бага засвар үйлчилгээ",
      text: "Tesla машинууд бензин хөдөлгүүрийн оронд цахилгаан мотортой тул жил бүрийн засвар үйлчилгээ багасна.",
      image: { src: `${IMG}/affordable-maintenance.webp`, width: 1600, height: 1160, alt: "Model 3-ийн дугуй, их бие" },
    },
  ] satisfies Card[],
};

/* Interior ------------------------------------------------------------------ */

export const INTERIOR = {
  title: "Үндсэн хэрэгцээнээс илүү",
  description: "Цэвэрхэн, нарийн шийдэлтэй салон танд хэрэгтэй бүхнийг агуулна.",
  rows: [
    {
      title: "Тав тухтай аялал",
      text: "Урд эгнээний халаалттай даавуун суудал, халаалттай жолооны хүрдтэй. Салон бүхэлдээ чанартай материалаар өнгөлөгдсөн.",
      image: { src: `${IMG}/interior-comfort.webp`, width: 2000, height: 1000, alt: "Model 3-ийн урд суудлууд" },
    },
    {
      title: "Удирдлага таны гарт",
      text: "Суудлын байрлалаа мэдрэгч дэлгэцээр тохируулна. Эргэлтийн дохионы бариул стандартаар ирнэ.",
      image: {
        src: `${IMG}/interior-control.webp`,
        width: 2000,
        height: 1000,
        alt: "Model 3-ийн жолооны хүрд, төв дэлгэц",
      },
    },
    {
      title: "Сонсоод үз",
      text: "Долоон чанга яригчтай стандарт аудио систем. Дуут туслахаар дуу, плейлист болон бусад зүйлийг захиалаарай.",
      image: { src: `${IMG}/interior-audio.webp`, width: 2000, height: 1000, alt: "Model 3-ийн салон, аудио систем" },
    },
  ] satisfies Card[],
};

/* Always connected ---------------------------------------------------------- */

export const CONNECTED = {
  title: "Үргэлж холбоотой",
  description: "Tesla апп-аар машинаа хаанаас ч хянаж, нэвтэрч, удирдаарай.",
  items: [
    {
      title: "Алсын уур амьсгалын удирдлага",
      text: "Явахаасаа өмнө салоны температураа тохируулж, тав тухтай орчинд суугаарай.",
    },
    {
      title: "Утасны түлхүүр",
      text: "Түлхүүрээ мартахгүй. Ойртоход утасны түлхүүрээр онгойлгох, эсвэл алсаас түгжиж, онгойлгох боломжтой.",
    },
    { title: "Тэжээвэр амьтны горим", text: "Таныг байхгүй үед тэжээвэр амьтныг тань аюулгүй, дулаахан байлгана." },
    { title: "Харуулын горим", text: "Машин хараа хяналтгүй байхад эргэн тойрныг нь хянана." },
  ] satisfies Feature[],
};

/* Safety -------------------------------------------------------------------- */

export const SAFETY = {
  title: "Таны аюулгүй байдалд зориулсан инженерчлэл",
  paragraphs: [
    "Tesla-д аюулгүй байдал хамгийн чухал. Машин бүр цохилт шингээх бүс, салон руу нэвтрэлтийг багасгах хатуу бүтэц, зорчигчдыг хамгаалах олон аюулгүйн дэртэй.",
    "Урд мөргөлдөөний сэрэмжлүүлэг, автомат яаралтай тоормос, эгнээнээс гарахаас сэргийлэх систем стандартаар ирнэ.",
  ],
  image: { src: `${IMG}/safety.webp`, width: 1884, height: 1160, alt: "Model 3-ийн аюулгүй байдлын бүтэц" },
};

/* Autonomy ------------------------------------------------------------------ */

export const AUTONOMY = {
  title: "Аялалын ирээдүй бол бие даасан жолоодлого",
  description:
    "Саадтай хэт ойртоход автомат яаралтай тоормос, эгнээндээ байлгах систем зэрэг идэвхтэй аюулгүйн онцлогуудтай. Бүрэн бие даасан жолоодлого (хяналттай)-д шинэчилж илүү олон боломжийг нээгээрэй.",
  items: [
    {
      title: "Бүрэн бие даасан жолоодлого (хяналттай)",
      titleNote: 3,
      text: "Таны идэвхтэй хяналт дор илүү идэвхтэй чиглүүлэг, туслах жолоодлого өгөх дэвшилтэт туслах системүүдийн багц.",
    },
    {
      title: "Урд камерууд",
      text: "Илүү сайн харагдац нь аюулгүй байдал, хялбар зогсоолт болон Actually Smart Summon зэрэг туслах боломжуудыг дэмжинэ.",
    },
    {
      title: "Хараагүй бүсийн хяналт",
      text: "Гэрэлтэх анхааруулга болон дэлгэц дээрх дүрслэл эргэн тойрноо аюулгүй шалгахад тусална.",
    },
  ] satisfies Feature[],
};

/* End CTA and footnotes ----------------------------------------------------- */

export const END_CTA = {
  title: "Model 3",
  lead: "Өөрийн Model 3-аа загварчлаарай.",
  image: { src: `${IMG}/end.webp`, width: 2000, height: 1164, alt: "Model 3" },
};

export const FOOTNOTES = [
  "АНУ-ын Массачусетс мужийн эхлэх үнэ.",
  "15 минутад нэмэгдэх зай нь тогтмол хурдны өгөгдөлд үндэслэсэн.",
  "Бүрэн бие даасан жолоодлого (хяналттай) нь жолоочоос байнга анхааралтай байхыг шаарддаг бөгөөд машиныг бүрэн бие даасан болгодоггүй.",
  "Rollout хассан үзүүлэлт.",
];
