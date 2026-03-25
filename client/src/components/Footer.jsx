export default function Footer() {
    return (
      <footer className="mx-auto mt-10 max-w-4xl px-4 pb-8 text-center">
        <div className="border-t border-forest-200 pt-6">
          <p className="text-sm text-gray-500">
            Kontakt:{" "}
            <a href="mailto:agroasistent.kontakt@gmail.com"
              className="text-forest-600 hover:underline">
              agroasistent.kontakt@gmail.com
            </a>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            © {new Date().getFullYear()} AgroAsistent
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Korišćenjem aplikacije prihvatate da je sadržaj stranice informativnog karaktera i da je koristite na sopstvenu odgovornost.
          </p>
        </div>
      </footer>
    )
  }
