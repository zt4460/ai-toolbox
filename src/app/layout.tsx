import type { Metadata, Viewport } from 'next';
import { Inspector } from 'react-dev-inspector';
import { AuthProvider } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AI 工具箱',
    template: '%s | AI 工具箱',
  },
  description: '一站式 AI 创作工具集，支持图片生成、视频生成、数字人创作、视频配音等强大功能',
  keywords: [
    'AI工具箱',
    '图片生成',
    '视频生成',
    '数字人',
    '视频配音',
    'AI创作',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#252525' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="light dark:[color-scheme:dark]">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 antialiased">
        <Inspector />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
