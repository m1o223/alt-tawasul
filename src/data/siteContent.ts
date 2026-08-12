export type PageId = "home" | "photos" | "about";
export type PhotoSize = "square" | "medium" | "tall";
export type PhotoTone = "silver" | "blue" | "darkBlue" | "gray" | "softBlue";

export type NavigationItem = {
  id: PageId;
  label: string;
  order: number;
};

export type ActionButton = {
  id: string;
  label: string;
  href: string;
  targetPage?: PageId;
  order: number;
};

export type PhotoItem = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  note: string;
  size: PhotoSize;
  tone: PhotoTone;
  order: number;
  previewUrl?: string;
};

export type SocialLink = {
  id: "instagram" | "tiktok" | "youtube" | string;
  label: string;
  href: string;
  order: number;
};

export type SiteContent = {
  siteName: string;
  navigation: NavigationItem[];
  pages: {
    home: {
      title: string;
      logoLabel: string;
      headline: string;
      body: string;
      buttons: ActionButton[];
    };
    photos: {
      title: string;
      intro: string;
      items: PhotoItem[];
    };
    about: {
      title: string;
      body: string;
      followTitle: string;
      socialLinks: SocialLink[];
    };
  };
};

// Demo-only frontend credentials. This is intentionally temporary and must be
// replaced later with a real secure backend authentication system.
export const demoAdminCredentials = {
  email: "admin@demo.com",
  password: "123456",
};

export const siteContent: SiteContent = {
  siteName: "التواصل البديل",
  navigation: [
    { id: "home", label: "الرئيسية", order: 1 },
    { id: "photos", label: "الصور", order: 2 },
    { id: "about", label: "من نحن", order: 3 },
  ],
  pages: {
    home: {
      title: "التواصل البديل",
      logoLabel: "مساحة مؤقتة للشعار",
      headline: "مساحة تجريبية لعرض الصور والأفكار.",
      body:
        "هذا نموذج أولي بسيط لمراجعة شكل الموقع على الجوال. المحتوى الحالي مؤقت وسيتم استبداله لاحقًا.",
      buttons: [
        {
          id: "browsePhotos",
          label: "تصفّح الصور",
          href: "#photos",
          targetPage: "photos",
          order: 1,
        },
      ],
    },
    photos: {
      title: "الصور",
      intro: "معرض تجريبي بأحجام مختلفة لمراجعة شكل العرض على الجوال.",
      items: Array.from({ length: 20 }, (_, index) => {
        const sizePattern: PhotoSize[] = ["square", "medium", "tall", "medium"];
        const tonePattern: PhotoTone[] = ["silver", "blue", "darkBlue", "gray", "softBlue"];

        return {
          id: `photo-${String(index + 1).padStart(2, "0")}`,
          number: String(index + 1).padStart(2, "0"),
          title: "صورة تجريبية",
          subtitle: "Album Photo",
          note: "مكان الصورة",
          size: sizePattern[index % sizePattern.length],
          tone: tonePattern[index % tonePattern.length],
          order: index + 1,
        };
      }),
    },
    about: {
      title: "من نحن",
      body:
        "التواصل البديل موقع تجريبي قيد التصميم، هدفه عرض تجربة بسيطة ونظيفة تناسب تصفح الجوال قبل إضافة المحتوى الحقيقي.",
      followTitle: "تابعونا",
      socialLinks: [
        { id: "instagram", label: "Instagram", href: "https://www.instagram.com/example", order: 1 },
        { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@example", order: 2 },
        { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@example", order: 3 },
      ],
    },
  },
};
