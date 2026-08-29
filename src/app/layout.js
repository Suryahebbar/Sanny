import "./globals.css";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import NavBar from "@/components/NavBar/NavBar";
import TransitionProvider from "@/providers/TransitionProvider";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata = {
  title: "Surya's Portfolio | Unified Next.js + GSAP Experience",
  description: "A premium portfolio showcasing creative sections powered by Next.js, GSAP, and Lenis.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${dmSans.variable}`}
      style={{ scrollBehavior: "auto" }}
    >
      <body className="antialiased">
        <NavBar />
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
