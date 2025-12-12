export interface Empresa {
  id: number;
  name: string;
}

export interface PageItem {
  name: string;
  ref: string;
  icon: React.ComponentType<{ className?: string }>;
};

export interface NavigationProps {
  pages: PageItem[];
  currentRoute: string;
}

export interface GestionHumanaDropdownProps {
  empresas: Empresa[];
  onEmpresaClick: (empresa: Empresa, e: Event) => void;
}

export interface MobileMenuProps {
  pages: PageItem[];
  currentRoute: string;
  empresas: Empresa[];
  onEmpresaClick: (empresa: Empresa, e: Event) => void;
}

export interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export interface UserDropdownProps {
  user: {
    email: string;
    info_corta: {
      nombres: string;
      apellidos: string;
    };
  };
}