import { Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { BottomNavigation } from "./components/BottomNavigation";
import { DemoEditBar } from "./components/DemoEditBar";
import { EditButtonModal, EditTextModal } from "./components/DemoEditControls";
import { siteContent, type ActionButton, type PageId, type SiteContent, type SocialLink } from "./data/siteContent";
import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import { PhotosPage } from "./pages/PhotosPage";

type TextEditTarget = {
  title: string;
  value: string;
  multiline?: boolean;
  apply: (value: string, content: SiteContent) => SiteContent;
};

type ButtonEditTarget = {
  title: string;
  label: string;
  href: string;
  apply: (label: string, href: string, content: SiteContent) => SiteContent;
};

const socialLinksStorageKey = "alt-tawasul-demo-social-links";

type StoredSocialLink = Partial<SocialLink> & {
  label?: string;
  href?: string;
};

function cloneContent() {
  const nextContent = structuredClone(siteContent);
  const storedLinks = readStoredSocialLinks(nextContent.pages.about.socialLinks);

  if (storedLinks.length > 0) {
    nextContent.pages.about.socialLinks = storedLinks;
  }

  return nextContent;
}

function readStoredSocialLinks(fallbackLinks: SocialLink[]) {
  if (typeof window === "undefined") return fallbackLinks;

  try {
    const storedValue = window.localStorage.getItem(socialLinksStorageKey);
    if (!storedValue) return fallbackLinks;

    const parsedValue = JSON.parse(storedValue) as unknown;
    if (!Array.isArray(parsedValue)) return fallbackLinks;

    const normalizedLinks = parsedValue
      .map((item: StoredSocialLink, index) => {
        const name = String(item.name ?? item.label ?? "").trim();
        const url = String(item.url ?? item.href ?? "").trim();

        if (!name || !url) return null;

        return {
          id: String(item.id ?? `social-${index + 1}`),
          name,
          url,
          icon: String(item.icon ?? iconKeyForName(name)),
          order: Number.isFinite(item.order) ? Number(item.order) : index + 1,
        };
      })
      .filter((link): link is SocialLink => Boolean(link))
      .sort((first, second) => first.order - second.order)
      .map((link, index) => ({ ...link, order: index + 1 }));

    return normalizedLinks.length > 0 ? normalizedLinks : fallbackLinks;
  } catch {
    return fallbackLinks;
  }
}

function saveSocialLinksToStorage(links: SocialLink[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(socialLinksStorageKey, JSON.stringify(links));
}

function iconKeyForName(name: string) {
  const normalizedName = name.trim().toLowerCase();

  if (normalizedName === "instagram") return "instagram";
  if (normalizedName === "tiktok" || normalizedName === "tik tok") return "tiktok";
  if (normalizedName === "youtube" || normalizedName === "you tube") return "youtube";
  if (normalizedName === "facebook" || normalizedName === "fb") return "facebook";

  return "link";
}

export function App() {
  const [page, setPage] = useState<PageId>("home");
  const [content, setContent] = useState<SiteContent>(() => cloneContent());
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDemoEditMode, setIsDemoEditMode] = useState(false);
  const [textEdit, setTextEdit] = useState<TextEditTarget | null>(null);
  const [textDraft, setTextDraft] = useState("");
  const [buttonEdit, setButtonEdit] = useState<ButtonEditTarget | null>(null);
  const [buttonLabelDraft, setButtonLabelDraft] = useState("");
  const [buttonHrefDraft, setButtonHrefDraft] = useState("");

  const title = useMemo(() => content.pages[page].title, [content, page]);

  function openTextEdit(target: TextEditTarget) {
    setTextEdit(target);
    setTextDraft(target.value);
  }

  function saveTextEdit() {
    if (!textEdit) return;
    setContent((currentContent) => textEdit.apply(textDraft, currentContent));
    setTextEdit(null);
  }

  function openButtonEdit(target: ButtonEditTarget) {
    setButtonEdit(target);
    setButtonLabelDraft(target.label);
    setButtonHrefDraft(target.href);
  }

  function saveButtonEdit() {
    if (!buttonEdit) return;
    setContent((currentContent) => buttonEdit.apply(buttonLabelDraft, buttonHrefDraft, currentContent));
    setButtonEdit(null);
  }

  function addHomeButton() {
    setContent((currentContent) => ({
      ...currentContent,
      pages: {
        ...currentContent.pages,
        home: {
          ...currentContent.pages.home,
          buttons: [
            ...currentContent.pages.home.buttons,
            {
              id: `demo-button-${Date.now()}`,
              label: "زر تجريبي جديد",
              href: "#",
              order: currentContent.pages.home.buttons.length + 1,
            },
          ],
        },
      },
    }));
  }

  return (
    <div className="app" dir="rtl">
      <button
        className="admin-entry-button"
        type="button"
        aria-label="دخول الإدارة التجريبي"
        onClick={() => setIsLoginOpen(true)}
      >
        <Settings aria-hidden="true" size={17} strokeWidth={2.3} />
      </button>

      <DemoEditBar
        isEditing={isDemoEditMode}
        onLogout={() => setIsDemoEditMode(false)}
        onSave={() => window.alert("حفظ تجريبي فقط. التغييرات ستختفي عند تحديث الصفحة.")}
      />

      <main className="page-shell" aria-label={title}>
        {page === "home" ? (
          <HomePage
            content={content.pages.home}
            isDemoEditMode={isDemoEditMode}
            onNavigate={setPage}
            onEditText={openTextEdit}
            onEditButton={openButtonEdit}
            onAddButton={addHomeButton}
          />
        ) : null}
        {page === "photos" ? (
          <PhotosPage
            content={content.pages.photos}
            isDemoEditMode={isDemoEditMode}
            onEditText={openTextEdit}
            onChangePhotos={(items) =>
              setContent((currentContent) => ({
                ...currentContent,
                pages: {
                  ...currentContent.pages,
                  photos: {
                    ...currentContent.pages.photos,
                    items,
                  },
                },
              }))
            }
          />
        ) : null}
        {page === "about" ? (
          <AboutPage
            content={content.pages.about}
            isDemoEditMode={isDemoEditMode}
            onEditText={openTextEdit}
            onChangeSocialLinks={(socialLinks) =>
              setContent((currentContent) => {
                saveSocialLinksToStorage(socialLinks);

                return {
                  ...currentContent,
                  pages: {
                    ...currentContent.pages,
                    about: {
                      ...currentContent.pages.about,
                      socialLinks,
                    },
                  },
                };
              })
            }
          />
        ) : null}
      </main>

      <BottomNavigation currentPage={page} onNavigate={setPage} />

      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={() => {
          setIsLoginOpen(false);
          setIsDemoEditMode(true);
        }}
      />

      {textEdit ? (
        <EditTextModal
          title={textEdit.title}
          value={textDraft}
          multiline={textEdit.multiline}
          onChange={setTextDraft}
          onCancel={() => setTextEdit(null)}
          onSave={saveTextEdit}
        />
      ) : null}

      {buttonEdit ? (
        <EditButtonModal
          title={buttonEdit.title}
          label={buttonLabelDraft}
          href={buttonHrefDraft}
          onLabelChange={setButtonLabelDraft}
          onHrefChange={setButtonHrefDraft}
          onCancel={() => setButtonEdit(null)}
          onSave={saveButtonEdit}
        />
      ) : null}
    </div>
  );
}
