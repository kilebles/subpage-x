import { Header } from '@/components/layout/Header'
import { InstallationCard } from '@/components/features/installation/InstallationCard'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { useUser } from '@/context/UserContext'

function App() {
  const { isLoading, error } = useUser()

  if (isLoading) {
    return (
      <div className="app">
        <Header />
        <main className="main">
          <div className="loading">Loading...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <main className="main">
          <div className="error">{error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <main className="main">
        <InstallationCard />
      </main>
      <footer className="footer">
        <LanguageToggle />
      </footer>
    </div>
  )
}

export default App
