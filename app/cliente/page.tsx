import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Portal from "./Portal";
import "../site-profissional/site-profissional.css";
import "./cliente.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--f-body" });

export const metadata: Metadata = { title: "Área do cliente", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main className={`sp cl ${display.variable} ${body.variable}`}>
      <div className="wrap"><Portal /></div>
    </main>
  );
}
