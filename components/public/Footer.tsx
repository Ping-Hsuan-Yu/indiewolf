'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');
    return <footer className="text-center text-sm py-8 mt-auto">{t('copyright')}</footer>;
}