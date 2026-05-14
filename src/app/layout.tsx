import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TRPCProvider } from "@/components/trpc-provider";
import { CityProvider } from "@/components/city-provider";
import { BackToTop } from "@/components/back-to-top";
import { BASE_URL } from "@/lib/env";
import "@/lib/env-check";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "亲护 - 帮您找到身边靠谱的居家养老服务",
    template: "%s | 亲护",
  },
  description:
    "帮子女在身边找到经过资质核验、有真实评价的居家养老护工。覆盖全国31个省市，提供居家护理、陪诊服务、养老院、日间照料、术后康复等养老服务信息。",
  keywords: ["养老", "护工", "居家护理", "陪诊", "养老服务", "养老院", "日间照料", "临终关怀"],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "亲护",
    title: "亲护 - 帮您找到身边靠谱的居家养老服务",
    description:
      "帮子女在身边找到经过资质核验、有真实评价的居家养老护工。",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "亲护 - 帮您找到身边靠谱的居家养老服务",
    description:
      "帮子女在身边找到经过资质核验、有真实评价的居家养老护工。覆盖全国31个省市。",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
  alternates: {
    languages: {
      'zh-CN': BASE_URL,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    other: {
      'msvalidate.01': '9306ADDD54B7F1999611D21F23B8B373',
      'baidu-site-verification': 'codeva-hQNQ65Hpwu',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-md focus:shadow-lg"
        >
          跳到主要内容
        </a>
        <CityProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </CityProvider>
        <BackToTop />
      </body>
    </html>
  );
}
