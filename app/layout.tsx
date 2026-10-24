import "./globals.css";
import Pixels from "./Pixels";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Pixels />
      </body>
    </html>
  );
}
