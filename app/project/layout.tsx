import NavbarHoverDropdown from '@/components/Navbar';
import Footer from '@/components/Footer';
import Main from '@/components/Main';
import { ReactNode } from 'react';

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col gap-8">
      <NavbarHoverDropdown />
      <Main className="flex flex-col gap-8">{children}</Main>
      <Footer />
    </div>
  );
}
