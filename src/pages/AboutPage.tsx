import {
  ChevronDown,
  ChevronUp,
  Facebook,
  Instagram,
  Link,
  Music2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  Youtube,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { EditIconButton } from "../components/DemoEditControls";
import { PageHeader } from "../components/PageHeader";
import type { SiteContent, SocialLink } from "../data/siteContent";

const linkErrorMessage = "يرجى إدخال رابط صحيح يبدأ بـ https://";

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
  onChangeSocialLinks: (links: SocialLink[]) => void;
};

export function AboutPage({ content, isDemoEditMode, onEditText, onChangeSocialLinks }: AboutPageProps) {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [draftLinks, setDraftLinks] = useState<SocialLink[]>(() => orderedLinks(content.socialLinks));
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkHref, setNewLinkHref] = useState("");
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    if (!isEditingLinks) {
      setDraftLinks(orderedLinks(content.socialLinks));
    }
  }, [content.socialLinks, isEditingLinks]);

  useEffect(() => {
    if (!isDemoEditMode) {
      setIsAddingLink(false);
      setIsEditingLinks(false);
      setLinkError("");
      setDraftLinks(orderedLinks(content.socialLinks));
    }
  }, [content.socialLinks, isDemoEditMode]);

  const visibleLinks = orderedLinks(content.socialLinks);

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
        <div className="follow-heading-row">
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

          {isDemoEditMode ? (
            <div className="social-admin-actions">
              <button
                className="edit-chip"
                type="button"
                onClick={() => {
                  setIsEditingLinks(true);
                  setIsAddingLink(false);
                  setLinkError("");
                  setDraftLinks(orderedLinks(content.socialLinks));
                }}
              >
                <Pencil aria-hidden="true" size={15} strokeWidth={2.4} />
                <span>تعديل الروابط</span>
              </button>
              <button
                className="edit-chip"
                type="button"
                onClick={() => {
                  setIsAddingLink(true);
                  setIsEditingLinks(false);
                  setLinkError("");
                }}
              >
                <Plus aria-hidden="true" size={15} strokeWidth={2.4} />
                <span>إضافة رابط جديد</span>
              </button>
            </div>
          ) : null}
        </div>

        {isAddingLink ? (
          <form className="social-link-form" onSubmit={addSocialLink}>
            <label>
              <span>اسم المنصة أو الزر</span>
              <input value={newLinkName} onChange={(event) => setNewLinkName(event.target.value)} />
            </label>
            <label>
              <span>الرابط</span>
              <input
                dir="ltr"
                value={newLinkHref}
                onChange={(event) => setNewLinkHref(event.target.value)}
                placeholder="https://www.example.com"
              />
            </label>
            {linkError ? <p className="form-error">{linkError}</p> : null}
            <div className="social-form-actions">
              <button className="primary-button compact-button" type="submit">
                إضافة
              </button>
              <button className="secondary-button compact-button" type="button" onClick={cancelAddLink}>
                إلغاء
              </button>
            </div>
          </form>
        ) : null}

        {isEditingLinks ? (
          <div className="social-link-editor">
            {draftLinks.map((link, index) => {
              const Icon = iconForPlatform(link.label);

              return (
                <div className="social-edit-row" key={link.id}>
                  <div className="social-edit-icon">
                    <Icon aria-hidden="true" size={18} strokeWidth={2.4} />
                  </div>
                  <div className="social-edit-body">
                    <div className="social-edit-indicator">
                      <Pencil aria-hidden="true" size={15} strokeWidth={2.4} />
                      <span>تعديل</span>
                    </div>
                    <label>
                      <span>الاسم</span>
                      <input
                        value={link.label}
                        onChange={(event) => updateDraftLink(link.id, { label: event.target.value })}
                      />
                    </label>
                    <label>
                      <span>الرابط</span>
                      <input
                        dir="ltr"
                        value={link.href}
                        onChange={(event) => updateDraftLink(link.id, { href: event.target.value })}
                      />
                    </label>
                    <div className="social-row-tools">
                      <button type="button" aria-label="رفع ترتيب الرابط" onClick={() => moveDraftLink(link.id, -1)} disabled={index === 0}>
                        <ChevronUp aria-hidden="true" size={15} strokeWidth={2.4} />
                      </button>
                      <button
                        type="button"
                        aria-label="خفض ترتيب الرابط"
                        onClick={() => moveDraftLink(link.id, 1)}
                        disabled={index === draftLinks.length - 1}
                      >
                        <ChevronDown aria-hidden="true" size={15} strokeWidth={2.4} />
                      </button>
                      <button type="button" aria-label="حذف الرابط" onClick={() => removeDraftLink(link.id)}>
                        <Trash2 aria-hidden="true" size={15} strokeWidth={2.4} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {linkError ? <p className="form-error">{linkError}</p> : null}
            <div className="social-form-actions">
              <button className="primary-button compact-button" type="button" onClick={saveDraftLinks}>
                <Save aria-hidden="true" size={16} strokeWidth={2.4} />
                <span>حفظ</span>
              </button>
              <button className="secondary-button compact-button" type="button" onClick={cancelEditLinks}>
                <X aria-hidden="true" size={16} strokeWidth={2.4} />
                <span>إلغاء</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="social-links">
            {visibleLinks.map((link) => {
              const Icon = iconForPlatform(link.label);

              return (
                <a href={link.href} target={isExternalLink(link.href) ? "_blank" : undefined} rel="noreferrer" key={link.id}>
                  <Icon aria-hidden="true" size={19} strokeWidth={2.4} />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );

  function addSocialLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const label = newLinkName.trim();
    const href = newLinkHref.trim();
    const error = validateLinkInput(label, href);

    if (error) {
      setLinkError(error);
      return;
    }

    const nextLink: SocialLink = {
      id: `social-${Date.now()}`,
      label,
      href,
      order: visibleLinks.length + 1,
    };

    onChangeSocialLinks(renumberLinks([...visibleLinks, nextLink]));
    setNewLinkName("");
    setNewLinkHref("");
    setLinkError("");
    setIsAddingLink(false);
  }

  function cancelAddLink() {
    setNewLinkName("");
    setNewLinkHref("");
    setLinkError("");
    setIsAddingLink(false);
  }

  function updateDraftLink(id: string, changes: Partial<SocialLink>) {
    setDraftLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, ...changes } : link)));
    setLinkError("");
  }

  function moveDraftLink(id: string, direction: -1 | 1) {
    setDraftLinks((currentLinks) => {
      const currentIndex = currentLinks.findIndex((link) => link.id === id);
      const nextIndex = currentIndex + direction;

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentLinks.length) return currentLinks;

      const nextLinks = [...currentLinks];
      const [currentLink] = nextLinks.splice(currentIndex, 1);
      nextLinks.splice(nextIndex, 0, currentLink);
      return renumberLinks(nextLinks);
    });
  }

  function removeDraftLink(id: string) {
    setDraftLinks((currentLinks) => renumberLinks(currentLinks.filter((link) => link.id !== id)));
    setLinkError("");
  }

  function saveDraftLinks() {
    const invalidLink = draftLinks.find((link) => validateLinkInput(link.label, link.href));

    if (invalidLink) {
      setLinkError(validateLinkInput(invalidLink.label, invalidLink.href));
      return;
    }

    onChangeSocialLinks(renumberLinks(draftLinks));
    setIsEditingLinks(false);
    setLinkError("");
  }

  function cancelEditLinks() {
    setDraftLinks(orderedLinks(content.socialLinks));
    setIsEditingLinks(false);
    setLinkError("");
  }
}

function orderedLinks(links: SocialLink[]) {
  return [...links].sort((first, second) => first.order - second.order);
}

function renumberLinks(links: SocialLink[]) {
  return links.map((link, index) => ({
    ...link,
    order: index + 1,
  }));
}

function validateLinkInput(label: string, href: string) {
  if (!label.trim() || !href.trim()) return linkErrorMessage;
  if (!isExternalLink(href.trim())) return linkErrorMessage;
  return "";
}

function isExternalLink(href: string) {
  return href.startsWith("https://") || href.startsWith("http://");
}

function iconForPlatform(label: string) {
  const normalizedLabel = label.trim().toLowerCase();

  if (normalizedLabel === "instagram") return Instagram;
  if (normalizedLabel === "tiktok" || normalizedLabel === "tik tok") return Music2;
  if (normalizedLabel === "youtube" || normalizedLabel === "you tube") return Youtube;
  if (normalizedLabel === "facebook" || normalizedLabel === "fb") return Facebook;

  return Link;
}
