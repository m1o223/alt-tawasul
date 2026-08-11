import { Images, PlayCircle } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { siteContent } from "../data/siteContent";

const socialIcons = {
  instagram: Images,
  tiktok: PlayCircle,
  youtube: PlayCircle,
};

export function AboutPage() {
  const content = siteContent.pages.about;

  return (
    <section className="content-page about-page">
      <PageHeader title={content.title} text={content.body} />

      <section className="follow-section" aria-labelledby="follow-title">
        <h2 id="follow-title">{content.followTitle}</h2>
        <div className="social-links">
          {[...content.socialLinks]
            .sort((first, second) => first.order - second.order)
            .map((link) => {
              const Icon = socialIcons[link.id];

              return (
                <a href={link.href} key={link.id}>
                  <Icon aria-hidden="true" size={19} strokeWidth={2.4} />
                  <span>{link.label}</span>
                </a>
              );
            })}
        </div>
      </section>
    </section>
  );
}
