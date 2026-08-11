import { Image, Images } from "lucide-react";
import type { PageId } from "../data/siteContent";
import { siteContent } from "../data/siteContent";

type HomePageProps = {
  onNavigate: (page: PageId) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  const content = siteContent.pages.home;
  const browseButton = content.buttons.find((button) => button.id === "browsePhotos");

  return (
    <section className="home-page">
      <div className="logo-placeholder" aria-label={content.logoLabel}>
        <Image aria-hidden="true" size={34} strokeWidth={2} />
      </div>
      <h1>{content.title}</h1>
      <h2>{content.headline}</h2>
      <p>{content.body}</p>
      {browseButton ? (
        <button className="primary-button" type="button" onClick={() => onNavigate(browseButton.targetPage)}>
          <Images aria-hidden="true" size={20} strokeWidth={2.5} />
          <span>{browseButton.label}</span>
        </button>
      ) : null}
    </section>
  );
}
