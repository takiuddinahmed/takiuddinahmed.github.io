
interface LayoutProps {
  children: any
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en" prefix="og: http://ogp.me/ns#">
      <head>
        <title>Md Takiuddin Ahmed - Senior Backend Engineer | Python, FastAPI, Microservices Expert</title>
        
        {/* Meta */}
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Primary Meta Tags */}
        <meta
          name="description"
          content="Md Takiuddin Ahmed is a Senior Backend Engineer with 5+ years of experience in Python, FastAPI, Node.js, React.js, Next.js, TypeScript, microservices architecture, and cloud-native development. Expert in PostgreSQL, MongoDB, Redis, Kafka, Docker, Kubernetes, and AWS. Available for remote full-time roles and freelance consulting."
        />
        <meta name="author" content="Md Takiuddin Ahmed" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Keywords */}
        <meta
          name="keywords"
          content="senior backend engineer, python developer, fastapi expert, microservices architect, nodejs developer, reactjs developer, nextjs developer, javascript developer, typescript developer, postgresql expert, mongodb developer, redis developer, kafka developer, docker expert, kubernetes developer, aws developer, cloud native developer, api development, gRPC developer, nestjs developer, sqlalchemy expert, software engineer, remote developer, freelance backend developer, bangladesh developer, takiuddin ahmed, md takiuddin"
        />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://takiuddin.me/" />
        <meta name="canonical" content="https://takiuddin.me/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://takiuddin.me/" />
        <meta property="og:title" content="Md Takiuddin Ahmed - Senior Backend Engineer | Microservices & Cloud Expert" />
        <meta property="og:description" content="Senior Backend Engineer with 5+ years of experience in Python, FastAPI, Node.js, React.js, Next.js, microservices architecture, and cloud-native development. Expert in PostgreSQL, MongoDB, Redis, Kafka, Docker, and Kubernetes." />
        <meta property="og:image" content="https://takiuddin.me/images/profile.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Md Takiuddin Ahmed - Senior Backend Engineer Portfolio" />
        <meta property="og:site_name" content="Md Takiuddin Ahmed Portfolio" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://takiuddin.me/" />
        <meta property="twitter:title" content="Md Takiuddin Ahmed - Senior Backend Engineer | Microservices & Cloud Expert" />
        <meta property="twitter:description" content="Senior Backend Engineer with 5+ years of experience in Python, FastAPI, Node.js, React.js, Next.js, microservices architecture, and cloud-native development." />
        <meta property="twitter:image" content="https://takiuddin.me/images/profile.jpg" />
        <meta property="twitter:image:alt" content="Md Takiuddin Ahmed - Senior Backend Engineer Portfolio" />
        <meta property="twitter:creator" content="@takiuddin_dev" />
        
        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#4f46e5" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="application-name" content="Md Takiuddin Portfolio" />
        <meta name="apple-mobile-web-app-title" content="Takiuddin Portfolio" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="msvalidate.01" content="E10325114750E3C06172C97C567E33F0" />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Md Takiuddin Ahmed",
            "alternateName": "Takiuddin Ahmed",
            "description": "Senior Backend Engineer specializing in Python, FastAPI, Node.js, React.js, Next.js, microservices architecture, and cloud-native development",
            "url": "https://takiuddin.me",
            "image": "https://takiuddin.me/images/profile.jpg",
            "sameAs": [
              "https://github.com/takiuddinahmed",
              "https://www.linkedin.com/in/takiuddin-ahmed-871607b5/",
              "https://calendly.com/takiuddinahmed-ciyp"
            ],
            "jobTitle": "Senior Backend Engineer",
            "worksFor": {
              "@type": "Organization",
              "name": "Cognitus Consulting LLC",
              "url": "https://cognitus.com"
            },
            "alumniOf": {
              "@type": "EducationalOrganization",
              "name": "Rajshahi University of Engineering & Technology",
              "url": "https://www.ruet.ac.bd"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Rajshahi",
              "addressCountry": "Bangladesh"
            },
            "email": "takiuddinahmed@gmail.com",
            "telephone": "+8801723100925",
            "knowsAbout": [
              "Python", "FastAPI", "Node.js", "React.js", "Next.js", "JavaScript", "TypeScript", "Go",
              "Microservices Architecture", "PostgreSQL", "MongoDB", "Redis", "Apache Kafka", "Docker",
              "Kubernetes", "AWS", "gRPC", "NestJS", "SQLAlchemy", "RabbitMQ", "Elasticsearch", "DevOps", "API Development"
            ]
          })
        }} />
        
        {/* Favicons */}
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* FontAwesome CSS */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />

        {/* Octicons CSS */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/octicons/2.0.2/octicons.min.css"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />

        {/* Main CSS */}
        <link rel="stylesheet" href="/css/output.css" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/css/output.css" as="style" />
        <link rel="preload" href="images/optimized/profile.avif" as="image" type="image/avif" />
        <link rel="preload" href="images/profile.jpg" as="image" type="image/jpeg" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* Theme script */}
        <script src="/js/theme.js"></script>

        {/* Inline styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .loader {
              border: 2px solid transparent;
              border-top-color: #4b5563;
              border-radius: 9999px;
              width: 1rem;
              height: 1rem;
              animation: spin 0.6s linear infinite;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            .btn {
              position: relative;
              transition: all 0.2s ease-in-out;
              outline: 2px solid transparent;
              outline-offset: 2px;
            }
            .btn:focus-visible {
              outline: 2px solid #4f46e5;
              outline-offset: 2px;
            }
            .btn:active {
              transform: translateY(1px);
            }
            .btn:disabled {
              opacity: 0.6;
              cursor: not-allowed;
              transform: none;
            }
            .social-icon {
              position: relative;
              transition: all 0.2s ease-in-out;
              outline: 2px solid transparent;
              outline-offset: 2px;
            }
            .social-icon:focus-visible {
              outline: 2px solid #4f46e5;
              outline-offset: 2px;
            }
            .social-icon:hover {
              transform: translateY(-2px);
            }
            .social-icon:active {
              transform: translateY(0);
            }
          `
        }} />
      </head>
      <body class="dark:bg-dark-bg">
        {children}
        
        {/* Scripts */}
        <script src="/js/main.js"></script>
        <script src="/js/chat.js"></script>
        <script src="/js/cookie-consent.js"></script>
      </body>
    </html>
  )
}
