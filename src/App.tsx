import { Home, Image, Info, Images, LockKeyhole, LogOut, PlayCircle, Save } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Page = "home" | "photos" | "about" | "admin-login";
type SessionState = {
  isAdmin: boolean;
  user: { email: string } | null;
};

const defaultHomeTitle = "التواصل البديل";
const defaultHomeSubtitle = "مساحة تجريبية لعرض الصور والأفكار.";
const defaultHomeBody =
  "هذا نموذج أولي بسيط لمراجعة شكل الموقع على الجوال. المحتوى الحالي مؤقت وسيتم استبداله لاحقًا.";

const photoHeights = [
  "tile-square",
  "tile-medium",
  "tile-tall",
  "tile-medium",
  "tile-square",
  "tile-tall",
  "tile-medium",
  "tile-square",
  "tile-tall",
  "tile-medium",
  "tile-square",
  "tile-tall",
  "tile-medium",
  "tile-square",
  "tile-tall",
  "tile-medium",
  "tile-square",
  "tile-tall",
  "tile-medium",
  "tile-square",
];

const tileColors = [
  "tone-silver",
  "tone-blue",
  "tone-dark-blue",
  "tone-gray",
  "tone-soft-blue",
];

function getInitialPage(): Page {
  if (window.location.pathname === "/admin/login") return "admin-login";
  return "home";
}

export function App() {
  const [page, setPage] = useState<Page>(getInitialPage);
  const [session, setSession] = useState<SessionState>({ isAdmin: false, user: null });
  const [homeTitle, setHomeTitle] = useState(defaultHomeTitle);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(defaultHomeTitle);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    void refreshSession().catch(() => undefined);
    void loadHomeContent().catch(() => undefined);
  }, []);

  const title = useMemo(() => {
    if (page === "photos") return "الصور";
    if (page === "about") return "من نحن";
    if (page === "admin-login") return "تسجيل دخول الإدارة";
    return homeTitle;
  }, [homeTitle, page]);

  function navigate(nextPage: Page) {
    setPage(nextPage);
    const path = nextPage === "admin-login" ? "/admin/login" : "/";
    window.history.pushState(null, "", path);
  }

  async function refreshSession() {
    const response = await fetch("/api/auth/session");

    if (!response.ok) return;

    const data = (await response.json()) as SessionState;

    setSession(data);

    if (data.isAdmin && page === "admin-login") {
      navigate("home");
    }
  }

  async function loadHomeContent() {
    const response = await fetch("/api/content/home");

    if (!response.ok) return;

    const data = (await response.json()) as { title?: string };
    const nextTitle = data.title || defaultHomeTitle;

    setHomeTitle(nextTitle);
    setDraftTitle(nextTitle);
  }

  async function saveHomeTitle() {
    setSaveMessage("");

    const response = await fetch("/api/content/home-title", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: draftTitle }),
    });
    const data = (await readJson(response)) as { title?: string; error?: string };

    if (!response.ok) {
      setSaveMessage(data.error || "تعذر حفظ العنوان.");
      return;
    }

    setHomeTitle(data.title || draftTitle);
    setDraftTitle(data.title || draftTitle);
    setIsTitleEditing(false);
    setSaveMessage("تم حفظ العنوان.");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setSession({ isAdmin: false, user: null });
    setIsTitleEditing(false);
    setSaveMessage("");
  }

  return (
    <div className="app" dir="rtl">
      <header className="top-admin-bar">
        <button
          className="admin-icon-button"
          type="button"
          aria-label="دخول الإدارة"
          onClick={() => navigate("admin-login")}
        >
          <LockKeyhole aria-hidden="true" size={17} strokeWidth={2.3} />
        </button>
      </header>

      {session.isAdmin ? (
        <div className="edit-mode-strip" role="status">
          <span>وضع التعديل مفعّل</span>
          <button type="button" onClick={logout}>
            <LogOut aria-hidden="true" size={15} strokeWidth={2.4} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      ) : null}

      <main className="page-shell" aria-label={title}>
        {page === "home" ? (
          <HomePage
            homeTitle={homeTitle}
            draftTitle={draftTitle}
            isAdmin={session.isAdmin}
            isTitleEditing={isTitleEditing}
            saveMessage={saveMessage}
            onBrowse={() => navigate("photos")}
            onEditTitle={() => {
              setDraftTitle(homeTitle);
              setIsTitleEditing(true);
            }}
            onCancelTitle={() => {
              setDraftTitle(homeTitle);
              setIsTitleEditing(false);
              setSaveMessage("");
            }}
            onDraftTitleChange={setDraftTitle}
            onSaveTitle={saveHomeTitle}
          />
        ) : null}
        {page === "photos" ? <PhotosPage /> : null}
        {page === "about" ? <AboutPage /> : null}
        {page === "admin-login" ? (
          <AdminLoginPage
            onLoggedIn={async () => {
              await refreshSession();
              await loadHomeContent();
              navigate("home");
            }}
          />
        ) : null}
      </main>

      {page !== "admin-login" ? (
        <nav className="bottom-nav" aria-label="التنقل الرئيسي">
          <button
            className={page === "home" ? "is-active" : ""}
            type="button"
            onClick={() => navigate("home")}
          >
            <Home aria-hidden="true" size={20} strokeWidth={2.4} />
            <span>الرئيسية</span>
          </button>
          <button
            className={page === "photos" ? "is-active" : ""}
            type="button"
            onClick={() => navigate("photos")}
          >
            <Images aria-hidden="true" size={20} strokeWidth={2.4} />
            <span>الصور</span>
          </button>
          <button
            className={page === "about" ? "is-active" : ""}
            type="button"
            onClick={() => navigate("about")}
          >
            <Info aria-hidden="true" size={20} strokeWidth={2.4} />
            <span>من نحن</span>
          </button>
        </nav>
      ) : null}
    </div>
  );
}

