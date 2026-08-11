import { Image } from "lucide-react";
import { siteContent } from "../data/siteContent";

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

export function PhotoMasonry() {
  return (
    <div className="masonry-grid" aria-label="معرض صور تجريبي">
      {[...siteContent.pages.photos.items]
        .sort((first, second) => first.order - second.order)
        .map((item) => (
          <div
            className={`photo-tile ${sizeClasses[item.size]} ${toneClasses[item.tone]}`}
            key={item.id}
          >
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
