import { ChevronDown, ChevronUp, Image, Trash2 } from "lucide-react";
import type { PhotoItem } from "../data/siteContent";

const sizeClasses = {
  square: "tile-square",
  medium: "tile-medium",
  tall: "tile-tall",
};

const toneClasses = {
  silver: "tone-silver",
  blue: "tone-blue",
  darkBlue: "tone-dark-blue",
  gray: "tone-gray",
  softBlue: "tone-soft-blue",
};

type PhotoMasonryProps = {
  items: PhotoItem[];
  isDemoEditMode: boolean;
  onChangeItems: (items: PhotoItem[]) => void;
};

export function PhotoMasonry({ items, isDemoEditMode, onChangeItems }: PhotoMasonryProps) {
  const orderedItems = [...items].sort((first, second) => first.order - second.order);

  function removeItem(id: string) {
    onChangeItems(renumber(orderedItems.filter((item) => item.id !== id)));
  }

  function moveItem(id: string, direction: -1 | 1) {
    const currentIndex = orderedItems.findIndex((item) => item.id === id);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= orderedItems.length) return;

    const nextItems = [...orderedItems];
    const [currentItem] = nextItems.splice(currentIndex, 1);
    nextItems.splice(nextIndex, 0, currentItem);
    onChangeItems(renumber(nextItems));
  }

  return (
    <div className="masonry-grid" aria-label="معرض صور تجريبي">
      {orderedItems.map((item) => (
        <div
          className={`photo-tile ${sizeClasses[item.size]} ${toneClasses[item.tone]} ${item.previewUrl ? "has-preview" : ""}`}
          key={item.id}
        >
          {item.previewUrl ? <img src={item.previewUrl} alt="" /> : null}
          {isDemoEditMode ? (
            <div className="photo-edit-tools">
              <button type="button" aria-label="حذف الصورة" onClick={() => removeItem(item.id)}>
                <Trash2 aria-hidden="true" size={15} strokeWidth={2.3} />
              </button>
              <button type="button" aria-label="رفع ترتيب الصورة" onClick={() => moveItem(item.id, -1)}>
                <ChevronUp aria-hidden="true" size={15} strokeWidth={2.3} />
              </button>
              <button type="button" aria-label="خفض ترتيب الصورة" onClick={() => moveItem(item.id, 1)}>
                <ChevronDown aria-hidden="true" size={15} strokeWidth={2.3} />
              </button>
            </div>
          ) : null}
          <Image aria-hidden="true" size={24} strokeWidth={2.2} />
          <strong>{item.number}</strong>
          <span>{item.title}</span>
          <small>{item.subtitle}</small>
          <em>{item.note}</em>
        </div>
      ))}
    </div>
  );
}

function renumber(items: PhotoItem[]) {
  return items.map((item, index) => ({
    ...item,
    number: String(index + 1).padStart(2, "0"),
    order: index + 1,
  }));
}
