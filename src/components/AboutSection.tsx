
export const AboutSection = () => {
  return (
    <section id="about" class="section">
      <div class="max-w-4xl mx-auto text-center mb-16">
        <span class="inline-block px-4 py-2 rounded-full bg-primary-100/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
          About Me
        </span>
        <h2 class="text-4xl md:text-5xl font-bold mb-6 gradient-text">
          Senior Backend Engineer
        </h2>
        <p class="text-lg text-slate-600 dark:text-dark-muted">
          Architecting scalable microservices and cloud-native solutions
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <article class="card backdrop-blur-xl">
          <div class="flex items-start mb-6">
            <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
              <i class="fas fa-code text-2xl" aria-hidden="true"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Microservices Architecture</h3>
              <p class="text-slate-600 dark:text-dark-muted">
                Expert in designing and implementing microservices using Python (FastAPI), Node.js (NestJS), and Go. Building scalable, distributed systems with event-driven architectures.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/20 flex items-center justify-center text-secondary-600 dark:text-secondary-400 mr-4">
              <i class="fas fa-database text-2xl" aria-hidden="true"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Database & Caching</h3>
              <p class="text-slate-600 dark:text-dark-muted">
                Expert in PostgreSQL, MongoDB, Redis, and Elasticsearch. Designing efficient database architectures, optimizing queries, and implementing caching strategies for high-performance applications.
              </p>
            </div>
          </div>
        </article>

        <article class="card backdrop-blur-xl">
          <div class="flex items-start mb-6">
            <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
              <i class="fas fa-mobile-alt text-2xl" aria-hidden="true"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Cloud-Native Development</h3>
              <p class="text-slate-600 dark:text-dark-muted">
                Expert in Docker, Kubernetes, and AWS. Implementing CI/CD pipelines, containerization strategies, and cloud infrastructure for scalable applications.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mr-4">
              <i class="fas fa-cloud text-2xl" aria-hidden="true"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Full-Stack Development</h3>
              <p class="text-slate-600 dark:text-dark-muted">
                Proficient in React.js, Next.js, and JavaScript/TypeScript. Building modern, responsive frontend applications with server-side rendering and optimal user experiences.
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
