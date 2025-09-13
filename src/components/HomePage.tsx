import { Navigation } from './Navigation.tsx'
import { HeroSection } from './HeroSection.tsx'
import { AboutSection } from './AboutSection.tsx'

export const HomePage = () => {
  return (
    <>
      <Navigation />
      
      <main id="main-content">
        <HeroSection />
        
        <AboutSection />
        
        {/* Experience Section */}
        <section id="experience" class="section relative overflow-hidden">
          {/* Background Decorations */}
          <div class="absolute inset-0 overflow-hidden opacity-10">
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
            <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" style="animation-delay: 1s"></div>
          </div>

          <div class="container relative">
            <div class="max-w-4xl mx-auto text-center mb-16">
              <span class="inline-block px-4 py-2 rounded-full bg-secondary-100/50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 text-sm font-medium mb-4">
                Professional Journey
              </span>
              <h2 class="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Work Experience
              </h2>
              <p class="text-lg text-slate-600 dark:text-dark-muted">
                Building innovative solutions across different domains
              </p>
            </div>

            {/* Timeline */}
            <div class="relative max-w-4xl mx-auto">
              {/* Vertical Line */}
              <div class="absolute left-8 lg:left-[8.5rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500"></div>

              <div class="space-y-12">
                {/* Cognitus */}
                <div class="group relative pl-20 lg:pl-48">
                  {/* Timeline Dot */}
                  <div class="absolute left-8 lg:left-[8.5rem] top-8 w-4 h-4 bg-white dark:bg-dark-card rounded-full border-4 border-primary-500 transform -translate-x-1/2"></div>

                  {/* Timeline Date */}
                  <div class="lg:absolute relative mb-4 lg:mb-0 lg:-left-[3rem] top-6 inline-flex items-center justify-end px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium min-w-[140px]">
                    Nov 2023 - Present
                  </div>

                  <div class="card backdrop-blur-xl mt-6 lg:mt-0 relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div class="flex flex-col md:flex-row gap-6 items-start">
                      <div class="flex-shrink-0">
                        <div class="w-20 h-20 rounded-2xl bg-white dark:bg-dark-card shadow-2xl border-2 border-primary-500 p-4 transform rotate-3 transition-transform group-hover:rotate-6">
                          <picture>
                            <source srcset="/images/cognitus-logo.svg" type="image/svg+xml" />
                            <img
                              src="/images/cognitus-logo.svg"
                              alt="Cognitus"
                              class="w-full h-full object-contain"
                              width="80"
                              height="80"
                              loading="lazy"
                              decoding="async"
                            />
                          </picture>
                        </div>
                      </div>
                      <div class="flex-grow">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <h3 class="text-2xl font-bold gradient-text">Software Developer</h3>
                          <a
                            href="https://cognitus.com/"
                            target="_blank"
                            class="inline-flex items-center text-lg font-medium text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            Cognitus Consulting LLC
                            <i class="fas fa-external-link-alt ml-2 text-sm"></i>
                          </a>
                        </div>
                        <p class="text-slate-600 dark:text-dark-muted mb-6">
                          Core contributor to LambdaX enterprise contract-lifecycle-management platform. Designed and implemented agreement-header, line-item, dataset, and modification microservices. Built Redis Streams + Kafka fabric for high-throughput event propagation, sustaining {'>'}15k events/sec. Improved contract-search latency from ~750ms to {'<'}180ms through query optimization.
                        </p>
                        <div class="flex flex-wrap gap-2">
                          {['Python', 'FastAPI', 'Node.js', 'TypeScript', 'React.js', 'SQLAlchemy', 'AWS', 'Kubernetes', 'Redis', 'PostgreSQL'].map(tech => (
                            <span class="px-4 py-2 rounded-xl bg-primary-100/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium backdrop-blur-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grype Digital */}
                <div class="group relative pl-20 lg:pl-48">
                  <div class="absolute left-8 lg:left-[8.5rem] top-8 w-4 h-4 bg-white dark:bg-dark-card rounded-full border-4 border-secondary-500 transform -translate-x-1/2"></div>
                  <div class="lg:absolute relative mb-4 lg:mb-0 lg:-left-[4rem] top-6 inline-flex items-center justify-end px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded-full text-sm font-medium min-w-[140px]">
                    May 2022 - Nov 2023
                  </div>

                  <div class="card backdrop-blur-xl mt-6 lg:mt-0 relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div class="flex flex-col md:flex-row gap-6 items-start">
                      <div class="flex-shrink-0">
                        <div class="w-20 h-20 rounded-2xl bg-white dark:bg-dark-card shadow-2xl border-2 border-secondary-500 p-4 transform -rotate-3 transition-transform group-hover:-rotate-6">
                          <picture>
                            <source srcset="/images/optimized/grype-logo.avif" type="image/avif" />
                            <source srcset="/images/optimized/grype-logo.webp" type="image/webp" />
                            <img
                              src="/images/grype-logo.png"
                              alt="Grype Digital"
                              class="w-full h-full object-contain"
                              width="80"
                              height="80"
                              loading="lazy"
                              decoding="async"
                            />
                          </picture>
                        </div>
                      </div>
                      <div class="flex-grow">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <h3 class="text-2xl font-bold gradient-text">Software Developer</h3>
                          <a
                            href="https://grype.ca"
                            target="_blank"
                            class="inline-flex items-center text-lg font-medium text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            Grype Digital
                            <i class="fas fa-external-link-alt ml-2 text-sm"></i>
                          </a>
                        </div>
                        <p class="text-slate-600 dark:text-dark-muted mb-6">
                          Led backend development for Member Lounge SaaS platform. Architected tiered subscription billing with Stripe integration, reducing revenue leakage to {'<'}0.5%. Built threaded discussion forum and RabbitMQ-driven notification engine, increasing average session time by 35%. Implemented MFA authentication and zero-downtime deployments, maintaining 99.9%+ uptime.
                        </p>
                        <div class="flex flex-wrap gap-2">
                          {['NestJS', 'Node.js', 'TypeScript', 'React', 'MongoDB', 'Next.js', 'React.js', 'DigitalOcean', 'Stripe'].map(tech => (
                            <span class="px-4 py-2 rounded-xl bg-secondary-100/50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 font-medium backdrop-blur-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" class="section relative overflow-hidden">
          <div class="container relative">
            <div class="max-w-4xl mx-auto text-center mb-16">
              <span class="inline-block px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                Portfolio
              </span>
              <h2 class="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Featured Projects
              </h2>
              <p class="text-lg text-slate-600 dark:text-dark-muted">
                Showcasing innovative solutions and technical expertise
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" class="section bg-white dark:bg-gray-900">
          <div class="container">
            <div class="max-w-3xl mx-auto text-center mb-12">
              <span class="inline-block px-4 py-2 rounded-full bg-green-100/50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
                Technical Expertise
              </span>
              <h2 class="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Skills & Technologies
              </h2>
              <p class="text-lg text-slate-600 dark:text-dark-muted">
                Comprehensive expertise across the full technology stack
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" class="section relative overflow-hidden">
          <div class="container relative">
            <div class="max-w-4xl mx-auto text-center mb-16">
              <span class="inline-block px-4 py-2 rounded-full bg-purple-100/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
                Get In Touch
              </span>
              <h2 class="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Let's Work Together
              </h2>
              <p class="text-lg text-slate-600 dark:text-dark-muted">
                Ready to build something amazing? Let's discuss your next project.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
