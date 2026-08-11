import { Edit3 } from "lucide-react";

type EditIconButtonProps = {
  label: string;
  onClick: () => void;
};

export function EditIconButton({ label, onClick }: EditIconButtonProps) {
  return (
    <button className="edit-icon-button" type="button" aria-label={label} onClick={onClick}>
      <Edit3 aria-hidden="true" size={15} strokeWidth={2.5} />
    </button>
  );
}

type EditTextModalProps = {
  title: string;
  value: string;
  multiline?: boolean;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function EditTextModal({
  title,
  value,
  multiline = false,
  onChange,
  onCancel,
  onSave,
}: EditTextModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="login-modal edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
        <div className="login-modal-heading">
          <h2 id="edit-modal-title">{title}</h2>
          <p>هذا تعديل مؤقت داخل الواجهة فقط.</p>
        </div>
        <label className="edit-field">
          <span>القيمة الجديدة</span>
          {multiline ? (
            <textarea id="edit-text-value" value={value} onChange={(event) => onChange(event.target.value)} rows={5} />
          ) : (
            <input id="edit-text-value" value={value} onChange={(event) => onChange(event.target.value)} />
          )}
        </label>
        <div className="edit-modal-actions">
          <button className="primary-button" type="button" onClick={onSave}>
            حفظ تجريبي
          </button>
          <button className="secondary-button" type="button" onClick={onCancel}>
            إلغاء
          </button>
        </div>
      </section>
    </div>
  );
}

type EditButtonModalProps = {
  title: string;
  label: string;
  href: string;
  onLabelChange: (value: string) => void;
  onHrefChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function EditButtonModal({
  title,
  label,
  href,
  onLabelChange,
  onHrefChange,
  onCancel,
  onSave,
}: EditButtonModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="login-modal edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-button-title">
        <div className="login-modal-heading">
          <h2 id="edit-button-title">{title}</h2>
          <p>تعديل مؤقت لاسم الزر والرابط.</p>
        </div>
        <label className="edit-field">
          <span>اسم الزر</span>
          <input id="edit-button-label" value={label} onChange={(event) => onLabelChange(event.target.value)} />
        </label>
        <label className="edit-field">
          <span>الرابط</span>
          <input id="edit-button-href" dir="ltr" value={href} onChange={(event) => onHrefChange(event.target.value)} />
        </label>
        <div className="edit-modal-actions">
          <button className="primary-button" type="button" onClick={onSave}>
            حفظ تجريبي
          </button>
          <button className="secondary-button" type="button" onClick={onCancel}>
            إلغاء
          </button>
        </div>
      </section>
    </div>
  );
}
