# Personal & Contact Profile 
Full Name: Md Takiuddin

Common short form: “Taki”

Professional Title: Senior Backend Engineer

Alternate labels: Backend-Focused Full-Stack Developer, Software Engineer (Microservices & Cloud)

Base Location & Time Zone: Bangladesh (Asia/Dhaka, UTC +6)

Comfortable collaborating with globally distributed teams across time zones

Primary Contact

📞 Mobile: +880 1723 100 925 (WhatsApp enabled; preferred for scheduling)

📧 Email: takiuddinahmed@gmail.com (primary, fastest response)

Online Presence

GitHub: https://github.com/takiuddinahmed

Public projects in Python, Node.js, Go; > 500 commits in the past year

LinkedIn: https://www.linkedin.com/in/takiuddin-ahmed-871607b5

1.5 k + connections; endorsed for Python, FastAPI, Microservices

Personal website: https://takiuddin.me — tech blog posts, project case studies, and speaking history

Language Proficiency

Bangla — native

English — full professional proficiency (spoken & written)

Hindi — limited working proficiency

Age & Identification

27 years old (DOB 1998)

Bangladeshi passport and national ID are current

Work Availability

Open to remote full-time roles and freelance consulting


# Work Experience 

## Cognitus Consulting LLC · Software Developer
Remote | Nov 2023 – Present | Product: LambdaX (Enterprise Contract-Lifecycle-Management)

#### Scope & Environment

Part of a 24-engineer platform team; core contributor to the contract-authoring domain.

Tech stack: Python (FastAPI), SQLAlchemy, Node.js, Go, PostgreSQL, Redis, Kafka, gRPC, Kubernetes, Keycloak, Docker, Socket.io, Elasticsearch/Kibana.

#### Core Feature Development

- Designed and implemented agreement-header, line-item, dataset, and modification microservices, supplying CRUD+workflow APIs used by front-end, BI, and third-party integrations.

- Authored > automated unit/integration tests in PyTest and jest, maintaining > 90 % coverage for contract modules.

#### Low-Code Flow Orchestrator

- Extended the in-house drag-and-drop orchestration engine: published 50+ reusable “action blocks” (Contract lifecycle management, SAP create, Outlook send, DocuSign sign, Teams notify).

- Enabled legal and procurement staff to automate contract lifecycles without developer intervention, cutting turnaround from days to hours.

#### Real-Time & Messaging Architecture

- Built a Redis Streams + Kafka fabric for high-throughput event propagation between microservices; sustained >15 k events/sec in load tests.

- Introduced Socket.io-based user-activity streams feeding an Elasticsearch audit index; supports SOC-2 log-retention policy (365 days).

#### Performance & Reliability

- Profiled SQLAlchemy hotspots, rewrote queries with CTEs and proper indexes; improved contract-search latency from ~750 ms to <180 ms (P95).

- Added Prometheus alerts for SLA breaches; mean-time-to-detect dropped by 40 %.

#### Collaboration & Leadership

- Conduct regular code reviews and mentor junior back-end engineers on microservice patterns, testing, and observability.


## Grype Digital · Software Developer
Remote | May 2022 – Nov 2023 | Products: Member Lounge (SaaS), HPSA portal

#### Team & Stack

- Led a 4-developer back-end squad for Member Lounge; stack: NestJS, TypeScript, MongoDB, RabbitMQ, Redis, React/Next.js, Docker, GitHub Actions.

- Solo-built HPSA on Python (FastAPI/MVC) + React/Next.js.

#### Subscription & Billing System

- Architected tiered plans (monthly/annual), proration logic, coupon support, Stripe webhook processing, and automated invoicing; revenue leakage reduced to <0.5 %.

#### Discussion Forum & Engagement

- Implemented threaded posts/comments with rich-media uploads; average session time ↑ 35 %.

- Deployed a queue-driven notification engine (browser push, email, SMS) shared across billing reminders and forum activity; opt-in rate > 80 %.

#### Security Enhancements

- Rolled out multi-factor authentication (email OTP + device trust); account-takeover incidents dropped to zero post-launch.

#### DevOps & Uptime

- Set up zero-downtime deploys via Blue/Green strategy on Docker Swarm; maintained 99.9 % + uptime over 12 months.

#### Collaboration & Client Impact

- Directly collaborated with the CEO and design team; translated high-level business goals into technical specs and sprint plans.

- Conducted monthly stakeholder demos, gathering feedback that shaped backlog priorities.

## Bugfixers · Full-Stack Developer
Hybrid | Dhaka, Bangladesh | Mar 2020 – Apr 2022

#### Project Portfolio

- Clients included LearnGenie, Future Track Learning, Noor Alfreed Technical Services, Devsfit, and the Bangladesh Navy.

#### Stack variety:
 Node.js (Express.js), React, Flutter, Electron.js, Python, MySQL, MongoDB, Socket.io, RabbitMQ, Redis, AWS EC2/S3, Linux VPS.