function HomePage({
  homeTitle,
  draftTitle,
  isAdmin,
  isTitleEditing,
  saveMessage,
  onBrowse,
  onEditTitle,
  onCancelTitle,
  onDraftTitleChange,
  onSaveTitle,
}: {
  homeTitle: string;
  draftTitle: string;
  isAdmin: boolean;
  isTitleEditing: boolean;
  saveMessage: string;
  onBrowse: () => void;
  onEditTitle: () => void;
  onCancelTitle: () => void;
  onDraftTitleChange: (value: string) => void;
  onSaveTitle: () => void;
}) {
  return (
    <section className="home-page">
      <div className="logo-placeholder" aria-label="مساحة مؤقتة للشعار">
        <Image aria-hidden="true" size={34} strokeWidth={2} />
      </div>

      <div className="editable-title-row">
        {isTitleEditing ? (
          <label className="title-edit-field">
            <span>عنوان الصفحة الرئيسية</span>
            <input
              value={draftTitle}
              onChange={(event) => onDraftTitleChange(event.target.value)}
              maxLength={80}
            />
          </label>
        ) : (
          <h1>{homeTitle}</h1>
        )}

        {isAdmin ? (
          <div className="title-edit-actions">
            {isTitleEditing ? (
              <>
                <button className="admin-action-button" type="button" onClick={onSaveTitle}>
                  <Save aria-hidden="true" size={16} strokeWidth={2.4} />
                  <span>حفظ</span>
                </button>
                <button className="admin-action-button admin-action-secondary" type="button" onClick={onCancelTitle}>
                  إلغاء
                </button>
              </>
            ) : (
              <button className="admin-action-button" type="button" onClick={onEditTitle}>
                تعديل
              </button>
            )}
          </div>
        ) : null}
      </div>

      {saveMessage ? <p className="inline-status">{saveMessage}</p> : null}
      <h2>{defaultHomeSubtitle}</h2>
      <p>{defaultHomeBody}</p>
      <button className="primary-button" type="button" onClick={onBrowse}>
        <Images aria-hidden="true" size={20} strokeWidth={2.5} />
        <span>تصفّح الصور</span>
      </button>
    </section>
  );
}

function AdminLoginPage({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await readJson(response)) as { error?: string };

    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error || "بيانات الدخول غير صحيحة.");
      return;
    }

    onLoggedIn();
  }

  return (
    <section className="admin-login-page">
      <div className="admin-login-header">
        <LockKeyhole aria-hidden="true" size={28} strokeWidth={2.4} />
        <h1>تسجيل دخول الإدارة</h1>
        <p>هذه الصفحة مخصصة للمسؤول فقط.</p>
      </div>

      <form className="admin-login-form" onSubmit={submitLogin}>
        <label>
          <span>البريد الإلكتروني</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          <span>كلمة المرور</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جار التحقق..." : "دخول الإدارة"}
        </button>
      </form>
    </section>
  );
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function PhotosPage() {
  return (
    <section className="content-page">
      <header className="page-header">
        <h1>الصور</h1>
        <p>معرض تجريبي بأحجام مختلفة لمراجعة شكل العرض على الجوال.</p>
      </header>

      <div className="masonry-grid" aria-label="معرض صور تجريبي">
        {photoHeights.map((heightClass, index) => (
          <div
            className={`photo-tile ${heightClass} ${tileColors[index % tileColors.length]}`}
            key={index}
          >
            <Image aria-hidden="true" size={24} strokeWidth={2.2} />
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <span>صورة تجريبية</span>
            <small>Album Photo</small>
            <em>مكان الصورة</em>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="content-page about-page">
      <header className="page-header">
        <h1>من نحن</h1>
        <p>
          التواصل البديل موقع تجريبي قيد التصميم، هدفه عرض تجربة بسيطة ونظيفة
          تناسب تصفح الجوال قبل إضافة المحتوى الحقيقي.
        </p>
      </header>

      <section className="follow-section" aria-labelledby="follow-title">
        <h2 id="follow-title">تابعونا</h2>
        <div className="social-links">
          <a href="#">
            <Images aria-hidden="true" size={19} strokeWidth={2.4} />
            <span>Instagram</span>
          </a>
          <a href="#">
            <PlayCircle aria-hidden="true" size={19} strokeWidth={2.4} />
            <span>TikTok</span>
          </a>
          <a href="#">
            <PlayCircle aria-hidden="true" size={19} strokeWidth={2.4} />
            <span>YouTube</span>
          </a>
        </div>
      </section>
    </section>
  );
}
