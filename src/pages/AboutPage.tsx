import { Images, PlayCircle } from "lucide-react";
import { EditIconButton } from "../components/DemoEditControls";
import { PageHeader } from "../components/PageHeader";
import type { SiteContent, SocialLink } from "../data/siteContent";

const socialIcons = {
  instagram: Images,
  tiktok: PlayCircle,
  youtube: PlayCircle,
};

type AboutContent = SiteContent["pages"]["about"];

type AboutPageProps = {
  content: AboutContent;
  isDemoEditMode: boolean;
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
};

export function AboutPage({ content, isDemoEditMode, onEditText, onEditButton }: AboutPageProps) {
  return (
    <section className="content-page about-page">
      <div className="editable-block">
        <PageHeader title={content.title} text={content.body} />
        {isDemoEditMode ? (
          <div className="page-edit-buttons">
            <EditIconButton
              label="تعديل عنوان من نحن"
              onClick={() =>
                onEditText({
                  title: "تعديل عنوان من نحن",
                  value: content.title,
                  apply: (value, currentContent) => ({
                    ...currentContent,
                    pages: {
                      ...currentContent.pages,
                      about: { ...currentContent.pages.about, title: value },
                    },
                  }),
                })
              }
            />
            <EditIconButton
              label="تعديل نص من نحن"
              onClick={() =>
                onEditText({
                  title: "تعديل نص من نحن",
                  value: content.body,
                  multiline: true,
                  apply: (value, currentContent) => ({
                    ...currentContent,
                    pages: {
                      ...currentContent.pages,
                      about: { ...currentContent.pages.about, body: value },
                    },
                  }),
                })
              }
            />
          </div>
        ) : null}
      </div>

      <section className="follow-section" aria-labelledby="follow-title">
        <div className="editable-line">
          <h2 id="follow-title">{content.followTitle}</h2>
          {isDemoEditMode ? (
            <EditIconButton
              label="تعديل عنوان تابعونا"
              onClick={() =>
                onEditText({
                  title: "تعديل عنوان تابعونا",
                  value: content.followTitle,
                  apply: (value, currentContent) => ({
                    ...currentContent,
                    pages: {
                      ...currentContent.pages,
                      about: { ...currentContent.pages.about, followTitle: value },
                    },
                  }),
                })
              }
            />
          ) : null}
        </div>
        <div className="social-links">
          {[...content.socialLinks]
            .sort((first, second) => first.order - second.order)
            .map((link) => {
              const Icon = socialIcons[link.id as keyof typeof socialIcons] ?? Images;

              return (
                <div className="editable-button-row" key={link.id}>
                  <a href={link.href}>
                    <Icon aria-hidden="true" size={19} strokeWidth={2.4} />
                    <span>{link.label}</span>
                  </a>
                  {isDemoEditMode ? (
                    <button className="edit-chip" type="button" onClick={() => onEditSocialLink(link)}>
                      تعديل
                    </button>
                  ) : null}
                </div>
              );
            })}
        </div>
      </section>
    </section>
  );

  function onEditSocialLink(link: SocialLink) {
    onEditButton({
      title: "تعديل رابط اجتماعي",
      label: link.label,
      href: link.href,
      apply: (label, href, currentContent) => ({
        ...currentContent,
        pages: {
          ...currentContent.pages,
          about: {
            ...currentContent.pages.about,
            socialLinks: currentContent.pages.about.socialLinks.map((item) =>
              item.id === link.id ? { ...item, label, href } : item,
            ),
          },
        },
      }),
    });
  }
}
