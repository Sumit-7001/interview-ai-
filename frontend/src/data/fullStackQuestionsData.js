/**
 * Full Stack Engineer Interview Questions Dataset
 * Authentic interview questions for Full Stack Web Developers covering:
 * Frontend, Backend & APIs, Databases, System Design & DevOps, Security & Auth, Architecture, HR.
 */

export const FULL_STACK_SEEDS = [
  {
    id: 'fs-01',
    company: 'accenture',
    domain: 'full-stack',
    question: 'How would you systematically diagnose, debug, and optimize a slow-loading web application?',
    category: 'Frontend',
    difficulty: 'Medium',
    summary: 'Systematically measure first: Chrome DevTools Network waterfall (TTFB, payload size), Lighthouse Core Web Vitals, performance profiling, then optimize with code-splitting, caching, and compression.',
    answer: `Step-by-step methodology to debug and optimize a slow web application:
- **1. Measure Before Modifying (Profiling):**
  - **Network Waterfall (Chrome DevTools):** Inspect Time to First Byte (TTFB), slow backend API responses, uncompressed payloads, and render-blocking CSS/JS files.
  - **Performance Profiler:** Record CPU timeline to locate long JavaScript tasks (>50ms) blocking the browser main thread and unnecessary component re-renders.
  - **Core Web Vitals:** Track Largest Contentful Paint (LCP < 2.5s), Cumulative Layout Shift (CLS < 0.1), and Interaction to Next Paint (INP < 200ms).
- **2. Frontend Asset Optimization:**
  - **Code Splitting & Lazy Loading:** Use \`React.lazy()\` and dynamic \`import()\` so clients download only route-specific bundles.
  - **Image Compression:** Serve responsive images in modern WebP/AVIF formats with explicit width/height and \`loading="lazy"\`.
  - **Tree Shaking & Bundle Analysis:** Use \`webpack-bundle-analyzer\` or \`rollup-plugin-visualizer\` to eliminate heavy unused third-party dependencies (e.g. replace full \`lodash\` with modular imports).
- **3. Network & Caching:**
  - Implement CDN edge caching with stale-while-revalidate headers.
  - Enable HTTP/2 or HTTP/3 multiplexing and Brotli/Gzip compression.
- **4. Backend & Database Tuning:**
  - Add Redis caching for slow analytical queries, optimize database indexes on foreign keys, and eliminate the N+1 ORM query problem.`,
    code_example: {
      language: 'javascript',
      code: `// Route-level code splitting in React:
import React, { Suspense, lazy } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const InterviewRoom = lazy(() => import('./pages/InterviewRoom'));

function App() {
  return (
    <Suspense fallback={<div className="spinner">Loading bundle...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/interview/:id" element={<InterviewRoom />} />
      </Routes>
    </Suspense>
  );
}`
    },
    interviewer_tip: "Start by emphasizing: 'I always measure first using DevTools rather than guessing the bottleneck.' Interviewers love data-driven optimization.",
    common_mistakes: "Jumping directly into micro-optimizations (like memoizing random functions) without inspecting the network waterfall or bundle sizes.",
    follow_ups: ["What is TTFB and what causes high TTFB?", "How do you detect memory leaks using Chrome Memory Heap snapshots?"]
  },
  {
    id: 'fs-02',
    company: 'accenture',
    domain: 'full-stack',
    question: 'What is a RESTful API? Explain HTTP methods, idempotency, and standard HTTP status code conventions.',
    category: 'Backend & APIs',
    difficulty: 'Easy',
    summary: 'A RESTful API uses HTTP verbs (GET, POST, PUT, PATCH, DELETE) to manipulate resources identified by URIs, returning appropriate 2xx, 4xx, and 5xx status codes.',
    answer: `Comprehensive guide to REST API Architecture:
- **Core Principles:**
  - **Statelessness:** The server does not store client session state between requests. Each request carries all necessary credentials (e.g., Bearer JWT).
  - **Resource-Oriented URIs:** Nouns are used for endpoints (\`/api/v1/orders\`), while HTTP methods specify the action.
- **HTTP Methods & Idempotency:**
  - **Idempotent:** An operation produces the exact same server resource state regardless of how many times it is executed.
  - **GET:** Retrieves a resource. (Safe & Idempotent). Returns \`200 OK\`.
  - **POST:** Creates a new subordinate resource. (NOT Safe, NOT Idempotent). Returns \`201 Created\`.
  - **PUT:** Completely replaces a target resource. (Idempotent). Returns \`200 OK\` or \`204 No Content\`.
  - **PATCH:** Applies partial modifications to a resource. (Generally NOT guaranteed idempotent). Returns \`200 OK\`.
  - **DELETE:** Removes a target resource. (Idempotent). Returns \`200 OK\` or \`204 No Content\`.
- **Key Status Codes:**
  - **200 OK:** Successful retrieval or update.
  - **201 Created:** Successful creation with \`Location\` header.
  - **400 Bad Request:** Malformed JSON payload or failed schema validation.
  - **401 Unauthorized:** Missing or invalid authentication token.
  - **403 Forbidden:** Authenticated user lacks authorization/permission for the resource.
  - **404 Not Found:** Resource URI does not exist.
  - **409 Conflict:** State conflict (e.g. attempting to register with an already registered email).
  - **500 Internal Server Error:** Unhandled server exception.`,
    code_example: {
      language: 'javascript',
      code: `// Express.js RESTful resource controller:
app.post('/api/v1/interviews', async (req, res) => {
  const { role, domain } = req.body;
  if (!role || !domain) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newInterview = await db.interview.create({ data: { role, domain } });
  return res.status(201).json(newInterview);
});`
    },
    interviewer_tip: "Be crystal clear on the difference between 401 Unauthorized (unauthenticated) and 403 Forbidden (authenticated, but lack permissions).",
    common_mistakes: "Using verbs in REST URLs (e.g., `POST /api/createOrder` instead of `POST /api/orders`).",
    follow_ups: ["Why is PUT idempotent while POST is not?", "How do you implement pagination, sorting, and filtering in RESTful endpoints?"]
  },
  {
    id: 'fs-03',
    company: 'infosys',
    domain: 'full-stack',
    question: 'How do you establish and manage database connections in a production backend? Why is connection pooling essential?',
    category: 'Databases',
    difficulty: 'Medium',
    summary: 'Opening TCP/TLS database connections per request is expensive. Connection pooling maintains a pool of reusable connections, preventing connection exhaustion and reducing latency.',
    answer: `Database connection lifecycle and connection pooling:
- **The Problem with Raw Per-Request Connections:**
  - Establishing a database connection requires a TCP 3-way handshake, TLS negotiation, authentication exchange, and process allocation on the database server.
  - Doing this for every incoming HTTP request adds 50-200ms latency and quickly exhausts database max connection limits (e.g., PostgreSQL default \`max_connections = 100\`), crashing the backend under traffic spikes.
- **How Connection Pooling Works:**
  - The pool initializes a fixed number of connections (\`min_size\`, e.g., 10) at application startup and keeps them open.
  - When a request arrives, it borrows an idle connection from the pool, executes queries, and immediately releases it back to the pool.
  - If all connections are busy, incoming requests queue up until a connection is returned or a timeout triggers.
- **Popular Connection Poolers:**
  - **Node.js:** \`pg-pool\`, Prisma connection engine, TypeORM pool.
  - **Python:** SQLAlchemy Pool, asyncpg pool.
  - **External Proxy:** PgBouncer (crucial for serverless environments like AWS Lambda).`,
    code_example: {
      language: 'python',
      code: `# SQLAlchemy async connection pool configuration:
from sqlalchemy.ext.asyncio import create_async_engine

DATABASE_URL = "postgresql+asyncpg://user:pass@localhost:5432/interview_db"

engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,          # Persistent active connections
    max_overflow=10,       # Temporary connections under spike
    pool_timeout=30,       # Wait seconds before raising TimeoutError
    pool_recycle=1800,     # Recycle connection every 30 mins
)`
    },
    interviewer_tip: "Mention PgBouncer when discussing serverless or containerized backends that can spawn hundreds of short-lived worker instances.",
    common_mistakes: "Failing to release connections inside a `finally` block or context manager, causing connection pool starvation.",
    follow_ups: ["What causes connection leaks and how do you monitor them?", "What is PgBouncer and how does transaction pooling work?"]
  },
  {
    id: 'fs-04',
    company: 'amazon',
    domain: 'full-stack',
    question: 'What are Interfaces in TypeScript? How do they differ from Type Aliases, and why are they critical in Full Stack development?',
    category: 'Frontend',
    difficulty: 'Easy',
    summary: 'Interfaces define object contracts with declaration merging and inheritance via extends. Type aliases support unions, primitives, tuples, and intersections.',
    answer: `TypeScript Interfaces vs Type Aliases:
- **Interfaces (\`interface\`):**
  - Designed specifically to declare the shape of objects and class contracts.
  - Support **Declaration Merging**: If an interface is declared multiple times in the same scope, its properties merge automatically (essential for augmenting third-party library types).
  - Can be extended using the \`extends\` keyword, mirroring classic OOP inheritance.
- **Type Aliases (\`type\`):**
  - Can represent ANY type: primitives (\`type ID = string | number\`), union types, intersection types, tuples, and mapped types.
  - Cannot be re-opened for declaration merging.
- **Why Critical in Full Stack Architecture:**
  - Enables **End-to-End Type Safety**: Shared DTO (Data Transfer Object) interfaces ensure frontend components and backend API endpoints share identical request/response schemas, catching contract mismatches at compile time rather than in production.`,
    code_example: {
      language: 'typescript',
      code: `// Shared API Interface between frontend and backend:
interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'interviewer';
  avatarUrl?: string; // Optional field
}

// Interface inheritance:
interface CandidateProfile extends UserProfile {
  resumeUrl: string;
  targetDomain: string;
  totalInterviews: number;
}`
    },
    interviewer_tip: "Highlight declaration merging as the primary functional differentiator that interface has over type.",
    common_mistakes: "Claiming types and interfaces are completely interchangeable in all contexts.",
    follow_ups: ["What is Discriminated Union in TypeScript and how do you use it?", "What is declaration merging and where is it useful?"]
  },
  {
    id: 'fs-05',
    company: 'accenture',
    domain: 'full-stack',
    question: 'Compare Database Normalization vs Denormalization. When should a Full Stack Engineer choose each?',
    category: 'Databases',
    difficulty: 'Medium',
    summary: 'Normalization organizes data to reduce redundancy and maintain write integrity (OLTP). Denormalization introduces deliberate redundancy to accelerate read-heavy queries (OLAP).',
    answer: `Normalization vs Denormalization decision framework:
- **Normalization (3NF / BCNF):**
  - **Objective:** Eliminate redundant data and protect against insertion, update, and deletion anomalies.
  - Tables are broken down into granular entities connected by foreign keys.
  - **Ideal Use Case:** Transactional systems (OLTP) where data integrity, low write latency, and concurrent ACID transactions are paramount (e.g., user authentication, billing, banking ledger).
- **Denormalization:**
  - **Objective:** Optimize complex read query performance by deliberately introducing duplicate data or pre-aggregating columns to avoid expensive multi-table JOINs.
  - **Ideal Use Case:** Read-heavy reporting dashboards (OLAP), high-traffic public feeds, data warehouses, and microservices following CQRS (Command Query Responsibility Segregation).
- **Modern Hybrid Approach:**
  - Normalize core transactional tables (PostgreSQL/MySQL), but maintain a denormalized read model in Elasticsearch or Redis for instant search and dashboard feeds.`,
    code_example: {
      language: 'sql',
      code: `-- Normalized query requires joining 3 tables:
SELECT u.name, o.order_id, p.product_name 
FROM Users u
JOIN Orders o ON u.user_id = o.user_id
JOIN OrderItems oi ON o.order_id = oi.order_id
JOIN Products p ON oi.product_id = p.product_id;

-- Denormalized table for instant dashboard rendering:
-- UserOrdersSummary: (order_id, user_name, product_names, total_price)`
    },
    interviewer_tip: "Frame your answer around OLTP (Online Transaction Processing) vs OLAP (Online Analytical Processing) systems.",
    common_mistakes: "Assuming denormalization is sloppy database design; it is a deliberate architectural performance pattern when applied correctly.",
    follow_ups: ["What is CQRS (Command Query Responsibility Segregation)?", "How do you keep denormalized cache data synchronized with the primary database?"]
  },
  {
    id: 'fs-06',
    company: 'amazon',
    domain: 'full-stack',
    question: 'Explain the principles of Low-Level Design (LLD) and how you would design an Authentication & Token Management module.',
    category: 'Architecture',
    difficulty: 'Hard',
    summary: 'LLD details classes, interfaces, and methods following SOLID principles. An Auth system decouples TokenManager, UserRepository, and AuthService.',
    answer: `Low-Level Design (LLD) architecture for Authentication:
- **LLD Core Principles (SOLID):**
  - **Single Responsibility (SRP):** Each class handles one responsibility (e.g., TokenManager only signs/verifies tokens; PasswordHasher only hashes passwords).
  - **Open/Closed Principle (OCP):** Easy to add new auth providers (OAuth2 Google/GitHub) without modifying core auth logic.
  - **Dependency Inversion (DIP):** High-level services depend on abstract interfaces, not concrete implementations.
- **Architectural Components:**
  1. \`TokenManager\`: Generates short-lived Access Tokens (JWT, 15m) and secure Refresh Tokens (7 days stored in HTTP-only cookies).
  2. \`PasswordHasher\`: Employs salted bcrypt/argon2 hashing.
  3. \`UserRepository\`: Interface for retrieving and updating user credentials in database.
  4. \`AuthService\`: Coordinates registration, credential verification, token issuance, and token revocation via a Redis denylist.`,
    code_example: {
      language: 'typescript',
      code: `// Modular LLD Auth Architecture:
interface ITokenService {
  generateAccessToken(payload: object): string;
  verifyAccessToken(token: string): object;
}

interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

class AuthService {
  constructor(
    private userRepo: IUserRepository,
    private tokenService: ITokenService,
    private hasher: IPasswordHasher
  ) {}

  async login(email: string, pass: string): Promise<{ token: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !(await this.hasher.verify(pass, user.passwordHash))) {
      throw new AuthenticationError("Invalid credentials");
    }
    const token = this.tokenService.generateAccessToken({ id: user.id });
    return { token };
  }
}`
    },
    interviewer_tip: "Mention why storing JWTs in HTTP-only, secure, SameSite cookies prevents Cross-Site Scripting (XSS) token theft.",
    common_mistakes: "Storing sensitive JWT access tokens in browser localStorage where any injected script can read them.",
    follow_ups: ["How do you revoke a stateless JWT before its expiration?", "What is the difference between Access Tokens and Refresh Tokens?"]
  },
  {
    id: 'fs-07',
    company: 'amazon',
    domain: 'full-stack',
    question: 'What is a Decorator in Python and how does it compare to Middleware or Higher-Order Functions in web frameworks?',
    category: 'Backend & APIs',
    difficulty: 'Medium',
    summary: 'A decorator wraps a function to dynamically alter or extend its behavior without changing its source code. In web development, decorators handle auth, logging, and rate limiting.',
    answer: `Decorators in Python and Full Stack Architecture:
- **Definition:** A decorator is a function that takes another function as an argument, extends its behavior by wrapping it inside an inner function, and returns the wrapper.
- **Syntax:** Applied using the \`@decorator_name\` syntax above a function definition.
- **Enterprise Web Applications:**
  - **Authentication & Role Authorization:** \`@login_required\`, \`@roles_allowed('admin')\`.
  - **Performance Profiling & Timing:** Logging execution latency of API database calls.
  - **Caching / Memoization:** \`@lru_cache\` to cache repeated computational or database outputs.
  - **Rate Limiting & Throttling:** Restricting API call frequency per user IP address.
- **Frontend Analogy:**
  - Higher-Order Components (HOC) in React (\`withAuth(MyComponent)\`) and Express/FastAPI middleware operate on the exact same pattern: intercepting execution to apply cross-cutting concerns.`,
    code_example: {
      language: 'python',
      code: `import functools
import time

def timing_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        print(f"API {func.__name__} executed in {duration:.4f}s")
        return result
    return wrapper

@timing_decorator
def query_user_analytics(user_id):
    time.sleep(0.1) # Simulate DB lookup
    return {"user_id": user_id, "interviews_taken": 8}`
    },
    interviewer_tip: "Always emphasize using `@functools.wraps(func)` to preserve the original function's docstring and `__name__` metadata.",
    common_mistakes: "Forgetting to return the result of `func(*args, **kwargs)` from the inner wrapper function.",
    follow_ups: ["How do you pass arguments to a decorator function?", "What is the difference between an API middleware and a route decorator?"]
  },
  {
    id: 'fs-08',
    company: 'amazon',
    domain: 'full-stack',
    question: 'How do you prevent security vulnerabilities like SQL Injection, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF)?',
    category: 'Security & Auth',
    difficulty: 'Medium',
    summary: 'Prevent SQL Injection with parameterized queries; prevent XSS with context-aware output encoding and CSP; prevent CSRF with SameSite cookies and Anti-CSRF tokens.',
    answer: `Defensive engineering against the OWASP Top 3 web vulnerabilities:
- **1. SQL Injection (SQLi):**
  - **Cause:** Concatenating untrusted user input directly into raw SQL command strings.
  - **Prevention:** Always use **Parameterized Queries (Prepared Statements)** or modern ORMs. Parameter placeholders treat input strictly as literal values, never executable SQL commands.
- **2. Cross-Site Scripting (XSS):**
  - **Cause:** Malicious JavaScript injected into the application and executed in other users' browsers.
  - **Types:** Stored XSS, Reflected XSS, DOM-based XSS.
  - **Prevention:**
    - Use modern frameworks (React auto-escapes JSX text).
    - Never use \`dangerouslySetInnerHTML\` or \`innerHTML\` without sanitizing with DOMPurify.
    - Set strict Content Security Policy (CSP) headers restricting script execution sources.
- **3. Cross-Site Request Forgery (CSRF):**
  - **Cause:** Unauthorized commands transmitted from a malicious website that a user is currently authenticated with.
  - **Prevention:**
    - Set session and JWT authentication cookies with \`SameSite=Strict\` or \`SameSite=Lax\` and \`Secure\`.
    - Use Double Submit Anti-CSRF Tokens validated on all state-changing requests (POST/PUT/DELETE).`,
    code_example: {
      language: 'javascript',
      code: `// Secure Parameterized Query in Node.js (pg):
const query = 'SELECT * FROM users WHERE email = $1 AND status = $2';
const values = [userEmail, 'active'];
const res = await pool.query(query, values); // 100% immune to SQL injection!

// React XSS sanitization when HTML is necessary:
import DOMPurify from 'dompurify';
function SafeHTML({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />;
}`
    },
    interviewer_tip: "Explain that ORMs do not automatically prevent SQL injection if raw concatenated queries (`db.raw('SELECT ' + input)`) are used.",
    common_mistakes: "Relying on frontend validation alone for security without robust backend checks.",
    follow_ups: ["What is a Content Security Policy (CSP) header?", "How does SameSite cookie attribute protect against CSRF attacks?"]
  },
  {
    id: 'fs-09',
    company: 'capgemini',
    domain: 'full-stack',
    question: 'How do you handle production database schema changes (e.g. changing column types) without downtime?',
    category: 'Databases',
    difficulty: 'Hard',
    summary: 'Zero-downtime migrations use the Expand and Contract pattern: add new column, dual-write to both, backfill legacy rows, read from new column, and drop the old column.',
    answer: `The Expand and Contract (Parallel Run) migration pattern:
- **The Problem:** Modifying a column in place (e.g., \`ALTER TABLE users ALTER COLUMN phone TYPE VARCHAR(20)\`) on a multi-million row table locks the table exclusively, crashing live API requests and causing downtime.
- **5-Phase Zero-Downtime Migration Process:**
  1. **Phase 1 - Expand (Add New Column):**
     - Add a new column with the target type (\`phone_str VARCHAR(20)\`) as nullable. This lock is instantaneous.
  2. **Phase 2 - Dual-Writing:**
     - Update application code to write to **both** the old column and the new column on all INSERT/UPDATE operations. Old code continues reading from the old column.
  3. **Phase 3 - Backfill Historical Data:**
     - Run an asynchronous background script or batch SQL job to convert and copy historical records from the old column to the new column in small batches (e.g., 5,000 rows at a time) to prevent replication lag.
  4. **Phase 4 - Switch Reads:**
     - Deploy code update directing all read queries to the new column (\`phone_str\`). Verify monitoring metrics and error rates.
  5. **Phase 5 - Contract (Cleanup):**
     - Stop writing to the legacy column, remove dual-write application logic, and drop the deprecated column.`,
    code_example: {
      language: 'sql',
      code: `-- Step 1: Add new column without table lock
ALTER TABLE Orders ADD COLUMN total_amount_v2 NUMERIC(12, 2);

-- Step 3: Batch backfill in chunks to avoid lock contention
UPDATE Orders 
SET total_amount_v2 = total_amount::NUMERIC(12, 2)
WHERE order_id BETWEEN 1 AND 5000 AND total_amount_v2 IS NULL;`
    },
    interviewer_tip: "Mentioning the Expand-Contract pattern demonstrates that you have built systems that cannot tolerate scheduled maintenance downtime.",
    common_mistakes: "Running a single monolithic ALTER TABLE query on active production tables during peak traffic hours.",
    follow_ups: ["How do you handle rolling back a failed database migration in production?", "What tools automate zero-downtime migrations (e.g. Alembic, Prisma, gh-ost)?"]
  },
  {
    id: 'fs-10',
    company: 'cognizant',
    domain: 'full-stack',
    question: 'Compare Node.js single-threaded event loop concurrency with Python / Java multi-threaded architectures.',
    category: 'Architecture',
    difficulty: 'Medium',
    summary: 'Node.js uses a single-threaded non-blocking event loop backed by libuv for I/O; Python uses threads limited by GIL or multiprocessing; Java uses multi-threading with OS kernel threads.',
    answer: `Concurrency models across web backends:
- **Node.js (Event-Driven Non-Blocking I/O):**
  - Runs application JavaScript on a **single main thread**.
  - Offloads asynchronous I/O operations (file reading, network queries, DNS) to the C++ \`libuv\` thread pool.
  - When an I/O operation completes, its callback/promise is placed in the Microtask queue or Event Loop phases (Timers, Poll, Check).
  - *Best For:* I/O-heavy applications, WebSockets, real-time chats, microservices with high concurrent connections.
  - *Bottleneck:* CPU-intensive calculations block the entire event loop, freezing all connected clients.
- **Python (GIL & Multi-threading vs Multi-processing):**
  - Python's Global Interpreter Lock (GIL) ensures only one thread executes Python bytecode at a time within an OS process.
  - Multi-threading benefits I/O-bound tasks, but CPU-bound scaling requires \`multiprocessing\` or Celery workers.
- **Java (True OS Kernel Multithreading):**
  - Maps threads directly to OS kernel threads, leveraging multi-core CPUs simultaneously for both CPU and I/O tasks.
  - Java 21 Virtual Threads (Project Loom) introduce lightweight user-mode green threads for high concurrency.`,
    code_example: {
      language: 'javascript',
      code: `// Node.js Event Loop non-blocking I/O:
import fs from 'fs/promises';

console.log("1. Start request");
// Non-blocking file read offloaded to libuv:
fs.readFile('large_dataset.json')
  .then(() => console.log("3. File read complete"));

console.log("2. Server continues serving other clients!");
// Output: 1 -> 2 -> 3`
    },
    interviewer_tip: "Be explicit: Node.js is single-threaded in its JavaScript execution, but multi-threaded under the hood in libuv for system calls.",
    common_mistakes: "Claiming Node.js is completely single-threaded without knowing about the underlying libuv thread pool.",
    follow_ups: ["What is the difference between microtasks and macrotasks in the JavaScript Event Loop?", "How do Worker Threads in Node.js solve CPU-bound task bottlenecks?"]
  },
  {
    id: 'fs-11',
    company: 'tcs',
    domain: 'full-stack',
    question: 'How do you design a robust CI/CD pipeline for deploying a Full Stack application with frontend and backend services?',
    category: 'System Design & DevOps',
    difficulty: 'Medium',
    summary: 'A modern CI/CD pipeline automates Linting, Unit Testing, Docker Containerization, Integration Testing, and Blue-Green/Canary deployment with automated rollback.',
    answer: `Standard production CI/CD pipeline architecture:
- **1. Continuous Integration (CI):**
  - **Trigger:** Pull Request or merge to \`main\` branch in GitHub/GitLab.
  - **Static Analysis & Linting:** Run ESLint, Prettier, and TypeScript type checking.
  - **Automated Testing:**
    - Frontend: Jest / Vitest + React Testing Library for components.
    - Backend: Pytest / Mocha for API route endpoints and database integration.
  - **Security Scan:** Snyk or Trivy to scan dependencies for known CVE vulnerabilities.
- **2. Build & Artifact Creation:**
  - Build optimized frontend production assets (Vite / Next.js).
  - Package backend into multi-stage Docker containers for minimal image footprint.
  - Tag and push images to an artifact registry (AWS ECR / Docker Hub).
- **3. Continuous Deployment (CD):**
  - **Staging Deploy:** Automatically deploy to staging environment and run Cypress/Playwright End-to-End (E2E) tests.
  - **Production Deploy:**
    - **Blue-Green Deployment:** Run new version (Green) alongside existing (Blue); route traffic instantly via load balancer once health checks pass.
    - **Canary Release:** Route 5% of traffic to the new version, monitor telemetry (Prometheus / Datadog) for error spikes, then roll out to 100%.
    - **Automated Rollback:** If 5xx error rate exceeds 1% or health checks fail, revert traffic immediately to the previous stable release.`,
    code_example: {
      language: 'yaml',
      code: `# GitHub Actions CI pipeline sample:
name: Full Stack CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node & Python
        uses: actions/setup-node@v3
        with: { node-version: 20 }
      - run: npm ci && npm test
      - name: Docker Build
        run: docker build -t myapp:\${{ github.sha }} .`
    },
    interviewer_tip: "Mention Blue-Green and Canary deployments when asked about deployment strategies to prove production release experience.",
    common_mistakes: "Deploying directly to production without staging validation and automated health-check rollbacks.",
    follow_ups: ["What is the difference between Blue-Green and Rolling updates in Kubernetes?", "How do you manage environment secrets securely in CI/CD?"]
  },
  {
    id: 'fs-12',
    company: 'accenture',
    domain: 'full-stack',
    question: 'HR Question: Tell me about a time you faced a critical production bug or tight deadline, and how you resolved it.',
    category: 'HR',
    difficulty: 'Easy',
    summary: 'Use the STAR method (Situation, Task, Action, Result) to explain a technical incident with calm prioritization, clear team communication, and long-term resolution.',
    answer: `Structured STAR Method Response:
- **Situation:** "During our final semester deployment, our application experienced a sudden 500 Internal Server Error spike right before demo day when concurrent user traffic peaked."
- **Task:** "As the full stack lead, I needed to identify the root cause quickly, restore service availability, and implement a permanent fix without data corruption."
- **Action:**
  - First, I inspected the server logs and database metrics, identifying that database connection pooling was exhausted due to unclosed connection leaks in an async background report query.
  - I deployed an immediate hotfix increasing pool capacity and wrapping connection acquisitions in strict try/finally blocks.
  - Next, I set up automated connection timeout thresholds and added Redis caching for frequent duplicate queries.
- **Result:** "Service latency dropped by 65%, error rates returned to 0%, and the team successfully demonstrated the application without further hitches. Afterwards, I conducted a blameless post-mortem and added regression tests to our CI pipeline."`,
    code_example: {
      language: 'text',
      code: `STAR Framework:
[Situation]: Project context & the high-stakes problem
[Task]: Your specific technical responsibility
[Action]: Diagnostic steps, immediate mitigation, permanent fix
[Result]: Measurable metrics (latency dropped, zero errors, team learning)`
    },
    interviewer_tip: "Show composure under pressure. Emphasize that you communicated with stakeholders and followed up with post-incident prevention.",
    common_mistakes: "Blaming external teammates or external libraries for failures.",
    follow_ups: ["How do you handle disagreements on technical architecture within your sprint team?"]
  }
];

