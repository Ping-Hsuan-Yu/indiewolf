'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/admin/ui/button'
import { Spinner } from '@/components/admin/ui/spinner'
import { Input } from '@/components/admin/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/admin/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    } else {
      router.refresh()
      router.push('/admin')
      // Keep loading true while redirecting
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Admin Login</CardTitle>
          <CardDescription>🩷❤️🧡💛💚🩵💙💜🖤🩶🤍🤎</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
              <label
                htmlFor='email'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                ✉️
              </label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='m@example.com'
                required
                disabled={loading}
              />
            </div>
            <div className='grid gap-2'>
              <label
                htmlFor='password'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                🤫
              </label>
              <Input id='password' name='password' type='password' required disabled={loading} />
            </div>
            {error && (
              <p className='text-sm text-red-500 text-center bg-red-50 p-2 rounded'>{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? <Spinner /> : '🚀'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
