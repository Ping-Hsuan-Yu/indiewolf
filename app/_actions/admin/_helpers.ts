// 非 server action 模組：供 admin actions 共用的小工具（不加 'use server'，避免變成對外 RPC 端點）

/**
 * 執行一批 PostgREST update builder，任一筆失敗回傳錯誤結果，全數成功回傳 null。
 * 消除各 reorder action 重複的 Promise.all + error 檢查樣板（MAINT-5）。
 */
export async function runBatchUpdate(
  updates: readonly PromiseLike<{ error: unknown }>[]
): Promise<{ success: false; error: string } | null> {
  const results = await Promise.all(updates)
  const errors = results.filter((r) => r.error)

  if (errors.length > 0) {
    console.error('Batch Update Errors:', errors)
    return { success: false, error: 'Some updates failed' }
  }

  return null
}
