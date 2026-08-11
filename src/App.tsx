import { useMemo, useState } from "react";
import { BottomNavigation } from "./components/BottomNavigation";
import { siteContent, type PageId } from "./data/siteContent";
import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import { PhotosPage } from "./pages/PhotosPage";

export function App() {
  const [page, setPage] = useState<PageId>("home");

  const title = useMemo(() => siteContent.pages[page].title, [page]);

  return (
    <div className="app" dir="rtl">
      <main className="page-shell" aria-label={title}>
        {page === "home" ? <HomePage onNavigate={setPage} /> : null}
        {page === "photos" ? <PhotosPage /> : null}
        {page === "about" ? <AboutPage /> : null}
      </main>

      <BottomNavigation currentPage={page} onNavigate={setPage} />
    </div>
  );
}
