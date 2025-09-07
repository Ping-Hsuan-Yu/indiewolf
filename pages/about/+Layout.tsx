import Footer from "../../components/Footer";
import Header from "../../components/Header";
import NavbarHoverDropdown from "../../components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-dvh flex flex-col">
            <NavbarHoverDropdown />
                {children}
            <Footer />
        </div>
    );
}