#### Key Deliverables

- Built secure intranet desktop apps for the Navy using Electron + React, meeting strict offline-capability and encryption requirements.

- Developed real-time dashboards with Socket.io auto-refresh, improving operational awareness for client admins.

- Introduced microservice decomposition with RabbitMQ event buses and Redis caching, reducing monolith deployment time by 60 %.

#### DevOps Contributions

- Implemented CI/CD pipelines on GitHub Actions and AWS CodeDeploy; average release cycle shortened from weekly to daily.

- Provisioned and hardened Linux VPS instances (NGINX, UFW, Fail2Ban) for SME clients lacking dedicated DevOps staff.

#### Bug Triage & Refactoring

Acted as first-responder for production incidents; resolved >150 critical bugs, achieving <1 % open-bug rate at exit.

Refactored legacy codebases (PHP/Vanilla JS) into modern Express + React stacks, boosting maintainability scores in SonarQube by 45 %.

Ready for the next detailed section (e.g., Key Projects, Technical Skills, or Education)? Just say the word!



# Key Projects
## LambdaX – Enterprise Contract-Lifecycle-Management Platform
(Cognitus Consulting LLC · Nov 2023 – Present · B2B SaaS for Fortune-scale U.S. companies)

#### Objective
Replace scattered, e-mail–driven contract processes with a single, audit-ready system that can integrate SAP, Outlook, Teams and DocuSign.

#### My role
Core back-end developer for agreement-header, line-item, dataset and modification micro-services; extended the proprietary drag-and-drop flow-orchestrator so non-technical legal teams automate complex approval steps.

#### Architecture: 
Polyglot microservices (Python + FastAPI, Node.js + NestJS, Go); PostgreSQL for transactional data; Redis Streams + Kafka for high-throughput event fan-out; gRPC for service-to-service calls; containerised on Kubernetes with Keycloak SSO.

#### Key contributions & impact

- Designed 18 reusable orchestration “action blocks,” cutting legal-ops turnaround from days to hours.

- Built Socket.io → Elasticsearch audit pipeline that meets SOC-2 retention requirements and slashes incident triage time.

- Query optimisation (CTEs, indexes) reduced P95 contract-search latency from ~750 ms to well under 200 ms.

## Taxstar – UAE Corporate-Tax SaaS
(Independent · Aug 2023 – Feb 2024 · FinTech micro-SaaS for SMB → enterprise)

#### Objective
 Help UAE businesses comply with new federal corporate-tax rules via automated calculations, forecasting, and deadline reminders.

#### My role
 Solo architect & developer for back-end platform; built end-to-end MVP and onboarding flows.

#### Architecture
Dockerised Python/Flask micro-services on Kubernetes; MongoDB data store; REST APIs; integrations with Xero and Zoho ERP for ledger import; mailgun-based notification service.

#### Key contributions & impact

- Implemented rules-driven engine that auto-calculates liabilities and projects future tax exposure.

- API connectors eliminated manual CSV uploads, reducing onboarding effort by an order of magnitude.

- Multi-tenant design ready for horizontal scaling and future VAT / payroll-tax modules.

## Member Lounge – Membership-Engagement Suite (SaaS)
(Grype Digital · May 2022 – Nov 2023 · High-traffic portal for sports associations & non-profits)

#### Objective
 Provide organisations with subscription billing, community discussions and automated reminders in one white-label platform.

#### My role
 Back-end lead (team of four); owned subscription, payments and engagement modules.

#### Architecture
NestJS + MongoDB micro-services; RabbitMQ + Redis queue; React/Next.js front end; Stripe billing; Docker + GitHub Actions CI/CD.

#### Key contributions & impact

- Shipped tiered billing with proration and coupons; reduced revenue leakage to < 1 %.

- Built threaded discussion forum and RabbitMQ-driven notification engine (browser, e-mail, SMS) — average session length rose > 30 %.

- Rolled out MFA authentication and zero-downtime deploys, sustaining 99.9 % uptime.

## Honest Elite – Social-Media & Messaging Platform
(Independent · Sep 2022 – Mar 2024 · Niche social network for creators & communities)

#### Objective
Deliver a rich-media social network with real-time chat, voice/video calls and personalised recommendations.

#### My role
 Full-stack owner — designed schema, micro-services and front end; managed Kubernetes deployment pipeline.

#### Architecture
 GraphQL API on NestJS micro-services; Next.js SSR front end; MongoDB database; WebRTC for calls; Elasticsearch + Python ML models for recommendations; Redis Streams for notifications.

#### Key contributions & impact

- Enabled posts with text, image, video, audio; likes/dislikes, follow, comments, user blocking and appointment booking.

- Implemented 1-to-1 & group messaging plus voice/video calls; latency kept < 250 ms round-trip on average.

- Deployed collaborative- & content-based recommender that improved feed relevancy and increased time-on-platform.



# Technical Skills
## Languages & Paradigms
Python (primary) – 5 + yrs

