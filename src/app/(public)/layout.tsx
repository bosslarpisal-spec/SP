//src/app/(public)/layout.tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext'
import LangToggle from '@/components/layout/LangToggle'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <div style={{
        width: '100%',
        minWidth: 0,
        overflowX: 'hidden',
      }}>
        <Navbar />
        <main style={{
          width: '100%',
          minWidth: 0,
        }}>
          {children}
        </main>
        <Footer />
      </div>
      <LangToggle />
    </LanguageProvider>
  )
}
