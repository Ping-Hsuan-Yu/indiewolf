import "./tailwind.css";
import "./style.css";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-4 md:mx-8 max-w-5xl lg:mx-auto lg:px-8">
      {children}
    </div>
  );
}

