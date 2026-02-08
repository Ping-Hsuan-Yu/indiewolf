import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card'

export default function AdminDashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>總覽 (Dashboard)</CardTitle>
      </CardHeader>
      <CardContent>
        <p>歡迎來到後台管理系統。這裡目前是一個空白的框架。</p>
        <p>Welcome to the admin dashboard. This is currently a blank framework.</p>
      </CardContent>
    </Card>
  )
}
