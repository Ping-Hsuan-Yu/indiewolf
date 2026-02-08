import { getNavItems } from '@/app/_actions/public/nav';
import Navbar from '@/components/public/Navbar';

export default async function PublicNavbar() {
  const navItems = await getNavItems();
  
  return <Navbar navItems={navItems} />;
}
