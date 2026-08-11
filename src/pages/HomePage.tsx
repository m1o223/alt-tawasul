import { Image, Images, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { EditIconButton } from "../components/DemoEditControls";
import type { ActionButton, PageId, SiteContent } from "../data/siteContent";

type HomeContent = SiteContent["pages"]["home"];

type HomePageProps = {
  content: HomeContent;
  isDemoEditMode: boolean;
  onNavigate: (page: PageId) => void;
  onEditText: (target: {
    title: string;
    value: string;
    multiline?: boolean;
    apply: (value: string, content: SiteContent) => SiteContent;
  }) => void;
  onEditButton: (target: {
    title: string;
    label: string;
    href: string;
    apply: (label: string, href: string, content: SiteContent) => SiteContent;
  }) => void;
  onAddButton: () => void;
};

export function HomePage({
  content,
  isDemoEditMode,
  onNavigate,
  onEditText,
  onEditButton,
  onAddButton,
}: HomePageProps) {
  return (
    <section className="home-page">
      <div className="logo-placeholder" aria-label={content.logoLabel}>
        <Image aria-hidden="true" size={34} strokeWidth={2} />
      </div>

      <EditableLine isActive={isDemoEditMode} onEdit={() => onEditHomeText("title", "تعديل اسم الموقع", content.title)}>
        <h1>{content.title}</h1>
      </EditableLine>

      <EditableLine
        isActive={isDemoEditMode}
        onEdit={() => onEditHomeText("headline", "تعديل العنوان التجريبي", content.headline)}
      >
        <h2>{content.headline}</h2>
      </EditableLine>

      <EditableLine
        isActive={isDemoEditMode}
        onEdit={() => onEditHomeText("body", "تعديل الفقرة", content.body, true)}
      >
        <p>{content.body}</p>
      </EditableLine>

      <div className="button-stack">
        {[...content.buttons]
          .sort((first, second) => first.order - second.order)
          .map((button) => (
            <div className="editable-button-row" key={button.id}>
              <button
                className="primary-button"
                type="button"
                onClick={() => (button.targetPage ? onNavigate(button.targetPage) : undefined)}
              >
                <Images aria-hidden="true" size={20} strokeWidth={2.5} />
                <span>{button.label}</span>
              </button>
              {isDemoEditMode ? (
                <button className="edit-chip" type="button" onClick={() => onEditHomeButton(button)}>
                  تعديل
                </button>
              ) : null}
            </div>
          ))}
        {isDemoEditMode ? (
          <button className="edit-chip add-button-chip" type="button" onClick={onAddButton}>
            <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
            <span>إضافة زر جديد</span>
          </button>
        ) : null}
      </div>
    </section>
  );

  function onEditHomeText(field: "title" | "headline" | "body", title: string, value: string, multiline = false) {
    onEditText({
      title,
      value,
      multiline,
      apply: (nextValue, currentContent) => ({
        ...currentContent,
        pages: {
          ...currentContent.pages,
          home: {
            ...currentContent.pages.home,
            [field]: nextValue,
          },
        },
      }),
    });
  }

  function onEditHomeButton(button: ActionButton) {
    onEditButton({
      title: "تعديل الزر",
      label: button.label,
      href: button.href,
      apply: (label, href, currentContent) => ({
        ...currentContent,
        pages: {
          ...currentContent.pages,
          home: {
            ...currentContent.pages.home,
            buttons: currentContent.pages.home.buttons.map((item) =>
              item.id === button.id ? { ...item, label, href } : item,
            ),
          },
        },
      }),
    });
  }
}

function EditableLine({
  isActive,
  onEdit,
  children,
}: {
  isActive: boolean;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="editable-line">
      {children}
      {isActive ? <EditIconButton label="تعديل النص" onClick={onEdit} /> : null}
    </div>
  );
}
