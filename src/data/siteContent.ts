export type PageId = "home" | "photos" | "about";

export const siteContent = {
  siteName: "التواصل البديل",
  navigation: [
    { id: "home", label: "الرئيسية", order: 1 },
    { id: "photos", label: "الصور", order: 2 },
    { id: "about", label: "من نحن", order: 3 },
  ] satisfies Array<{ id: PageId; label: string; order: number }>,
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
          targetPage: "photos",
          order: 1,
        },
      ],
    },
    photos: {
      title: "الصور",
      intro: "معرض تجريبي بأحجام مختلفة لمراجعة شكل العرض على الجوال.",
      items: Array.from({ length: 20 }, (_, index) => {
        const sizePattern = ["square", "medium", "tall", "medium"] as const;
        const tonePattern = ["silver", "blue", "darkBlue", "gray", "softBlue"] as const;

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
        { id: "instagram", label: "Instagram", href: "#", order: 1 },
        { id: "tiktok", label: "TikTok", href: "#", order: 2 },
        { id: "youtube", label: "YouTube", href: "#", order: 3 },
      ],
    },
  },
} as const;
