'use client'

import { Button } from '@/components/admin/ui/button'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-bold">發生錯誤</h1>
      <p className="text-muted-foreground text-sm">
        載入此頁面時發生問題，請重試。
      </p>
      {error?.message && (
        <p className="text-muted-foreground max-w-md text-center text-xs">
          {error.message}
        </p>
      )}
      <Button onClick={reset}>重試</Button>
    </div>
  )
}
