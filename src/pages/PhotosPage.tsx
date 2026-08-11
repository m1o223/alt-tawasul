import { PageHeader } from "../components/PageHeader";
import { PhotoMasonry } from "../components/PhotoMasonry";
import { siteContent } from "../data/siteContent";

export function PhotosPage() {
  const content = siteContent.pages.photos;

  return (
    <section className="content-page">
      <PageHeader title={content.title} text={content.intro} />
      <PhotoMasonry />
    </section>
  );
}
