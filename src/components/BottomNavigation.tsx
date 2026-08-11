import { Home, Images, Info } from "lucide-react";
import type { PageId } from "../data/siteContent";
import { siteContent } from "../data/siteContent";

const icons = {
  home: Home,
  photos: Images,
  about: Info,
};

type BottomNavigationProps = {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
};

export function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  return (
    <nav className="bottom-nav" aria-label="التنقل الرئيسي">
      {[...siteContent.navigation]
        .sort((first, second) => first.order - second.order)
        .map((item) => {
          const Icon = icons[item.id];

          return (
            <button
              className={currentPage === item.id ? "is-active" : ""}
              type="button"
              onClick={() => onNavigate(item.id)}
              key={item.id}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={2.4} />
              <span>{item.label}</span>
            </button>
          );
        })}
    </nav>
  );
}
