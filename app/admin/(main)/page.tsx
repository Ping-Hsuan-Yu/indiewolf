import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/admin/ui/card'

export default function AdminDashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>總覽</CardTitle>
      </CardHeader>
      <CardContent>
        <p>歡迎來到後台管理系統。</p>
      </CardContent>
    </Card>
  )
}