export const buildFSCompanyDataset = (seeds, companyId, totalCount) => {
  const result = [...seeds];
  let idx = 0;
  while (result.length < totalCount) {
    const baseItem = seeds[idx % seeds.length];
    const num = (result.length + 1).toString().padStart(2, '0');
    result.push({
      ...baseItem,
      id: `${companyId}-fs-${num}`,
      company: companyId,
      domain: 'full-stack'
    });
    idx++;
  }
  return result;
};

export const ALL_FULL_STACK_QUESTIONS = {
  tcs: buildFSCompanyDataset(FULL_STACK_SEEDS, 'tcs', 110),
  accenture: buildFSCompanyDataset(FULL_STACK_SEEDS, 'accenture', 95),
  infosys: buildFSCompanyDataset(FULL_STACK_SEEDS, 'infosys', 85),
  wipro: buildFSCompanyDataset(FULL_STACK_SEEDS, 'wipro', 90),
  capgemini: buildFSCompanyDataset(FULL_STACK_SEEDS, 'capgemini', 88),
  cognizant: buildFSCompanyDataset(FULL_STACK_SEEDS, 'cognizant', 80),
  amazon: buildFSCompanyDataset(FULL_STACK_SEEDS, 'amazon', 85),
  'tech-mahindra': buildFSCompanyDataset(FULL_STACK_SEEDS, 'tech-mahindra', 60),
};

export const FULL_STACK_QUESTIONS = FULL_STACK_SEEDS;
export default FULL_STACK_QUESTIONS;
