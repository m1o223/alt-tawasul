import { LogOut, Save } from "lucide-react";

type DemoEditBarProps = {
  isEditing: boolean;
  onLogout: () => void;
  onSave: () => void;
};

export function DemoEditBar({ isEditing, onLogout, onSave }: DemoEditBarProps) {
  if (!isEditing) return null;

  return (
    <div className="edit-mode-bar" role="status">
      <span>وضع التعديل التجريبي مفعّل</span>
      <div>
        <button type="button" onClick={onSave}>
          <Save aria-hidden="true" size={15} strokeWidth={2.4} />
          <span>حفظ تجريبي</span>
        </button>
        <button type="button" onClick={onLogout}>
          <LogOut aria-hidden="true" size={15} strokeWidth={2.4} />
          <span>خروج</span>
        </button>
      </div>
    </div>
  );
}
