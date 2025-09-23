import type { ReactNode } from 'react';

export default function Main({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  const composedClassName = ['relative', className].filter(Boolean).join(' ');

  return (
    <main id="page-content" className={composedClassName}>
      <div
        id="loading-bg"
        className="absolute hidden h-full w-full rounded bg-gray-200"
      ></div>
      <div
        id="loading-indicator"
        className="absolute hidden h-full w-full rounded animate-pulse bg-white"
      ></div>
      {children}
    </main>
  );
}
