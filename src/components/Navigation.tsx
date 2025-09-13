
export const Navigation = () => {
  return (
    <>
      {/* Skip to main content for accessibility */}
      <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary-600 text-white p-2 z-50">
        Skip to main content
      </a>
      
      {/* Navbar */}
      <nav
        class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 transition-all duration-300 dark:bg-dark-bg/80 dark:border-dark-border/50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div class="container">
          <div class="flex items-center justify-between h-20">
            <a
              href="#"
              class="text-2xl font-bold gradient-text"
              style="text-decoration: none !important"
              aria-label="Md Takiuddin Ahmed - Home"
            >
              Md<span class="text-secondary-500 dark:text-secondary-400">Takiuddin</span>
            </a>

            <div class="flex items-center gap-4">
              {/* Desktop Menu */}
              <div class="hidden md:flex items-center gap-6">
                <a
                  href="#about"
                  class="text-slate-600 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400"
                >About</a>
                <a
                  href="#experience"
                  class="text-slate-600 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400"
                >Experience</a>
                <a
                  href="#projects"
                  class="text-slate-600 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400"
                >Projects</a>
                <a
                  href="#skills"
                  class="text-slate-600 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400"
                >Skills</a>
                <a
                  href="#contact"
                  class="text-slate-600 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400"
                >Contact</a>
              </div>

              <div class="flex items-center gap-4">
                <label
                  for="darkSwitch"
                  class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-dark-border/30 flex items-center justify-center text-slate-600 dark:text-dark-text hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
                  aria-label="Toggle dark mode"
                  role="button"
                  tabindex={0}
                >
                  <input type="checkbox" id="darkSwitch" class="hidden" />
                  <i class="fas fa-moon dark:!hidden" aria-hidden="true"></i>
                  <i class="fas fa-sun !hidden dark:!block" aria-hidden="true"></i>
                </label>

                {/* Mobile Menu Button */}
                <button
                  id="mobileMenuBtn"
                  class="md:hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-dark-border/30 flex items-center justify-center text-slate-600 dark:text-dark-text hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Toggle mobile menu"
                  aria-expanded="false"
                  aria-controls="mobileMenu"
                >
                  <i class="fas fa-bars text-xl" aria-hidden="true"></i>
                </button>

                {/* Contact Button (Desktop Only) */}
                <a
                  href="mailto:takiuddinahmed@gmail.com"
                  class="hidden md:flex btn btn-primary"
                  aria-label="Send email to Md Takiuddin Ahmed"
                >
                  <i
                    class="fas fa-paper-plane mr-2 text-white dark:text-gray-900"
                    aria-hidden="true"
                  ></i>
                  <span class="text-white dark:text-gray-900">Contact Me</span>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            id="mobileMenu"
            class="md:hidden h-0 overflow-hidden transition-all duration-300"
            role="menu"
          >
            <div class="py-4 space-y-4">
              <a
                href="#about"
                class="block px-4 py-2 text-slate-600 dark:text-dark-muted hover:bg-slate-50 dark:hover:bg-dark-border/50 rounded-lg transition-colors"
                role="menuitem"
              >About</a>
              <a
                href="#experience"
                class="block px-4 py-2 text-slate-600 dark:text-dark-muted hover:bg-slate-50 dark:hover:bg-dark-border/50 rounded-lg transition-colors"
                role="menuitem"
              >Experience</a>
              <a
                href="#projects"
                class="block px-4 py-2 text-slate-600 dark:text-dark-muted hover:bg-slate-50 dark:hover:bg-dark-border/50 rounded-lg transition-colors"
                role="menuitem"
              >Projects</a>
              <a
                href="#skills"
                class="block px-4 py-2 text-slate-600 dark:text-dark-muted hover:bg-slate-50 dark:hover:bg-dark-border/50 rounded-lg transition-colors"
                role="menuitem"
              >Skills</a>
              <a
                href="#contact"
                class="block px-4 py-2 text-slate-600 dark:text-dark-muted hover:bg-slate-50 dark:hover:bg-dark-border/50 rounded-lg transition-colors"
                role="menuitem"
              >Contact</a>

              {/* Contact Button in Mobile Menu */}
              <a
                href="mailto:takiuddinahmed@gmail.com"
                class="block px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-dark-border/50 rounded-lg transition-colors"
                role="menuitem"
              >
                <i class="fas fa-paper-plane mr-2" aria-hidden="true"></i>
                Send Email
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
