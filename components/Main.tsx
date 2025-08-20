export default function Main({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main id="page-content" className={`relative ${className}`}>
      <div
        id="loading-bg"
        className="absolute bg-gray-200 rounded w-full h-full hidden"
      ></div>
      <div
        id="loading-indicator"
        className="absolute animate-pulse bg-white rounded w-full h-full hidden"
      ></div>
      {children}
    </main>
  );
}
