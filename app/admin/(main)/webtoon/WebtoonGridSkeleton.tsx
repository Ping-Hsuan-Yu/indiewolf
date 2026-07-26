import { Skeleton } from '@/components/admin/ui/skeleton'

export function WebtoonGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      ))}
    </div>
  )
}
