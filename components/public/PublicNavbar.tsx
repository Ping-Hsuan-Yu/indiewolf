import { NavService } from '@/lib/services/navService';
import Navbar from '@/components/public/Navbar';

export default async function PublicNavbar() {
  const navItems = await NavService.getNavItems();
  
  return <Navbar navItems={navItems} />;
}
