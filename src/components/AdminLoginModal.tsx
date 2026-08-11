import { FormEvent, useState } from "react";
import { LogIn, X } from "lucide-react";
import { demoAdminCredentials } from "../data/siteContent";

type AdminLoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
};

export function AdminLoginModal({ isOpen, onClose, onLogin }: AdminLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    if (email.trim() !== demoAdminCredentials.email || password !== demoAdminCredentials.password) {
      setError("بيانات الدخول غير صحيحة. استخدم بيانات التجربة فقط.");
      return;
    }

    setError("");
    setEmail("");
    setPassword("");
    onLogin();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <button className="modal-close" type="button" aria-label="إغلاق" onClick={onClose}>
          <X aria-hidden="true" size={21} strokeWidth={2.5} />
        </button>

        <div className="login-modal-heading">
          <h2 id="admin-login-title">دخول الإدارة</h2>
          <p>نسخة Frontend تجريبية فقط.</p>
        </div>

        <form className="login-form" onSubmit={submitLogin}>
          <label>
            <span>البريد الإلكتروني</span>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="off"
            />
          </label>
          <label>
            <span>كلمة المرور</span>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="off"
            />
          </label>
          {error ? <p className="form-error login-error">{error}</p> : null}
          <button className="primary-button login-submit" type="submit">
            <LogIn aria-hidden="true" size={19} strokeWidth={2.4} />
            <span>تسجيل الدخول</span>
          </button>
        </form>
      </section>
    </div>
  );
}
