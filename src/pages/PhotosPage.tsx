import { Plus } from "lucide-react";
import { EditIconButton } from "../components/DemoEditControls";
import { PageHeader } from "../components/PageHeader";
import { PhotoMasonry } from "../components/PhotoMasonry";
import type { PhotoItem, SiteContent } from "../data/siteContent";

type PhotosContent = SiteContent["pages"]["photos"];

type PhotosPageProps = {
  content: PhotosContent;
  isDemoEditMode: boolean;
  onEditText: (target: {
    title: string;
    value: string;
    multiline?: boolean;
    apply: (value: string, content: SiteContent) => SiteContent;
  }) => void;
  onChangePhotos: (items: PhotoItem[]) => void;
};

export function PhotosPage({ content, isDemoEditMode, onEditText, onChangePhotos }: PhotosPageProps) {
  return (
    <section className="content-page">
      <div className="editable-block">
        <PageHeader title={content.title} text={content.intro} />
        {isDemoEditMode ? (
          <div className="page-edit-buttons">
            <EditIconButton
              label="تعديل عنوان صفحة الصور"
              onClick={() =>
                onEditText({
                  title: "تعديل عنوان صفحة الصور",
                  value: content.title,
                  apply: (value, currentContent) => ({
                    ...currentContent,
                    pages: {
                      ...currentContent.pages,
                      photos: { ...currentContent.pages.photos, title: value },
                    },
                  }),
                })
              }
            />
            <EditIconButton
              label="تعديل نص صفحة الصور"
              onClick={() =>
                onEditText({
                  title: "تعديل نص صفحة الصور",
                  value: content.intro,
                  multiline: true,
                  apply: (value, currentContent) => ({
                    ...currentContent,
                    pages: {
                      ...currentContent.pages,
                      photos: { ...currentContent.pages.photos, intro: value },
                    },
                  }),
                })
              }
            />
          </div>
        ) : null}
      </div>

      {isDemoEditMode ? (
        <label className="add-photo-button">
          <Plus aria-hidden="true" size={18} strokeWidth={2.5} />
          <span>إضافة صورة</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;

              const nextOrder = content.items.length + 1;
              const nextItem: PhotoItem = {
                id: `local-photo-${Date.now()}`,
                number: String(nextOrder).padStart(2, "0"),
                title: "صورة محلية",
                subtitle: file.name,
                note: "معاينة فقط",
                size: "medium",
                tone: "softBlue",
                order: nextOrder,
                previewUrl: URL.createObjectURL(file),
              };

              onChangePhotos([...content.items, nextItem]);
              event.target.value = "";
            }}
          />
        </label>
      ) : null}

      <PhotoMasonry items={content.items} isDemoEditMode={isDemoEditMode} onChangeItems={onChangePhotos} />
    </section>
  );
}
