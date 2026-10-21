import type { Metadata, Viewport } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import WipeOrigin from "@/components/WipeOrigin";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SD Innovations | Transforming Ideas into Impactful Solutions",
    template: "%s | SD Innovations",
  },
  description:
    "SD Innovations combines innovative thinking and cutting-edge technology to help businesses solve complex problems — software, data, AI, cybersecurity and ServiceNow.",
};

export const viewport: Viewport = {
  themeColor: "#04060d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrument.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide split headings only when JS will reveal them */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.dataset.theme=t}catch(e){d.dataset.theme='dark'}try{var p=localStorage.getItem('palette');d.dataset.palette=(p==='orange'||p==='emerald'||p==='blue')?p:'mono'}catch(e){d.dataset.palette='mono'}})()",
          }}
        />
      </head>
      <body className="min-h-screen">
        <SmoothScroll />
        <WipeOrigin />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
