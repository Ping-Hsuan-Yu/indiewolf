import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-dvh flex flex-col">
            <Header />
                {children}
            <Footer />
        </div>
    );
}