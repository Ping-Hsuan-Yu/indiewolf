import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Page() {
  return (
    <div className="h-dvh flex flex-col justify-between">
      <Header />
      <main id="page-content"></main>
      <Footer />
    </div>
  );
}
