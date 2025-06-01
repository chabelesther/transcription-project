import "./globals.css";

export const metadata = {
  title: "Transcription Audio",
  description: "Service de transcription audio en texte en utilisant l'IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
