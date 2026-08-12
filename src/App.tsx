import { Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { BottomNavigation } from "./components/BottomNavigation";
import { DemoEditBar } from "./components/DemoEditBar";
import { EditButtonModal, EditTextModal } from "./components/DemoEditControls";
import { siteContent, type ActionButton, type PageId, type SiteContent } from "./data/siteContent";
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

function cloneContent() {
  return structuredClone(siteContent);
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
              setContent((currentContent) => ({
                ...currentContent,
                pages: {
                  ...currentContent.pages,
                  about: {
                    ...currentContent.pages.about,
                    socialLinks,
                  },
                },
              }))
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
