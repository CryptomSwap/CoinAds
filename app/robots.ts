import { MetadataRoute } from 'next';
import { PUBLIC_BASE_URL } from '@/config/domain';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/app/*', // Disallow all app dashboard routes
          '/api/*', // Disallow API routes
          '/auth/*', // Disallow auth routes
          '/admin/*', // Disallow admin routes
          '/debug/*', // Disallow debug routes
          '/test-*', // Disallow test routes
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${PUBLIC_BASE_URL}/sitemap.xml`,
    host: PUBLIC_BASE_URL,
  };
}
