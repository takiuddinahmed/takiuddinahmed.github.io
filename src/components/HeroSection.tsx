
export const HeroSection = () => {
  return (
    <section
      class="relative min-h-[calc(100vh-5rem)] lg:min-h-screen bg-white dark:bg-gray-900 flex items-center overflow-x-hidden"
      role="banner"
    >
      {/* Subtle Grid Background */}
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      ></div>

      <div class="container relative py-12 lg:py-20">
        <div class="max-w-7xl mx-auto">
          {/* Main Content */}
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div class="lg:col-span-7 space-y-8 lg:space-y-10 px-4 sm:px-6 lg:px-0">
              {/* Header */}
              <div class="space-y-6">
                <div class="inline-flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <span class="relative flex h-2 w-2">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                      aria-hidden="true"
                    ></span>
                    <span
                      class="relative inline-flex rounded-full h-2 w-2 bg-green-500"
                      aria-hidden="true"
                    ></span>
                  </span>
                  <span class="text-gray-600 dark:text-gray-400">Available for new opportunities</span>
                </div>

                <h1
                  class="text-4xl lg:text-6xl font-bold tracking-tight max-w-3xl"
                  style="font-size: 2.25rem; line-height: 2.5rem;"
                >
                  Hi, I'm
                  <span class="text-gray-900 dark:text-white"> Takiuddin</span>
                  <span
                    class="block mt-2 text-3xl lg:text-4xl text-gray-600 dark:text-gray-400"
                    style="font-size: 1.875rem; line-height: 2.25rem;"
                  >
                    Senior Backend Engineer
                  </span>
                </h1>

                <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                  Senior Backend Engineer with 5+ years of experience in Python, FastAPI, Node.js, React.js, Next.js, and microservices architecture. Expert in cloud-native development, database design, and building scalable enterprise solutions.
                </p>
              </div>

              {/* Experience Highlights */}
              <div class="flex flex-wrap items-center gap-8 lg:gap-12">
                <div>
                  <div class="text-3xl font-bold">5+</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    Years of<br />Experience
                  </div>
                </div>
                <div
                  class="hidden lg:block h-12 w-px bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                ></div>
                <div>
                  <div class="text-3xl font-bold">15+</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    Microservices<br />Built
                  </div>
                </div>
                <div
                  class="hidden lg:block h-12 w-px bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                ></div>
                <div>
                  <div class="text-3xl font-bold">99.9%</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    Uptime<br />Achieved
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div class="space-y-4">
                <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  CORE TECHNOLOGIES
                </div>
                <div class="flex flex-wrap items-center gap-6">
                  <div class="group" title="Python">
                    <i
                      class="fab fa-python text-3xl text-[#3776AB] transition-all duration-300 group-hover:scale-110"
                      aria-label="Python"
                    ></i>
                  </div>
                  <div class="group" title="FastAPI">
                    <i
                      class="fas fa-bolt text-3xl text-[#009688] transition-all duration-300 group-hover:scale-110"
                      aria-label="FastAPI"
                    ></i>
                  </div>
                  <div class="group" title="Node.js">
                    <i
                      class="fab fa-node-js text-3xl text-[#339933] transition-all duration-300 group-hover:scale-110"
                      aria-label="Node.js"
                    ></i>
                  </div>
                  <div class="group" title="React">
                    <i
                      class="fab fa-react text-3xl text-[#61DAFB] transition-all duration-300 group-hover:scale-110"
                      aria-label="React"
                    ></i>
                  </div>
                  <div class="group" title="Next.js">
                    <i
                      class="fab fa-neos text-3xl text-gray-500 transition-all duration-300 group-hover:scale-110"
                      aria-label="Next.js"
                    ></i>
                  </div>
                  <div class="group" title="JavaScript">
                    <i
                      class="fab fa-js-square text-3xl text-[#F7DF1E] transition-all duration-300 group-hover:scale-110"
                      aria-label="JavaScript"
                    ></i>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div class="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  class="btn btn-primary group relative overflow-hidden cursor-pointer chat-trigger focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Start AI chat conversation"
                  aria-describedby="chat-description"
                >
                  <span class="relative z-10 text-white dark:text-gray-900">Let's Talk via AI</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="relative z-10 h-4 w-4 ml-2 text-white dark:text-gray-900"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <a
                  href="/files/md_takiuddin_resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-outline group"
                  aria-label="Download resume PDF (opens in new tab)"
                >
                  <i class="fas fa-download mr-2 group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                  Download Resume
                </a>

                <div class="flex items-center gap-3">
                  <a
                    href="https://github.com/takiuddinahmed"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="social-icon w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-[#333] hover:text-white transition-all duration-300"
                    aria-label="Visit GitHub profile (opens in new tab)"
                  >
                    <i class="fab fa-github text-lg" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/takiuddin-ahmed-871607b5/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="social-icon w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-[#0077B5] hover:text-white transition-all duration-300"
                    aria-label="Visit LinkedIn profile (opens in new tab)"
                  >
                    <i class="fab fa-linkedin-in text-lg" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://calendly.com/takiuddinahmed-ciyp"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="social-icon w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-[#006BFF] hover:text-white transition-all duration-300"
                    aria-label="Schedule a meeting on Calendly (opens in new tab)"
                  >
                    <i class="fas fa-calendar-alt text-lg" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Image */}
            <div class="lg:col-span-5 flex justify-center lg:justify-end">
              <div class="relative">
                <div class="relative z-10 w-72 h-72 lg:w-96 lg:h-96">
                  <picture>
                    <source srcset="/images/optimized/profile.avif" type="image/avif" />
                    <source srcset="/images/optimized/profile.webp" type="image/webp" />
                    <img
                      src="/images/profile.jpg"
                      alt="Md Takiuddin Ahmed - Senior Backend Engineer"
                      class="w-full h-full object-cover rounded-3xl shadow-2xl"
                      loading="eager"
                      fetchpriority="high"
                      width="384"
                      height="384"
                    />
                  </picture>
                </div>

                {/* Decorative elements */}
                <div
                  class="absolute -top-4 -left-4 w-24 h-24 bg-primary-500/20 rounded-full blur-xl"
                  aria-hidden="true"
                ></div>
                <div
                  class="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary-500/20 rounded-full blur-xl"
                  aria-hidden="true"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
