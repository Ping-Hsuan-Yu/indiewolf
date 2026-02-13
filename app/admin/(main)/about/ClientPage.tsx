'use client'

import { useState } from 'react'

import { AdminAboutPageData } from '@/app/_actions/admin/about'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/ui/tabs'

import { ProfileEditor } from './ProfileEditor'
import { SocialLinksManager } from './SocialLinksManager'

interface ClientPageProps {
  initialData: AdminAboutPageData
}

export function ClientPage({ initialData }: ClientPageProps) {
  return (
    <div className='grid gap-6 space-y-0'>
      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className='grid w-full grid-cols-2 lg:w-100'>
          <TabsTrigger value='profile'>個人檔案</TabsTrigger>
          <TabsTrigger value='social'>社群連結</TabsTrigger>
        </TabsList>

        <TabsContent value='profile' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>個人檔案設定</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileEditor profiles={initialData.profiles} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='social' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>社群連結管理</CardTitle>
            </CardHeader>
            <CardContent>
              <SocialLinksManager initialLinks={initialData.socialLinks} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
