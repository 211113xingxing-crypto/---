import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TRPCProvider } from "@/components/trpc-provider";
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
    default: "养老本地服务 - 帮您找到身边靠谱的居家养老服务",
    template: "%s | 养老本地服务",
  },
  description:
    "帮子女在上海本地找到经过资质核验、有真实评价的居家养老护工。覆盖上海各区，提供居家护理、陪诊服务、日间照料、术后康复等养老服务信息。",
  keywords: ["养老", "护工", "居家护理", "陪诊", "上海养老", "养老服务", "日间照料"],
  metadataBase: new URL("https://elder.navi-resources.com"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "养老本地服务",
    title: "养老本地服务 - 帮您找到身边靠谱的居家养老服务",
    description:
      "帮子女在上海本地找到经过资质核验、有真实评价的居家养老护工。",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
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
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