- Heavy use in FastAPI micro-services, Flask utilities, ML prototyping

- Idiomatic async/await, typing (pydantic, typing, mypy)

TypeScript / JavaScript – 4 yrs

- Production NestJS and React/Next.js codebases, strict mode, ESLint + Prettier

Go – 2 yrs

- Lightweight gRPC services and CLI tools; concurrency patterns (goroutine, channel)

 SQL (PostgreSQL dialect) – 5 yrs: complex joins, CTEs, window functions, JSONB

NoSQL query languages – MongoDB aggregation pipelines, Redis commands

Shell scripting – Bash/Zsh for CI, deployment, and maintenance tasks

Back-End Frameworks & Libraries
FastAPI (Python) – high-performance REST APIs with Pydantic models, dependency-injection, background tasks

NestJS (TypeScript) – opinionated GraphQL & REST services, CQRS pattern, modular architecture

Flask / Flask-RESTX – lightweight utilities and internal tools

Django (occasional) – rapid admin prototypes

Express.js – legacy monolith migrations to micro-services

gRPC – protobuf contract design, bidirectional streaming in Go & Python

Datastores & Caching
PostgreSQL – primary transactional store; schema design, indexing strategy, partitioning, logical replication

MongoDB – document models for high-velocity content feeds (Honest Elite, Member Lounge)

Redis – caching, distributed locks, Redis Streams for event backbones

MySQL – maintenance of legacy schemas; migration to PostgreSQL

pgvector – similarity search for RAG & recommendation workloads

Messaging & Streaming
Apache Kafka – event sourcing, exactly-once semantics, ksqlDB queries

RabbitMQ – task queues, delayed-message plug-in for reminders

Redis Streams – lightweight pub-sub + persistence inside LambdaX & Honest Elite

Socket.io / WebSockets – real-time dashboards, chat, activity feeds

DevOps & Cloud Native
Docker – multi-stage builds, scratch images (< 50 MB), Docker-Compose for local dev

Kubernetes – helm charts, rolling & canary deployments, HPA, network-policies

AWS – EC2, S3, Route 53, ECR; basic IAM & cost-monitoring

GitHub Actions – build-test-deploy pipelines, matrix testing (Python/Node), secret scanning

NGINX / Traefik – reverse-proxy, rate-limit, mutual-TLS termination

Linux VPS (Ubuntu, AlmaLinux) – hardening with UFW, Fail2Ban, automated backups

Authentication & Security
Keycloak – SSO, realm & client config, custom SPI for JWT claims

OAuth 2.0 / OIDC – password, client-credential, PKCE flows

JSON Web Tokens – stateless auth, token rotation, refresh logic

MFA implementations – email OTP, TOTP apps, trusted-device cookies

Secure coding practices – OWASP Top 10 reviews, automated SCA (Dependabot, Snyk)

Observability & Reliability
Prometheus + Alertmanager – custom metrics, SLA dashboards, PagerDuty hooks

Elasticsearch / Kibana – structured logs (Loguru, Winston), trace correlation IDs

Jaeger / OpenTelemetry – distributed tracing proofs-of-concept

Chaos & load testing – Locust, k6, Gremlin (simulated node failures)

AI, Data & Search
LangChain / LangGraph – retrieval-augmented generation pipelines

Pydantic-AI – schema-driven prompt building and validation

Python ML stack – scikit-learn, pandas, NumPy for recommendation prototypes

Elasticsearch (BM25, k-NN) – content & user recommendations (Honest Elite)

Front-End & Mobile (supporting)
React / Next.js – SSR/ISR pages, hooks API, SWR data fetching

Flutter – basic cross-platform app prototypes

Tailwind CSS – utility-first styling for rapid UI iterations


# Education
Degree: Bachelor of Science in Mechanical Engineering

Institution: Rajshahi University of Engineering & Technology (RUET) – Rajshahi, Bangladesh

Duration: January 2016 – January 2022

Key academic highlights

Coursework touching Thermodynamics, Fluid Mechanics, CAD/CAM, Control Systems, Materials Science, Industrial Automation

Capstone design project: “Low-Cost Autonomous Line-Follower Robot for Warehouse Logistics” — integrated Arduino-based PID control, ultrasonic obstacle avoidance, Iot and AI  based Smart agreculute, Iot Based smart electric meter and solar grid system,  IoT based semi autonomous vehicl; placed among 1st runner up in RUET TechFest 2019


# Extra-Curricular Activities 
### Robotic Society of RUET (RSR) — Technical Secretary | Nov 2019 – May 2021

- Coordinated robotics workshop for Arduino, line follower robots


Team Scrapper (RUET Robotics Team) — Software Team Lead | Jan 2018 – Jan 2019
- Developed mars compatible rover and perticipated in Indian rover challenge in Jan 2019



# Languages

- Bangla - 	Native / Bilingual	
- English	- Full Professional 
- Hindi	- Limited Working 










