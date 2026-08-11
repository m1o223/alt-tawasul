import { Home, Image, Info, Images, PlayCircle } from "lucide-react";
import { useMemo, useState } from "react";

type Page = "home" | "photos" | "about";

const photoHeights = [
  "tile-square",
  "tile-medium",
  "tile-tall",
  "tile-medium",
  "tile-square",
  "tile-tall",
  "tile-medium",
  "tile-square",
  "tile-tall",
  "tile-medium",
  "tile-square",
  "tile-tall",
  "tile-medium",
  "tile-square",
  "tile-tall",
  "tile-medium",
  "tile-square",
  "tile-tall",
  "tile-medium",
  "tile-square",
];

const tileColors = [
  "tone-silver",
  "tone-blue",
  "tone-dark-blue",
  "tone-gray",
  "tone-soft-blue",
];

export function App() {
  const [page, setPage] = useState<Page>("home");

  const title = useMemo(() => {
    if (page === "photos") return "الصور";
    if (page === "about") return "من نحن";
    return "التواصل البديل";
  }, [page]);

  return (
    <div className="app" dir="rtl">
      <main className="page-shell" aria-label={title}>
        {page === "home" ? <HomePage onBrowse={() => setPage("photos")} /> : null}
        {page === "photos" ? <PhotosPage /> : null}
        {page === "about" ? <AboutPage /> : null}
      </main>

      <nav className="bottom-nav" aria-label="التنقل الرئيسي">
        <button
          className={page === "home" ? "is-active" : ""}
          type="button"
          onClick={() => setPage("home")}
        >
          <Home aria-hidden="true" size={20} strokeWidth={2.4} />
          <span>الرئيسية</span>
        </button>
        <button
          className={page === "photos" ? "is-active" : ""}
          type="button"
          onClick={() => setPage("photos")}
        >
          <Images aria-hidden="true" size={20} strokeWidth={2.4} />
          <span>الصور</span>
        </button>
        <button
          className={page === "about" ? "is-active" : ""}
          type="button"
          onClick={() => setPage("about")}
        >
          <Info aria-hidden="true" size={20} strokeWidth={2.4} />
          <span>من نحن</span>
        </button>
      </nav>
    </div>
  );
}

function HomePage({ onBrowse }: { onBrowse: () => void }) {
  return (
    <section className="home-page">
      <div className="logo-placeholder" aria-label="مساحة مؤقتة للشعار">
        <Image aria-hidden="true" size={34} strokeWidth={2} />
      </div>
      <h1>التواصل البديل</h1>
      <h2>مساحة تجريبية لعرض الصور والأفكار.</h2>
      <p>
        هذا نموذج أولي بسيط لمراجعة شكل الموقع على الجوال.
        المحتوى الحالي مؤقت وسيتم استبداله لاحقًا.
      </p>
      <button className="primary-button" type="button" onClick={onBrowse}>
        <Images aria-hidden="true" size={20} strokeWidth={2.5} />
        <span>تصفّح الصور</span>
      </button>
    </section>
  );
}

function PhotosPage() {
  return (
    <section className="content-page">
      <header className="page-header">
        <h1>الصور</h1>
        <p>معرض تجريبي بأحجام مختلفة لمراجعة شكل العرض على الجوال.</p>
      </header>

      <div className="masonry-grid" aria-label="معرض صور تجريبي">
        {photoHeights.map((heightClass, index) => (
          <div
            className={`photo-tile ${heightClass} ${tileColors[index % tileColors.length]}`}
            key={index}
          >
            <Image aria-hidden="true" size={24} strokeWidth={2.2} />
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <span>صورة تجريبية</span>
            <small>Album Photo</small>
            <em>مكان الصورة</em>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="content-page about-page">
      <header className="page-header">
        <h1>من نحن</h1>
        <p>
          التواصل البديل موقع تجريبي قيد التصميم، هدفه عرض تجربة بسيطة ونظيفة
          تناسب تصفح الجوال قبل إضافة المحتوى الحقيقي.
        </p>
      </header>

      <section className="follow-section" aria-labelledby="follow-title">
        <h2 id="follow-title">تابعونا</h2>
        <div className="social-links">
          <a href="#">
            <Images aria-hidden="true" size={19} strokeWidth={2.4} />
            <span>Instagram</span>
          </a>
          <a href="#">
            <PlayCircle aria-hidden="true" size={19} strokeWidth={2.4} />
            <span>TikTok</span>
          </a>
          <a href="#">
            <PlayCircle aria-hidden="true" size={19} strokeWidth={2.4} />
            <span>YouTube</span>
          </a>
        </div>
      </section>
    </section>
  );
}
