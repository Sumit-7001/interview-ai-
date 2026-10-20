/**
 * Domain & Company-based interview questions database for InterviewAI
 * Authentic questions extracted directly from AmbitionBox Data Analyst Interview PDFs:
 *  - TCS (300+ TCS Data Analyst Interview Questions & Answers 2026 | AmbitionBox)
 *  - Accenture (200+ Accenture Data Analyst Interview Questions & Answers 2026 | AmbitionBox)
 *  - Capgemini (10+ Capgemini Associate Data Analyst Interview Questions & Answers 2026 | AmbitionBox)
 *  - Cognizant (100+ Cognizant Data Analyst Interview Questions & Answers 2026 | AmbitionBox)
 *  - Infosys (8 Infosys Data Analyst Interview Questions for Freshers 2026 | AmbitionBox)
 *  - Wipro (20+ Wipro Data Analyst Interview Questions for Freshers 2026 | AmbitionBox)
 */

export const DOMAINS = [
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    subtitle: 'SQL, Excel, Power BI, Statistics, Data Analysis',
    iconType: 'chart',
    accentColor: 'purple',
    categories: ['All', 'SQL & DBMS', 'Python & Pandas', 'Excel', 'Power BI', 'Statistics', 'Data Analysis', 'Case Studies', 'Business Analytics', 'HR'],
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    subtitle: 'Machine Learning, Statistics, Python',
    iconType: 'network',
    accentColor: 'indigo',
    categories: ['All', 'Machine Learning', 'Deep Learning', 'Statistics & Math', 'Python & Data', 'NLP & LLMs', 'Case Studies', 'HR'],
  },
  {
    id: 'swe-general',
    name: 'Software Engineer (General)',
    subtitle: 'DSA, OOPs, DBMS, System Design',
    iconType: 'code',
    accentColor: 'blue',
    categories: ['All', 'Coding & DSA', 'OOPs', 'DBMS & SQL', 'System Design', 'OS & Networks', 'HR'],
  },
  {
    id: 'frontend-react',
    name: 'React / Frontend Developer',
    subtitle: 'React, JavaScript, HTML, CSS, UI/UX',
    iconType: 'react',
    accentColor: 'cyan',
    categories: ['All', 'React Core', 'JavaScript', 'HTML & CSS', 'State Management', 'Web Performance', 'UI/UX', 'HR'],
  },
  {
    id: 'backend-python',
    name: 'Python / Backend Developer',
    subtitle: 'Python, APIs, Databases, Backend Development',
    iconType: 'python',
    accentColor: 'amber',
    categories: ['All', 'Python Core', 'FastAPI & Flask', 'Django', 'Databases & ORM', 'APIs & Microservices', 'Async & Concurrency', 'HR'],
  },
  {
    id: 'full-stack',
    name: 'Full Stack Engineer',
    subtitle: 'Frontend + Backend, Databases, System Design',
    iconType: 'stack',
    accentColor: 'orange',
    categories: ['All', 'Frontend', 'Backend & APIs', 'Databases', 'System Design & DevOps', 'Security & Auth', 'Architecture', 'HR'],
  },
  {
    id: 'ml-engineer',
    name: 'Machine Learning Engineer',
    subtitle: 'ML, Deep Learning, MLOps, Data Engineering',
    iconType: 'brain',
    accentColor: 'purple',
    categories: ['All', 'ML Algorithms', 'Deep Learning & PyTorch', 'MLOps & Pipelines', 'Model Deployment', 'Data Engineering', 'Evaluation & Metrics', 'HR'],
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    subtitle: 'Product Strategy, Analytics, Case Studies',
    iconType: 'lightbulb',
    accentColor: 'yellow',
    categories: ['All', 'Product Strategy', 'Product Design & UX', 'Analytics & Metrics', 'Technical PM', 'Case Studies', 'Execution & Prioritization', 'HR'],
  },
];

export const DATA_ANALYST_COMPANIES = [
  { id: 'tcs', name: 'TCS', sets: '18 Question Sets', count: 125, logoType: 'tcs', pdfUrl: '/pdfs/tcs.pdf', pdfTitle: '300+ TCS Technical & Placement Interview Questions & Answers 2026' },
  { id: 'wipro', name: 'Wipro', sets: '15 Question Sets', count: 98, logoType: 'wipro', pdfUrl: '/pdfs/wipro.pdf', pdfTitle: 'Wipro Elite & Turbo Technical Interview Questions 2026' },
  { id: 'cognizant', name: 'Cognizant', sets: '12 Question Sets', count: 85, logoType: 'cognizant', pdfUrl: '/pdfs/cognizant.pdf', pdfTitle: '100+ Cognizant GenC & Technical Interview Questions 2026' },
  { id: 'capgemini', name: 'Capgemini', sets: '14 Question Sets', count: 92, logoType: 'capgemini', pdfUrl: '/pdfs/capgemini.pdf', pdfTitle: 'Capgemini Technical & Pseudocode Interview Guide 2026' },
  { id: 'infosys', name: 'Infosys', sets: '12 Question Sets', count: 88, logoType: 'infosys', pdfUrl: '/pdfs/infosys.pdf', pdfTitle: 'Infosys DSE & Specialist Technical Interview Guide 2026' },
  { id: 'accenture', name: 'Accenture', sets: '13 Question Sets', count: 90, logoType: 'accenture', pdfUrl: '/pdfs/accenture.pdf', pdfTitle: '200+ Accenture Cognitive & Technical Interview Questions 2026' },
  { id: 'amazon', name: 'Amazon', sets: '10 Question Sets', count: 75, logoType: 'amazon', pdfUrl: '/pdfs/amazon.pdf', pdfTitle: 'Amazon Data Analyst Interview Questions 2026: SQL, Cases & Solutions' },
  { id: 'tech-mahindra', name: 'Tech Mahindra', sets: '8 Question Sets', count: 62, logoType: 'tech-mahindra', pdfUrl: '/pdfs/tech-mahindra.pdf', pdfTitle: '60+ Tech Mahindra Data Analyst Interview Questions & Answers 2026' },
];

export const DEV_COMPANIES = [
  { 
    id: 'tcs', 
    name: 'TCS', 
    sets: '10 Pages', 
    pageCount: 10, 
    logoType: 'tcs', 
    pdfUrl: '/pdfs/TCS_NQT_Interview_Questions.pdf', 
    fileName: 'TCS_NQT_Interview_Questions.pdf', 
    pdfTitle: 'TCS NQT Interview Questions', 
    hasPdf: true 
  },
  { 
    id: 'wipro', 
    name: 'Wipro', 
    sets: '7 Pages', 
    pageCount: 7, 
    logoType: 'wipro', 
    pdfUrl: '/pdfs/WIPRO%20PDF.pdf', 
    fileName: 'WIPRO PDF.pdf', 
    pdfTitle: 'Wipro Interview Questions', 
    hasPdf: true 
  },
  { 
    id: 'cognizant', 
    name: 'Cognizant', 
    sets: '16 Pages', 
    pageCount: 16, 
    logoType: 'cognizant', 
    pdfUrl: '/pdfs/COGNIZANT%20PDF.pdf', 
    fileName: 'COGNIZANT PDF.pdf', 
    pdfTitle: 'Cognizant Interview Questions', 
    hasPdf: true 
  },
  { 
    id: 'capgemini', 
    name: 'Capgemini', 
    sets: '6 Pages', 
    pageCount: 6, 
    logoType: 'capgemini', 
    pdfUrl: '/pdfs/CAPGIMINI%20PDF.pdf', 
    fileName: 'CAPGIMINI PDF.pdf', 
    pdfTitle: 'Capgemini Interview Questions', 
    hasPdf: true 
  },
  { 
    id: 'infosys', 
    name: 'Infosys', 
    sets: '7 Pages', 
    pageCount: 7, 
    logoType: 'infosys', 
    pdfUrl: '/pdfs/INFOSYS%20PDF.pdf', 
    fileName: 'INFOSYS PDF.pdf', 
    pdfTitle: 'Infosys Interview Questions', 
    hasPdf: true 
  },
  { 
    id: 'accenture', 
    name: 'Accenture', 
    sets: '11 Pages', 
    pageCount: 11, 
    logoType: 'accenture', 
    pdfUrl: '/pdfs/ACCENTURE%20PDF.pdf', 
    fileName: 'ACCENTURE PDF.pdf', 
    pdfTitle: 'Accenture Interview Questions', 
    hasPdf: true 
  },
  { 
    id: 'amazon', 
    name: 'Amazon', 
    sets: '10 Pages', 
    pageCount: 10, 
    logoType: 'amazon', 
    pdfUrl: '/pdfs/amazon.pdf', 
    fileName: 'Amazon Data Analyst Interview Questions 2026.pdf', 
    pdfTitle: 'Amazon Data Analyst Interview Questions 2026', 
    hasPdf: true 
  },
  { 
    id: 'tech-mahindra', 
    name: 'Tech Mahindra', 
    sets: '12 Pages', 
    pageCount: 12, 
    logoType: 'tech-mahindra', 
    pdfUrl: '/pdfs/tech-mahindra.pdf', 
    fileName: 'Tech Mahindra Data Analyst Interview Questions 2026.pdf', 
    pdfTitle: '60+ Tech Mahindra Data Analyst Interview Questions 2026', 
    hasPdf: true 
  },
];

export const COMPANIES = DATA_ANALYST_COMPANIES;


// ─────────────────────────────────────────────────────────────────────────────
// 1. TCS AUTHENTIC QUESTIONS (FROM AMBITIONBOX PDF)
// ─────────────────────────────────────────────────────────────────────────────
export const TCS_PDF_QUESTIONS = [
  {
    id: 'tcs-01',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'Can you describe your basic computer skills and analytical toolkit?',
    category: 'Excel',
    difficulty: 'Easy',
    summary: 'Proficient in MS Office Suite (Excel, Word, PowerPoint), data management with SQL, basic programming in Python, and internet research.',
    answer: `Proficient in essential computer skills including MS Office, data management, basic programming, and internet research.
- **Microsoft Office Suite:** Advanced Excel for data analysis (Pivot Tables, VLOOKUP, INDEX/MATCH, nested IF, Power Query), Word for documentation, and PowerPoint for executive client presentations.
- **Data Management & Databases:** SQL for querying relational databases, filtering, aggregations, and data validation.
- **Programming & Scripting:** Basic Python (pandas, numpy) for manipulating tabular datasets and cleaning dirty records.
- **Research & Collaboration:** Skilled in web research, enterprise documentation, and version control.`,
    code_example: {
      language: 'python',
      code: `# Basic data validation in Python:\nimport pandas as pd\ndf = pd.read_excel('sales_data.xlsx')\nprint(df.info())\nprint(df.describe())`
    },
    interviewer_tip: "TCS technical interviewers look for practical familiarity with Excel formulas and structured data querying in SQL.",
    common_mistakes: "Listing software without giving specific examples of how you used them in projects.",
    follow_ups: ["Which Excel formulas do you use most frequently for data cleanup?", "How do you connect Excel to SQL Server?"]
  },
  {
    id: 'tcs-02',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'What is SAP MM and what are its main functions?',
    category: 'Business Analytics',
    difficulty: 'Medium',
    summary: 'SAP Materials Management (MM) is a core module in SAP ERP managing procurement processes, inventory control, and vendor evaluation.',
    answer: `SAP MM stands for **Materials Management**, a foundational module in SAP ERP focused on procurement and inventory management.
- **Core Functions:**
  1. **Procurement Process:** Manages purchase requisitions, quotation requests, purchase orders, and invoice verification.
  2. **Inventory Management:** Handles goods receipt, goods issue, stock transfers, and physical inventory audits.
  3. **Master Data Maintenance:** Stores and manages Material Master and Vendor Master records.
  4. **Integration:** Seamlessly integrates with SAP FI (Finance), CO (Controlling), SD (Sales & Distribution), and PP (Production Planning).`,
    code_example: {
      language: 'text',
      code: `Procurement Lifecycle: Purchase Requisition (PR) -> Purchase Order (PO) -> Goods Receipt (GR) -> Invoice Verification (IR) -> Vendor Payment`
    },
    interviewer_tip: "Highlight how data analysts leverage SAP MM table exports (e.g., EKKO, EKPO, MARA) to analyze procurement spend and lead times.",
    common_mistakes: "Confusing SAP MM with SAP SD (Sales and Distribution).",
    follow_ups: ["What are the key tables in SAP MM?", "How do you extract data from SAP for BI reporting?"]
  },
  {
    id: 'tcs-03',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'What is the difference between a Purchase Requisition and a Purchase Order?',
    category: 'Business Analytics',
    difficulty: 'Easy',
    summary: 'A Purchase Requisition (PR) is an internal document requesting purchase approval, while a Purchase Order (PO) is a legally binding contract sent to an external vendor.',
    answer: `Key differences between PR and PO:
- **Purchase Requisition (PR):**
  - **Type:** Internal document created by employees or department heads.
  - **Purpose:** Requests permission from internal management to purchase goods or services.
  - **Legal Standing:** No legal obligation to external parties.
  - **Recipient:** Internal purchasing department.
- **Purchase Order (PO):**
  - **Type:** External legally binding commercial contract.
  - **Purpose:** Authorizes the vendor to deliver specified items at agreed prices and delivery timelines.
  - **Legal Standing:** Legally enforceable upon vendor acceptance.
  - **Recipient:** External supplier / vendor.`,
    code_example: {
      language: 'sql',
      code: `-- Querying open Purchase Orders without a matching Goods Receipt:\nSELECT po.po_number, po.vendor_id, po.order_date, po.total_amount\nFROM purchase_orders po\nLEFT JOIN goods_receipts gr ON po.po_number = gr.po_number\nWHERE gr.receipt_id IS NULL AND po.status = 'Approved';`
    },
    interviewer_tip: "Frame this in terms of internal enterprise workflow and spend governance.",
    common_mistakes: "Believing that a PR can be sent directly to suppliers.",
    follow_ups: ["Can multiple Purchase Requisitions be combined into a single Purchase Order?"]
  },
  {
    id: 'tcs-04',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'What is the difference between a Purchase Order (PO) and a Goods Receipt (GR)?',
    category: 'Business Analytics',
    difficulty: 'Easy',
    summary: 'A Purchase Order orders items from a supplier; a Goods Receipt confirms physical delivery and updates warehouse inventory levels.',
    answer: `Comparison between PO and Goods Receipt (GR):
- **Purchase Order (PO):**
  - Issued **before** delivery by buyer to supplier specifying quantity, specifications, and negotiated price.
  - Establishes expected liabilities and commitments.
- **Goods Receipt (GR):**
  - Generated **after** physical delivery at warehouse/receiving dock.
  - Confirms actual quantity received, condition of goods, and date.
  - Triggers accounting entry: Debit Inventory, Credit GR/IR Clearing Account.
- **3-Way Matching:** Crucial audit control comparing PO, GR, and Supplier Invoice before payment is released.`,
    code_example: {
      language: 'sql',
      code: `-- Three-way matching reconciliation query:\nSELECT po.po_number, po.qty AS po_qty, gr.qty AS received_qty, inv.qty AS invoiced_qty\nFROM PO_Items po\nJOIN GR_Items gr ON po.po_number = gr.po_number\nJOIN Invoice_Items inv ON po.po_number = inv.po_number\nWHERE po.qty <> gr.qty OR gr.qty <> inv.qty;`
    },
    interviewer_tip: "Mention the '3-way matching' concept (PO vs GR vs Invoice). TCS client interviewers love candidates who understand this audit control.",
    common_mistakes: "Thinking a Goods Receipt is an invoice.",
    follow_ups: ["What happens when received goods are damaged or short-shipped?"]
  },
  {
    id: 'tcs-05',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'What is data and what are its main classifications (Structured, Semi-structured, Unstructured)?',
    category: 'Data Analysis',
    difficulty: 'Easy',
    summary: 'Data represents raw facts and observations. It is classified into structured (tables), semi-structured (JSON/XML), and unstructured (audio/video/text).',
    answer: `Data is raw facts, statistics, and observations captured from business transactions, sensors, or systems.
- **Classifications:**
  1. **Structured Data:** Highly organized in rows and columns with fixed schemas (e.g., PostgreSQL, Oracle, MySQL, CSV). Easily queried with SQL.
  2. **Semi-Structured Data:** Does not conform to rigid relational schema but contains tags, markers, or hierarchical keys (e.g., JSON API payloads, XML, NoSQL documents).
  3. **Unstructured Data:** Has no predefined data model (e.g., customer call audio, PDF contracts, emails, social media images). Comprises ~80% of enterprise data.
- **Data Lifecycle:** Collection -> Ingestion -> Cleaning/ETL -> Storage/Warehousing -> Analytics/Reporting -> Machine Learning.`,
    code_example: {
      language: 'python',
      code: `# Working with semi-structured JSON in Python:\nimport json, pandas as pd\njson_data = '[{"id": 1, "customer": "TCS", "metrics": {"nps": 9, "spend": 12000}}]'\ndf = pd.json_normalize(json.loads(json_data))\nprint(df)`
    },
    interviewer_tip: "Always emphasize how raw data is converted into actionable business intelligence through cleaning and context.",
    common_mistakes: "Assuming semi-structured data cannot be queried with SQL (modern SQL engines support JSON functions).",
    follow_ups: ["How does a Data Lake handle unstructured data compared to a Data Warehouse?"]
  },
  {
    id: 'tcs-06',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'What are the roles & responsibilities of a Data Analyst at TCS?',
    category: 'Data Analysis',
    difficulty: 'Medium',
    summary: 'TCS Data Analysts design data models, execute SQL queries, build interactive dashboards, communicate with global stakeholders, and maintain data quality.',
    answer: `Key roles and responsibilities at Tata Consultancy Services (TCS):
1. **Data Modeling & Architecture:** Design conceptual, logical, and physical data models to capture business workflows.
2. **Data Extraction & Transformation (ETL):** Write robust SQL queries and Python scripts to extract data from disparate ERP/CRM sources.
3. **Data Quality & Hygiene:** Detect anomalies, handle missing values, and validate pipeline outputs against source systems.
4. **BI Dashboarding:** Build automated Power BI or Tableau dashboards tracking enterprise KPIs.
5. **Business Stakeholder Collaboration:** Translate complex business requirements into technical metrics and deliver executive presentations.`,
    code_example: {
      language: 'text',
      code: `Daily Deliverables: Ad-hoc SQL Analysis | Sprint Backlog Grooming | Automated ETL Monitoring | Stakeholder KPI Reporting`
    },
    interviewer_tip: "Show that you are comfortable working in Agile sprints and communicating technical findings to non-technical business clients.",
    common_mistakes: "Focusing solely on coding without mentioning business problem solving.",
    follow_ups: ["How do you handle changing client requirements during a data project?"]
  },
  {
    id: 'tcs-07',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'Explain the functions in SQL (Aggregate vs Scalar) and explain OOPS concepts.',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'SQL functions include Aggregate (operate on multiple rows returning one summary) and Scalar (operate on single values). OOP includes Encapsulation, Inheritance, Polymorphism, Abstraction.',
    answer: `This dual-part question evaluates both database querying and foundational software engineering:
- **SQL Functions:**
  - **Aggregate Functions:** Operate on a collection of rows and return a single summary value (e.g., SUM(), AVG(), COUNT(), MIN(), MAX()). Frequently used with GROUP BY.
  - **Scalar Functions:** Operate on a single input value and return a single modified value (e.g., UPPER(), LOWER(), ROUND(), DATEPART(), COALESCE()).
- **OOPS Concepts:**
  - **Encapsulation:** Wrapping state and behavior in a class while restricting direct external access.
  - **Inheritance:** Deriving child classes from base classes to reuse code.
  - **Polymorphism:** Method overriding and overloading allowing dynamic execution.
  - **Abstraction:** Hiding complex background details and exposing clean interfaces.`,
    code_example: {
      language: 'sql',
      code: `-- Combining Scalar and Aggregate functions:\nSELECT department_id,\n       COUNT(employee_id) AS total_employees,\n       ROUND(AVG(salary), 2) AS rounded_avg_salary,\n       UPPER(MAX(employee_name)) AS top_earner_name\nFROM Employees\nGROUP BY department_id;`
    },
    interviewer_tip: "Give concise definitions and provide immediate SQL code showing both aggregate and scalar functions in one query.",
    common_mistakes: "Attempting to use Aggregate functions in a WHERE clause without HAVING.",
    follow_ups: ["Why can't aggregate functions be used in a WHERE clause?"]
  },
  {
    id: 'tcs-08',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'Difference between Power BI and Tableau: advantages and limitations of both.',
    category: 'Power BI',
    difficulty: 'Medium',
    summary: 'Power BI offers tight Microsoft integration, lower pricing, and strong DAX modeling; Tableau offers superior custom visualization and handles massive datasets.',
    answer: `Comparison between Power BI and Tableau:
- **Power BI:**
  - **Advantages:** Deep integration with Microsoft 365, Teams, and Azure; cost-effective ($10/user/mo Pro license); Power Query ETL engine is very familiar to Excel users; DAX language for advanced modeling.
  - **Limitations:** File size limits on cloud service (1GB/dataset without Premium); less flexible custom chart styling.
- **Tableau:**
  - **Advantages:** Best-in-class interactive visual storytelling; handles very large datasets efficiently; rich community of visual designers (Tableau Public).
  - **Limitations:** Significantly higher licensing costs; steeper learning curve for non-technical business users.`,
    code_example: {
      language: 'text',
      code: `Recommendation Guide:\n- Choose Power BI for: Microsoft enterprise stacks, budget sensitivity, self-service BI.\n- Choose Tableau for: Complex exploratory visual analytics, graphic-intensive executive presentations.`
    },
    interviewer_tip: "Mention that TCS delivers solutions in both tools depending on whether the client operates on an Azure/Microsoft stack or AWS/Salesforce stack.",
    common_mistakes: "Claiming one is objectively 'better' rather than evaluating trade-offs.",
    follow_ups: ["What is DAX in Power BI and how does it compare to Tableau Calculated Fields?"]
  },
  {
    id: 'tcs-09',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'What is Row-Level Security (RLS) in Power BI and how do you implement it?',
    category: 'Power BI',
    difficulty: 'Hard',
    summary: 'Row-Level Security (RLS) restricts data access for specific users based on filter rules defined in Power BI Desktop and mapped in Power BI Service.',
    answer: `Row-Level Security (RLS) restricts data rows that individual users can see when viewing a published report.
- **Implementation Steps:**
  1. **Define Roles in Power BI Desktop:** Navigate to Modeling -> Manage Roles. Create a role (e.g., 'West Region') and write a DAX filter: [Region] = "West".
  2. **Dynamic RLS:** Use dynamic DAX functions: [UserEmail] = USERPRINCIPALNAME() so users only see rows matching their logged-in Azure AD identity.
  3. **Publish to Power BI Service:** Publish the report to the workspace.
  4. **Assign Members in Service:** Go to Dataset Security and assign Azure AD security groups or emails to the defined roles.
  5. **Validate:** Use 'Test as role' in Power BI Service to verify correct data restriction.`,
    code_example: {
      language: 'text',
      code: `-- Dynamic RLS DAX Expression:\n[SalesManagerEmail] = USERPRINCIPALNAME()`
    },
    interviewer_tip: "Distinguish between Static RLS (hardcoded roles) and Dynamic RLS (using USERPRINCIPALNAME). TCS enterprise clients always demand Dynamic RLS.",
    common_mistakes: "Assuming RLS restricts visual elements rather than data rows in the underlying model.",
    follow_ups: ["Does RLS apply to Workspace Admins and Members? (Answer: No, only Viewers)."]
  },
  {
    id: 'tcs-10',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'Explain SQL Constraints and types of Joins (Primary Key, Foreign Key, Inner, Left, Full Outer).',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'Constraints enforce relational data integrity (NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK). Joins merge records from multiple tables based on related keys.',
    answer: `Foundational SQL concepts:
- **Constraints:**
  - **NOT NULL:** Prohibits null values in a column.
  - **UNIQUE:** Ensures all values in a column are distinct.
  - **PRIMARY KEY:** Uniquely identifies each row (combines NOT NULL + UNIQUE).
  - **FOREIGN KEY:** Enforces referential integrity by linking to a primary key in another table.
  - **CHECK:** Validates that values satisfy a specific logical condition (e.g., CHECK (age >= 18)).
- **Joins:**
  - **INNER JOIN:** Returns records with matching values in both tables.
  - **LEFT JOIN:** Returns all records from the left table and matched records from the right table (NULL if no match).
  - **RIGHT JOIN:** Returns all records from right table and matched from left.
  - **FULL OUTER JOIN:** Returns all records when there is a match in either left or right table.`,
    code_example: {
      language: 'sql',
      code: `-- Enforcing Foreign Key and querying with LEFT JOIN:\nSELECT c.customer_name, o.order_id, o.order_total\nFROM Customers c\nLEFT JOIN Orders o ON c.customer_id = o.customer_id\nWHERE o.order_id IS NULL; -- Identifies customers with 0 orders`
    },
    interviewer_tip: "Give a concrete business use case for LEFT JOIN (e.g., finding inactive customers who have never placed an order).",
    common_mistakes: "Confusing WHERE filters with ON join conditions in LEFT JOINs.",
    follow_ups: ["What is a Cross Join and what is its computational complexity?"]
  },
  {
    id: 'tcs-11',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'Write a SQL query to find the 2nd highest salary from an Employee table without using LIMIT or TOP.',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'Find the second highest salary using a correlated subquery, DENSE_RANK() window function, or MAX() with WHERE condition.',
    answer: `Three standard methods to find the 2nd highest salary:
- **Method 1: Subquery with MAX() (Universal SQL):**
SELECT MAX(salary) AS second_highest_salary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);

- **Method 2: Window Function DENSE_RANK() (Handles duplicates cleanly):**
WITH RankedSalaries AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rank_pos
    FROM Employee
)
SELECT salary AS second_highest_salary
FROM RankedSalaries
WHERE rank_pos = 2;

- **Why DENSE_RANK() over RANK():** If two employees tie for highest salary, RANK() skips 2 and assigns 3 to the next salary, whereas DENSE_RANK() correctly assigns rank 2.`,
    code_example: {
      language: 'sql',
      code: `-- Optimal approach using CTE & DENSE_RANK():\nWITH CTE AS (\n    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk\n    FROM Employees\n)\nSELECT MAX(salary) FROM CTE WHERE rnk = 2;`
    },
    interviewer_tip: "Always explain why DENSE_RANK() is preferred over RANK() when salaries contain duplicate entries.",
    common_mistakes: "Using LIMIT 1 OFFSET 1 without handling duplicates, which returns the highest salary twice if there is a tie.",
    follow_ups: ["How would you extend this query to find the N-th highest salary dynamically?"]
  },
  {
    id: 'tcs-12',
    company: 'tcs',
    domain: 'data-analyst',
    question: 'Why do you want to join TCS as a Data Analyst?',
    category: 'HR',
    difficulty: 'Easy',
    summary: 'TCS offers unparalleled global scale, diverse enterprise projects, robust training through TCS iON/Elevate, and high job stability.',
    answer: `Structured HR response:
"I want to join TCS because of its prestigious reputation for technological excellence, strong ethical culture, and global footprint across Fortune 500 enterprise clients. 
As a Data Analyst:
1. **Exposure to Scale:** TCS works with massive data architectures in BFSI, retail, healthcare, and telecommunications, offering unprecedented opportunities to solve high-impact analytical challenges.
2. **Continuous Learning:** TCS's culture of internal reskilling through platforms like TCS iON, Elevate, and Wings ensures continuous career development in cutting-edge BI and AI tools.
3. **Collaboration:** Working alongside domain specialists and experienced data architects provides the ideal environment to grow from a junior analyst into a well-rounded enterprise data consultant."`,
    code_example: {
      language: 'text',
      code: `Key Themes: Global Scale | Enterprise Data Quality | Continuous Upskilling | Tata Ethical Values`
    },
    interviewer_tip: "Mention Tata's values and specific TCS initiatives like Digital Workspace and continuous certification.",
    common_mistakes: "Giving generic answers that could apply to any software firm without mentioning TCS-specific merits.",
    follow_ups: ["Are you comfortable working in client-facing rotational shifts or different geographic locations?"]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. ACCENTURE AUTHENTIC QUESTIONS (FROM AMBITIONBOX PDF)
// ─────────────────────────────────────────────────────────────────────────────
export const ACCENTURE_PDF_QUESTIONS = [
  {
    id: 'acc-01',
    company: 'accenture',
    domain: 'data-analyst',
    question: 'What is object-oriented programming (OOP) and its 4 core pillars?',
    category: 'SQL & DBMS',
    difficulty: 'Easy',
    summary: 'OOP structures software around data-holding objects. The 4 pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction.',
    answer: `OOP stands for **Object-Oriented Programming**, a method to structure software using objects.
- **Objects:** Instances of classes that define attributes (state) and behaviors (methods).
- **Core Principles:**
  1. **Encapsulation:** Bundles data and methods that operate on that data into a single unit, hiding internal state.
  2. **Inheritance:** Enables a new class to inherit properties and methods from an existing class to promote code reusability.
  3. **Polymorphism:** Allows methods to behave differently based on the calling object (Method Overloading & Overriding).
  4. **Abstraction:** Exposes only essential interfaces while hiding internal implementation complexity.`,
    code_example: {
      language: 'python',
      code: `class DataPipeline:\n    def __init__(self, source):\n        self.__source = source  # Encapsulated attribute\n        \n    def execute(self):\n        print(f"Ingesting data from {self.__source}")`
    },
    interviewer_tip: "Accenture technical interviewers evaluate whether you can name all 4 pillars and give a brief real-world example in Python or Java.",
    common_mistakes: "Confusing Abstraction with Encapsulation.",
    follow_ups: ["What is the difference between abstraction and encapsulation?", "How do classes and objects differ in memory?"]
  },
  {
    id: 'acc-02',
    company: 'accenture',
    domain: 'data-analyst',
    question: 'What would you do to ensure fast query execution in SQL databases?',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'Optimize queries by indexing, partitioning, using efficient joins, avoiding wildcards, and inspecting execution plans with EXPLAIN.',
    answer: `Techniques to ensure fast query execution:
1. **Proper Indexing:** Create B-tree indexes on columns frequently filtered in WHERE, JOIN, and ORDER BY clauses.
2. **Avoid SELECT *:** Retrieve only needed columns to reduce network payload and disk I/O.
3. **Partition Large Tables:** Partition massive tables by date or range to prune scans.
4. **Use EXPLAIN / EXPLAIN ANALYZE:** Inspect query execution plans to identify full table scans and nested loop bottlenecks.
5. **Optimize Joins & Subqueries:** Replace correlated subqueries with JOINs or window functions; join smaller filtered datasets.`,
    code_example: {
      language: 'sql',
      code: `-- Analyze query plan to detect table scans:\nEXPLAIN ANALYZE\nSELECT customer_id, SUM(order_total)\nFROM Orders\nWHERE order_date >= '2026-01-01'\nGROUP BY customer_id;`
    },
    interviewer_tip: "State both schema-level solutions (indexes, partitioning) and query-writing practices (avoiding wildcards, early filtering).",
    common_mistakes: "Over-indexing tables, which severely slows down INSERT, UPDATE, and DELETE operations.",
    follow_ups: ["What is the difference between a clustered and non-clustered index?"]
  },
  {
    id: 'acc-03',
    company: 'accenture',
    domain: 'data-analyst',
    question: 'What is Database Normalization and explain 1NF, 2NF, and 3NF?',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'Normalization organizes relational tables to eliminate redundancy and prevent update/insert/delete anomalies.',
    answer: `Normalization organizes database schemas to reduce data redundancy and maintain data integrity:
- **1NF (First Normal Form):** Every column must contain atomic (indivisible) values, and each record must be unique.
- **2NF (Second Normal Form):** Must be in 1NF and have NO partial dependencies (all non-key attributes must be fully functionally dependent on the entire primary key).
- **3NF (Third Normal Form):** Must be in 2NF and have NO transitive dependencies (non-key columns cannot depend on other non-key columns).
- **Trade-off:** Normalization speeds up writes and saves storage; Denormalization (star schema) is preferred in data warehouses to speed up reads and reporting.`,
    code_example: {
      language: 'text',
      code: `1NF: Atomic values only (no comma-separated lists)\n2NF: Remove partial dependencies on composite keys\n3NF: Non-key attributes depend on ONLY the primary key`
    },
    interviewer_tip: "Emphasize why OLTP transactional systems use 3NF while OLAP data warehouses use denormalized star/snowflake schemas.",
    common_mistakes: "Thinking that higher normal forms (like BCNF) are always superior in analytical reporting.",
    follow_ups: ["What are insert, update, and delete anomalies?"]
  },
  {
    id: 'acc-04',
    company: 'accenture',
    domain: 'data-analyst',
    question: 'What are the differences between Tableau, Power BI, and MS Excel?',
    category: 'Data Analysis',
    difficulty: 'Medium',
    summary: 'Tableau excels at complex visual analytics, Power BI offers enterprise Microsoft integration and DAX modeling, Excel handles spreadsheet calculation and ad-hoc tables.',
    answer: `Comparison of tools used in Accenture analytics engagements:
- **MS Excel:** Spreadsheet tool ideal for ad-hoc financial modeling, quick pivot tables, and tabular calculations. Limited by 1,048,576 rows per sheet.
- **Power BI:** Enterprise business intelligence tool built for self-service reporting, dashboard sharing, and Microsoft Azure ecosystem integration. Uses DAX and Power Query.
- **Tableau:** Visual storytelling and exploratory data analytics platform. Unmatched in creating bespoke interactive charts, maps, and high-performance visual filters on large datasets.`,
    code_example: {
      language: 'text',
      code: `Data Scale: Excel (1M rows) < Power BI (1GB+ cloud dataset) < Tableau (High volume direct server query)`
    },
    interviewer_tip: "Mention practical scenario examples: use Excel for financial audits, Power BI for departmental KPIs, and Tableau for client executive dashboards.",
    common_mistakes: "Treating Excel as an enterprise database.",
    follow_ups: ["When would you choose Power BI over Tableau for an Accenture client?"]
  },
  {
    id: 'acc-05',
    company: 'accenture',
    domain: 'data-analyst',
    question: 'Define Data Science and its end-to-end lifecycle.',
    category: 'Data Analysis',
    difficulty: 'Easy',
    summary: 'Data Science extracts knowledge from data through scientific methods, statistics, and machine learning algorithms.',
    answer: `Data Science is an interdisciplinary field that combines domain expertise, programming skills, and math/statistics to extract actionable insights from structured and unstructured data.
- **End-to-End Lifecycle:**
  1. **Business Understanding:** Clarify objectives and formulate measurable KPIs.
  2. **Data Acquisition & Extraction:** Connect to APIs, SQL databases, and data lakes.
  3. **Data Cleaning & Preprocessing:** Impute nulls, remove duplicates, handle outliers.
  4. **Exploratory Data Analysis (EDA):** Identify distributions, correlations, and trends.
  5. **Feature Engineering & Modeling:** Select algorithms, train, and validate models.
  6. **Deployment & Monitoring:** Deploy models into production and track performance drift.`,
    code_example: {
      language: 'python',
      code: `# Typical EDA snippet in Python:\nimport pandas as pd\ndf = pd.read_csv('client_churn.csv')\nprint(df.isnull().sum())\nprint(df.corr(numeric_only=True))`
    },
    interviewer_tip: "Highlight that data cleaning and business understanding consume 80% of project time in actual consulting.",
    common_mistakes: "Equating Data Science solely with training deep neural networks.",
    follow_ups: ["What is the difference between a Data Analyst, a Data Scientist, and a Data Engineer?"]
  },
  {
    id: 'acc-06',
    company: 'accenture',
    domain: 'data-analyst',
    question: 'SQL: How do you find duplicate rows in a table using a window function?',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'Use ROW_NUMBER() partitioned by target duplicate columns; rows where rn > 1 represent duplicates.',
    answer: `Finding and deduplicating rows using the ROW_NUMBER() window function:
WITH NumberedRecords AS (
    SELECT 
        customer_id, 
        email, 
        transaction_date,
        ROW_NUMBER() OVER (
            PARTITION BY email, transaction_date 
            ORDER BY customer_id ASC
        ) AS row_num
    FROM Customer_Transactions
)
-- Select duplicates:
SELECT * 
FROM NumberedRecords 
WHERE row_num > 1;

- **Deleting Duplicates:** In SQL Server / PostgreSQL, you can delete directly from the CTE where row_num > 1.`,
    code_example: {
      language: 'sql',
      code: `-- Delete duplicates safely:\nWITH DuplicatesCTE AS (\n    SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) as rn\n    FROM Users\n)\nDELETE FROM DuplicatesCTE WHERE rn > 1;`
    },
    interviewer_tip: "Explain why ROW_NUMBER() is safer than GROUP BY when you need to retain one copy of the duplicate row and delete the rest.",
    common_mistakes: "Using COUNT() without PARTITION BY.",
    follow_ups: ["How does ROW_NUMBER() differ from RANK() and DENSE_RANK()?"]
  },
  {
    id: 'acc-07',
    company: 'accenture',
    domain: 'data-analyst',
    question: 'Python: What is the difference between a List and a Tuple?',
    category: 'Python & Pandas',
    difficulty: 'Easy',
    summary: 'Lists are mutable and slower with bracket syntax []; Tuples are immutable, faster, memory-efficient, and hashable with parentheses ().',
    answer: `Key differences between Python Lists and Tuples:
- **Mutability:** Lists are mutable (elements can be modified, appended, or removed); Tuples are immutable (cannot be altered after creation).
- **Syntax:** Lists use square brackets [1, 2, 3]; Tuples use parentheses (1, 2, 3).
- **Performance & Memory:** Tuples require less memory and execute faster because Python allocates a single fixed block of memory.
- **Dictionary Keys:** Tuples can be used as dictionary keys (because they are hashable); Lists cannot.
- **Use Case:** Use lists for dynamic collections of items; use tuples for fixed data structures (e.g., coordinates, DB row records).`,
    code_example: {
      language: 'python',
      code: `my_list = [1, 2, 3]\nmy_list[0] = 99  # Valid\n\nmy_tuple = (1, 2, 3)\n# my_tuple[0] = 99  # Raises TypeError: 'tuple' object does not support item assignment`
    },
    interviewer_tip: "Mention the term 'hashability' and explain why tuples can be dictionary keys while lists cannot.",
    common_mistakes: "Saying tuples cannot contain mutable objects (a tuple CAN contain a list: ([1, 2], 'a')).",
    follow_ups: ["Can you modify a list that is inside a tuple? (Answer: Yes, the list itself remains mutable)."]
  },
  {
    id: 'acc-08',
    company: 'accenture',
    domain: 'data-analyst',
    question: 'SQL: Explain the difference between JOIN and UNION.',
    category: 'SQL & DBMS',
    difficulty: 'Easy',
    summary: 'JOIN combines columns horizontally from two or more tables based on a related key; UNION combines rows vertically from compatible queries.',
    answer: `Comparison between JOIN and UNION in SQL:
- **JOIN (Horizontal Combination):**
  - Combines columns from different tables based on a related common key.
  - Increases the number of columns in the final result set.
  - Types: INNER, LEFT, RIGHT, FULL OUTER, CROSS JOIN.
- **UNION (Vertical Combination):**
  - Appends rows from two or more SELECT queries into a single result set.
  - Increases the number of rows in the final result set.
  - Rules: Both queries must have the same number of columns with compatible data types.
  - Difference between UNION and UNION ALL: UNION removes duplicate rows (requires sorting overhead); UNION ALL preserves all rows and executes significantly faster.`,
    code_example: {
      language: 'sql',
      code: `-- UNION ALL example combining historical and active records:\nSELECT customer_id, order_total, 'Active' AS status FROM Active_Orders\nUNION ALL\nSELECT customer_id, order_total, 'Archived' AS status FROM Archived_Orders;`
    },
    interviewer_tip: "Always recommend UNION ALL over UNION whenever duplicates do not exist or duplicate retention is acceptable, as it avoids expensive distinct sorting.",
    common_mistakes: "Attempting to UNION two queries with mismatched column counts.",
    follow_ups: ["Does UNION preserve the ordering of the individual SELECT queries?"]
  },
  {
    id: 'acc-09',
    company: 'accenture',
    domain: 'data-analyst',
    question: 'Excel: What is the difference between VLOOKUP and INDEX/MATCH?',
    category: 'Excel',
    difficulty: 'Medium',
    summary: 'VLOOKUP searches left-to-right with fixed column offsets; INDEX/MATCH can look up in any direction, does not break on column inserts, and is faster.',
    answer: `Comparison in Excel data manipulation:
- **VLOOKUP (Vertical Lookup):**
  - Syntax: =VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
  - Limitations: Can only search left-to-right (lookup column must be the first column). Breaks if columns are inserted or deleted in the table.
- **INDEX / MATCH:**
  - Syntax: =INDEX(return_array, MATCH(lookup_value, lookup_array, 0))
  - Advantages:
    1. **Two-Way / Left-Lookups:** Can return values to the left of the lookup column.
    2. **Robustness:** Does not break when columns are added, deleted, or rearranged.
    3. **Performance:** Only references two single-column vectors rather than an entire broad table matrix.
- **Modern Alternative:** In Excel 365, XLOOKUP replaces both with cleaner syntax.`,
    code_example: {
      language: 'text',
      code: `INDEX/MATCH Formula:\n=INDEX(D2:D500, MATCH("TCS", B2:B500, 0))`
    },
    interviewer_tip: "Mention XLOOKUP as the modern replacement while demonstrating full command of INDEX/MATCH for legacy spreadsheet compatibility.",
    common_mistakes: "Forgetting the exact match argument (0 or FALSE) in VLOOKUP and MATCH.",
    follow_ups: ["How does XLOOKUP improve over both VLOOKUP and INDEX/MATCH?"]
  },
  {
    id: 'acc-10',
    company: 'accenture',
    domain: 'data-analyst',
    question: 'What are the key aspects of MySQL development (Indexing, Query Plans, Transactions)?',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'Key aspects include schema design, B-tree indexes, execution profiling with EXPLAIN, transaction isolation (ACID), and InnoDB storage engine.',
    answer: `Core components of professional MySQL database development:
1. **Indexing Strategy:** Use B-tree indexes for equality and range filters. Use Composite indexes following the 'Leftmost Prefix Rule'.
2. **Query Optimization & EXPLAIN:** Run EXPLAIN SELECT ... to inspect key usage, scanned rows, and avoid Using filesort or Using temporary.
3. **Storage Engines:** Use **InnoDB** for ACID compliance, row-level locking, and foreign key constraints (avoid legacy MyISAM).
4. **Transactions & Concurrency:** Use START TRANSACTION, COMMIT, and ROLLBACK with appropriate isolation levels (Repeatable Read is MySQL default).`,
    code_example: {
      language: 'sql',
      code: `-- Create optimal composite index for filter and sort:\nCREATE INDEX idx_orders_status_date ON Orders (status, order_date);`
    },
    interviewer_tip: "Explain the 'Leftmost Prefix Rule' for multi-column composite indexes in MySQL.",
    common_mistakes: "Adding separate single-column indexes on every field instead of a well-designed composite index.",
    follow_ups: ["What are the four transaction isolation levels in SQL?"]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. CAPGEMINI AUTHENTIC QUESTIONS (FROM AMBITIONBOX PDF)
// ─────────────────────────────────────────────────────────────────────────────
export const CAPGEMINI_PDF_QUESTIONS = [
  {
    id: 'cap-01',
    company: 'capgemini',
    domain: 'data-analyst',
    question: 'What are virtual functions and how are they implemented in C++ (vtable & vptr)?',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'Virtual functions enable runtime polymorphism in C++. The compiler uses a virtual method table (vtable) and a hidden pointer (vptr) inside each object.',
    answer: `Virtual functions allow derived classes to override methods of base classes with runtime resolution:
- **Definition:** Declared in a base class with the virtual keyword. When invoked through a base pointer/reference, the derived version executes.
- **Internal Mechanism:**
  1. **vtable (Virtual Table):** A static table of function pointers created by compiler for each class containing virtual functions.
  2. **vptr (Virtual Pointer):** A hidden pointer added to each object pointing to its class's vtable.
  3. **Runtime Dispatch:** When calling ptr->method(), program looks up vptr -> vtable -> function_address.`,
    code_example: {
      language: 'text',
      code: `Base* b = new Derived();\nb->display(); // Calls Derived::display() dynamically at runtime`
    },
    interviewer_tip: "Draw or describe the memory layout of vptr and vtable to impress Capgemini technical evaluators.",
    common_mistakes: "Forgetting that constructors cannot be virtual, but destructors in polymorphic base classes MUST be virtual.",
    follow_ups: ["Why should base class destructors always be declared virtual?"]
  },
  {
    id: 'cap-02',
    company: 'capgemini',
    domain: 'data-analyst',
    question: 'How do you retrieve non-repeated entries from a table in SQL?',
    category: 'SQL & DBMS',
    difficulty: 'Easy',
    summary: 'Retrieve unique non-duplicated values using GROUP BY with HAVING COUNT(*) = 1.',
    answer: `To retrieve only entries that appear exactly once (non-repeated):
SELECT employee_id, email
FROM Employee_Logins
GROUP BY employee_id, email
HAVING COUNT(*) = 1;

- **Distinct vs Non-repeated:**
  - DISTINCT: Returns all unique values by collapsing duplicates into one copy.
  - HAVING COUNT(*) = 1: Filters out any value that appeared more than once, returning strictly single-occurrence records.`,
    code_example: {
      language: 'sql',
      code: `-- Finding customer IDs that only made a single purchase:\nSELECT customer_id\nFROM Orders\nGROUP BY customer_id\nHAVING COUNT(order_id) = 1;`
    },
    interviewer_tip: "Clarify whether the interviewer wants deduplicated rows (DISTINCT) or items that strictly appear once (HAVING COUNT = 1).",
    common_mistakes: "Using DISTINCT when the question asks for non-repeated entries.",
    follow_ups: ["How would you do this in Python using pandas? (df['col'].drop_duplicates(keep=False))."]
  },
  {
    id: 'cap-03',
    company: 'capgemini',
    domain: 'data-analyst',
    question: 'What is the difference between Multitasking and Multithreading?',
    category: 'Data Analysis',
    difficulty: 'Easy',
    summary: 'Multitasking executes multiple independent processes concurrently; Multithreading runs multiple concurrent execution threads within a single process.',
    answer: `Comparison in operating systems and analytics pipelines:
- **Multitasking:**
  - Execution of multiple processes/programs simultaneously by the OS CPU scheduler.
  - Each process has its own isolated memory space.
  - Context switching between processes has higher CPU overhead.
  - Example: Running SQL Server, Excel, and VS Code at the same time.
- **Multithreading:**
  - Execution of multiple threads within a single process.
  - Threads share the same code, heap memory, and data segments.
  - Lower context switching overhead, but requires thread-safety (locks, mutexes).
  - Example: A data ingestion tool reading 4 partitions of a file simultaneously.`,
    code_example: {
      language: 'text',
      code: `Process (Heavyweight, Isolated Memory) -> Threads (Lightweight, Shared Memory)`
    },
    interviewer_tip: "Connect multithreading to parallel data processing in Python (multiprocessing vs threading).",
    common_mistakes: "Claiming Python threads run on multiple CPU cores in parallel (blocked by Python's Global Interpreter Lock - GIL).",
    follow_ups: ["What is Python's GIL and how does it impact multithreading?"]
  },
  {
    id: 'cap-04',
    company: 'capgemini',
    domain: 'data-analyst',
    question: 'Describe the purpose of a Primary Key in SQL. Why is it important?',
    category: 'SQL & DBMS',
    difficulty: 'Easy',
    summary: 'A Primary Key uniquely identifies each row in a table, enforces NOT NULL and UNIQUE constraints, and serves as the anchor for Foreign Keys.',
    answer: `A Primary Key is a column or set of columns (composite) that uniquely identifies each record in a database table:
1. **Entity Integrity:** Guarantees that every entity can be distinctly referenced without ambiguity.
2. **Mandatory Rules:** Automatically enforces both NOT NULL and UNIQUE.
3. **Clustered Index Creation:** In most RDBMSs (like SQL Server and MySQL InnoDB), creating a primary key automatically creates the clustered index, physically ordering data on disk.
4. **Referential Integrity:** Serves as the parent target for Foreign Keys in other tables to establish relational schemas.`,
    code_example: {
      language: 'sql',
      code: `CREATE TABLE Employees (\n    emp_id INT PRIMARY KEY,\n    name VARCHAR(100) NOT NULL\n);`
    },
    interviewer_tip: "State that in InnoDB, tables are clustered around the primary key, making lookups by primary key instant (O(log n)).",
    common_mistakes: "Thinking a table can have multiple primary keys (a table has only 1 primary key, though it can span multiple columns).",
    follow_ups: ["What is a surrogate key vs a natural key?"]
  },
  {
    id: 'cap-05',
    company: 'capgemini',
    domain: 'data-analyst',
    question: 'What is the difference between a Primary Key and a Unique Key?',
    category: 'SQL & DBMS',
    difficulty: 'Easy',
    summary: 'A table has only one Primary Key and it cannot accept NULL; a table can have multiple Unique Keys and they can accept NULL values.',
    answer: `Key differences between Primary Key and Unique Key constraints:
- **Primary Key:**
  - A table can have **only one** primary key.
  - **Cannot accept NULL** values in any of its columns.
  - By default, creates a **clustered index** on the table.
- **Unique Key:**
  - A table can have **multiple** unique key constraints.
  - **Can accept NULL** values (in SQL standard / PostgreSQL, multiple NULLs are permitted because NULL != NULL; in SQL Server, only one NULL is permitted).
  - By default, creates a **non-clustered index**.`,
    code_example: {
      language: 'sql',
      code: `CREATE TABLE Users (\n    user_id INT PRIMARY KEY,         -- Single clustered PK, no NULLs\n    email VARCHAR(255) UNIQUE,       -- Unique constraint #1\n    phone_number VARCHAR(20) UNIQUE  -- Unique constraint #2\n);`
    },
    interviewer_tip: "Mention the nuance of how different databases handle multiple NULL values in a UNIQUE column.",
    common_mistakes: "Assuming a Unique Key column cannot accept any NULL values.",
    follow_ups: ["How does SQL Server differ from Oracle/PostgreSQL in handling NULL in a UNIQUE column?"]
  },
  {
    id: 'cap-06',
    company: 'capgemini',
    domain: 'data-analyst',
    question: 'What is a Data Lake and how does it differ from a Data Warehouse?',
    category: 'Data Analysis',
    difficulty: 'Medium',
    summary: 'Data Lakes store raw multi-format data on schema-on-read; Data Warehouses store curated structured data on schema-on-write.',
    answer: `Architectural differences in modern enterprise data stacks:
- **Data Lake (e.g., AWS S3, Azure ADLS, Delta Lake):**
  - **Data Types:** Raw structured, semi-structured (JSON/logs), and unstructured (images/audio).
  - **Schema:** **Schema-on-Read** (schema is applied when the data is queried).
  - **Cost:** Low-cost commodity cloud object storage.
  - **Users:** Data Scientists, ML Engineers, Big Data Developers.
- **Data Warehouse (e.g., Snowflake, BigQuery, Redshift):**
  - **Data Types:** Highly curated, cleaned, and relational structured data.
  - **Schema:** **Schema-on-Write** (data must match schema before ingestion).
  - **Performance:** Blazing fast SQL queries and dashboard response times.
  - **Users:** Business Analysts, BI Developers, Executives.`,
    code_example: {
      language: 'text',
      code: `Modern Lakehouse Pattern: Raw Ingestion (Data Lake) -> Curated Bronze/Silver/Gold -> BI Reporting (Warehouse)`
    },
    interviewer_tip: "Mention Databricks Lakehouse or Snowflake as modern platforms bridging the gap between Data Lakes and Warehouses.",
    common_mistakes: "Thinking a Data Lake replaces the need for a Data Warehouse.",
    follow_ups: ["What is the medallion architecture (Bronze, Silver, Gold)?"]
  },
  {
    id: 'cap-07',
    company: 'capgemini',
    domain: 'data-analyst',
    question: 'What is Present Value (PV) and how is it calculated in financial analytics?',
    category: 'Statistics',
    difficulty: 'Medium',
    summary: 'Present Value discounts future cash flows back to today using a discount rate: PV = FV / (1 + r)^n.',
    answer: `Present Value (PV) reflects the principle that money available today is worth more than the same amount in the future due to its earning potential (Time Value of Money).
- **Formula:**
  PV = FV / (1 + r)^n
  Where:
  - FV = Future Value
  - r = Discount / Interest rate per period
  - n = Number of periods
- **Applications in Capgemini Consulting:**
  - Capital budgeting and project feasibility evaluation (Net Present Value - NPV).
  - Valuing recurring SaaS contract revenues discounted to today.`,
    code_example: {
      language: 'python',
      code: `def calculate_pv(fv, rate, periods):\n    return fv / ((1 + rate) ** periods)\n\n# $10,000 received in 3 years at 8% annual discount rate:\npv = calculate_pv(10000, 0.08, 3)\nprint(f"PV: USD {pv:.2f}") # Output: USD 7938.32`
    },
    interviewer_tip: "Connect PV to Net Present Value (NPV): if NPV > 0, the project or client investment is financially viable.",
    common_mistakes: "Using simple interest instead of compound discounting.",
    follow_ups: ["What is the difference between NPV and Internal Rate of Return (IRR)?"]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. COGNIZANT AUTHENTIC QUESTIONS (FROM AMBITIONBOX PDF)
// ─────────────────────────────────────────────────────────────────────────────
export const COGNIZANT_PDF_QUESTIONS = [
  {
    id: 'cog-01',
    company: 'cognizant',
    domain: 'data-analyst',
    question: 'What are the primary roles and responsibilities of a Data Analyst at Cognizant?',
    category: 'Data Analysis',
    difficulty: 'Easy',
    summary: 'Data Analysts collect, clean, model, and visualize data to help stakeholders make informed, data-driven business decisions.',
    answer: `Key responsibilities at Cognizant:
1. **Data Gathering:** Extract raw data from transactional databases, cloud storage, APIs, and flat files.
2. **Data Wrangling & Hygiene:** Identify data quality issues, handle missing or corrupted records, and ensure consistency.
3. **Statistical Analysis & EDA:** Uncover hidden trends, customer segmentation patterns, and operational correlations.
4. **Visual Analytics & Reporting:** Design interactive dashboards in Power BI, Tableau, or Qlik for client stakeholders.
5. **Business Translation:** Translate complex technical findings into actionable executive summaries and ROI metrics.`,
    code_example: {
      language: 'text',
      code: `Data Analyst Workflow: Business Objective -> ETL Pipeline -> EDA -> Model/KPI Design -> Client Presentation`
    },
    interviewer_tip: "Frame your answer around client value creation and clear stakeholder communication.",
    common_mistakes: "Describing only the technical tools without mentioning business problem solving.",
    follow_ups: ["How do you validate your data before presenting insights to a client?"]
  },
  {
    id: 'cog-02',
    company: 'cognizant',
    domain: 'data-analyst',
    question: 'Can you provide a structured self-introduction for a Data Analyst role?',
    category: 'HR',
    difficulty: 'Easy',
    summary: 'A compelling self-introduction covers education, core analytical toolkit (SQL, Python, Power BI), project achievements, and alignment with Cognizant.',
    answer: `Recommended 90-second structure:
"Hello, my name is [Name], and I am a Data Analyst passionate about transforming raw enterprise data into actionable business intelligence.
- **Education:** I hold a degree in [Computer Science / Statistics / Engineering], where I built a strong analytical and quantitative foundation.
- **Technical Skills:** I am proficient in SQL for complex data extraction, Python (pandas, numpy) for data cleaning and exploratory analysis, and Power BI for executive dashboarding.
- **Projects:** In my recent project, I analyzed a retail dataset of 150,000 transactions, built an automated sales performance dashboard, and identified product cross-selling opportunities that could improve revenue by 12%.
- **Why Cognizant:** I admire Cognizant's digital transformation work across global enterprises, and I am excited to apply my analytical rigor to your client engagements."`,
    code_example: {
      language: 'text',
      code: `Structure: Background -> Core Skills -> Concrete Project Impact -> Alignment with Cognizant`
    },
    interviewer_tip: "Keep it under 2 minutes, speak confidently, and always highlight one quantified project outcome.",
    common_mistakes: "Reciting your entire resume line-by-line.",
    follow_ups: ["Can you tell me more about the retail project you mentioned?"]
  },
  {
    id: 'cog-03',
    company: 'cognizant',
    domain: 'data-analyst',
    question: 'What is a Database and how do Relational (SQL) and Non-Relational (NoSQL) databases differ?',
    category: 'SQL & DBMS',
    difficulty: 'Easy',
    summary: 'A database is an organized collection of data. SQL databases are tabular with strict ACID schemas; NoSQL databases are schema-free with horizontal scaling.',
    answer: `Core differences:
- **Relational Databases (SQL - e.g., PostgreSQL, Oracle, MySQL):**
  - **Structure:** Tabular schema with predefined tables, rows, columns, and foreign keys.
  - **Properties:** ACID compliant (Atomicity, Consistency, Isolation, Durability) for transaction integrity.
  - **Scaling:** Primarily vertical scaling (larger server CPU/RAM).
  - **Ideal for:** Financial systems, inventory management, ERP transactions.
- **Non-Relational Databases (NoSQL - e.g., MongoDB, Cassandra, DynamoDB):**
  - **Structure:** Dynamic schemas (JSON documents, key-value pairs, wide-column stores, graphs).
  - **Properties:** BASE model (Basically Available, Soft state, Eventual consistency).
  - **Scaling:** Horizontal scaling (adding commodity nodes to clusters).
  - **Ideal for:** Real-time clickstreams, IoT telemetry, social feeds, high-velocity unstructured data.`,
    code_example: {
      language: 'text',
      code: `SQL: Structured Tables | ACID | Vertical Scaling | Complex Joins\nNoSQL: Flexible JSON | Eventual Consistency | Horizontal Scaling | High Velocity`
    },
    interviewer_tip: "Mention the CAP theorem when explaining NoSQL trade-offs (Consistency vs Availability vs Partition tolerance).",
    common_mistakes: "Claiming NoSQL is 'better' than SQL rather than choosing based on schema predictability.",
    follow_ups: ["What is the CAP theorem?"]
  },
  {
    id: 'cog-04',
    company: 'cognizant',
    domain: 'data-analyst',
    question: 'SQL: Write a query to find the number that appears consecutively 3 times.',
    category: 'SQL & DBMS',
    difficulty: 'Hard',
    summary: 'Use LEAD() and LAG() window functions or self-joins to identify values where current value equals previous and next values.',
    answer: `Solving the consecutive numbers interview challenge:
- **Method: Using LEAD() and LAG() window functions:**
WITH NumberSequences AS (
    SELECT 
        num,
        LAG(num, 1) OVER (ORDER BY id) AS prev_num,
        LEAD(num, 1) OVER (ORDER BY id) AS next_num
    FROM Logs
)
SELECT DISTINCT num AS ConsecutiveNums
FROM NumberSequences
WHERE num = prev_num AND num = next_num;

- **Alternative (Three-way Self-Join on consecutive IDs):**
SELECT DISTINCT l1.num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l1.id = l2.id - 1
JOIN Logs l3 ON l1.id = l3.id - 2
WHERE l1.num = l2.num AND l2.num = l3.num;`,
    code_example: {
      language: 'sql',
      code: `-- Using window functions (Recommended approach):\nWITH CTE AS (\n    SELECT num,\n           LAG(num, 1) OVER (ORDER BY id) as p1,\n           LAG(num, 2) OVER (ORDER BY id) as p2\n    FROM Logs\n)\nSELECT DISTINCT num FROM CTE WHERE num = p1 AND num = p2;`
    },
    interviewer_tip: "Cognizant interviewers frequently test this LeetCode 180 classic to evaluate your command of window functions.",
    common_mistakes: "Assuming IDs are strictly contiguous (1, 2, 3) without gaps. Window functions with ROW_NUMBER() order avoid this bug.",
    follow_ups: ["What if there are gaps in the ID column? (Answer: Use ROW_NUMBER() as a synthetic contiguous sequence)."]
  },
  {
    id: 'cog-05',
    company: 'cognizant',
    domain: 'data-analyst',
    question: 'Managers and their Employees: Write the Self-Join SQL query to find employee-manager relationships.',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'Use a SELF JOIN linking employee.manager_id to manager.emp_id using a LEFT JOIN to include top executives who have no manager.',
    answer: `Self-joins are used when hierarchical relationships exist within the same table:
SELECT 
    e.employee_id,
    e.employee_name AS Employee,
    COALESCE(m.employee_name, 'Top Executive / CEO') AS Manager
FROM Employees e
LEFT JOIN Employees m 
    ON e.manager_id = m.employee_id
ORDER BY Manager, Employee;

- **Key Insight:** Use LEFT JOIN instead of INNER JOIN so the CEO or top-level executives (who have manager_id IS NULL) are not excluded from the output.`,
    code_example: {
      language: 'sql',
      code: `-- Find employees earning more than their direct manager:\nSELECT e.employee_name\nFROM Employees e\nJOIN Employees m ON e.manager_id = m.employee_id\nWHERE e.salary > m.salary;`
    },
    interviewer_tip: "Always emphasize why a LEFT JOIN is essential here so root-level leaders without managers are preserved.",
    common_mistakes: "Using INNER JOIN, which accidentally drops the CEO from the report.",
    follow_ups: ["How would you query this hierarchy recursively to find all levels of management? (Recursive CTE)."]
  },
  {
    id: 'cog-06',
    company: 'cognizant',
    domain: 'data-analyst',
    question: 'How do you handle missing or inconsistent data in a dataset?',
    category: 'Python & Pandas',
    difficulty: 'Medium',
    summary: 'Techniques include data profiling, deletion (dropna), statistical imputation (mean/median/mode), interpolation, and flag indicators.',
    answer: `Structured strategy for handling missing and inconsistent data:
1. **Diagnosis & Profiling:** Calculate percentage of missingness: df.isnull().mean() * 100. Check if data is MCAR, MAR, or MNAR.
2. **Dropping:**
   - Drop rows if missingness is < 3% and random.
   - Drop columns if > 40-50% data is missing and unrecoverable.
3. **Imputation:**
   - **Numerical:** Impute with Median (robust to outliers) or Mean (normal distributions).
   - **Categorical:** Impute with Mode or create a dedicated 'Unknown' category.
   - **Time Series:** Use forward-fill (ffill), backward-fill (bfill), or linear interpolation.
4. **Validation:** Re-verify data types, ranges, and check for negative prices or invalid dates.`,
    code_example: {
      language: 'python',
      code: `import pandas as pd\n# Robust imputation pipeline\ndf['salary'] = df['salary'].fillna(df['salary'].median())\ndf['department'] = df['department'].fillna('Unknown')\ndf['stock_price'] = df['stock_price'].interpolate(method='linear')`
    },
    interviewer_tip: "Mention why median is superior to mean when the feature distribution has significant skew or outliers.",
    common_mistakes: "Blindly dropping all rows with missing values, which can introduce heavy sampling bias.",
    follow_ups: ["What is the difference between MCAR (Missing Completely at Random) and MNAR (Missing Not at Random)?"]
  },
  {
    id: 'cog-07',
    company: 'cognizant',
    domain: 'data-analyst',
    question: 'What was the reason for the creation of the C programming language?',
    category: 'Case Studies',
    difficulty: 'Easy',
    summary: 'C was created by Dennis Ritchie at Bell Labs to rewrite the UNIX operating system, combining low-level hardware control with cross-machine portability.',
    answer: `Historical and architectural origin of C:
- **Developer & Origin:** Developed by **Dennis Ritchie** between 1969 and 1973 at Bell Laboratories.
- **Primary Motivation:** To rewrite and reimplement the **UNIX operating system**, which was originally written in machine-specific assembly language.
- **Key Innovations:**
  1. **Portability:** Programmers could write code once and compile it on different hardware architectures.
  2. **Efficiency:** Provided low-level memory access (pointers, bit manipulation) while retaining structured programming syntax.
  3. **Foundation:** Laid the syntactic and conceptual foundation for modern languages like C++, Java, C#, JavaScript, and Python's CPython engine.`,
    code_example: {
      language: 'text',
      code: `Assembly (Hardware specific) -> B Language -> C (Portable & Low-level) -> UNIX OS Rewritten`
    },
    interviewer_tip: "Connect C's legacy to data analysis: NumPy and Pandas core routines are compiled in C for vectorized speed.",
    common_mistakes: "Stating C was developed for consumer software rather than operating system systems programming.",
    follow_ups: ["Why is C still used today for high-performance computing?"]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. INFOSYS AUTHENTIC QUESTIONS (FROM AMBITIONBOX PDF)
// ─────────────────────────────────────────────────────────────────────────────
export const INFOSYS_PDF_QUESTIONS = [
  {
    id: 'inf-01',
    company: 'infosys',
    domain: 'data-analyst',
    question: 'What is the work given for freshers as a Data Analyst at Infosys?',
    category: 'Data Analysis',
    difficulty: 'Easy',
    summary: 'Freshers at Infosys handle data validation, writing SQL extraction queries, assisting in ETL monitoring, and maintaining client operational dashboards.',
    answer: `Typical tasks assigned to entry-level Data Analysts at Infosys:
1. **Data Ingestion & Validation:** Verifying data consistency between upstream transactional databases and data warehouse staging tables.
2. **Writing Ad-hoc SQL Queries:** Assisting senior consultants by extracting filtered subsets of data for client audit requests.
3. **Report Generation:** Updating weekly and monthly operational KPI decks in Excel and Power BI.
4. **Data Cleansing:** Sanitizing legacy customer records, standardizing phone numbers, dates, and currency fields.
5. **Agile Team Participation:** Attending daily standups, logging defects in Jira, and documenting data dictionaries.`,
    code_example: {
      language: 'text',
      code: `Infosys Foundation Training: 8-12 weeks at Mysore campus (Python, SQL, DB concepts, Cloud BI) -> Project Deployment`
    },
    interviewer_tip: "Mention the renowned Infosys Mysore training program and express eagerness to learn enterprise best practices.",
    common_mistakes: "Expecting to build complex machine learning models on day one without mastering SQL and data validation.",
    follow_ups: ["How do you handle repetitive data extraction tasks? (By automating with Python scripts or stored procedures)."]
  },
  {
    id: 'inf-02',
    company: 'infosys',
    domain: 'data-analyst',
    question: 'Explain the Trade Life Cycle and various OTC derivative products.',
    category: 'Case Studies',
    difficulty: 'Hard',
    summary: 'Trade Life Cycle covers Pre-Trade, Execution, Clearing, Settlement, and Reconciliation. OTC products include Swaps, Forwards, and CFDs.',
    answer: `Essential knowledge for Capital Markets & Financial Services (BFSI) clients:
- **Trade Life Cycle Stages:**
  1. **Pre-Trade:** Market research, order creation, pre-trade credit and risk limits check.
  2. **Trade Execution:** Order matching and confirmation between buyer and seller.
  3. **Clearing:** Determination of net obligations through a central clearing counterparty (CCP).
  4. **Settlement:** Actual transfer of securities against cash payment (T+1 / T+2 settlement cycle).
  5. **Reconciliation & Reporting:** Ensuring internal books match custodian records; regulatory reporting (Dodd-Frank, EMIR).
- **OTC (Over-The-Counter) Derivative Products:**
  - Privately negotiated bilateral contracts not traded on public centralized exchanges.
  - Examples: **Interest Rate Swaps (IRS)**, **Credit Default Swaps (CDS)**, **Currency Forwards**, and **Options**.`,
    code_example: {
      language: 'text',
      code: `Trade Cycle: Order -> Execution -> Validation/Enrichment -> Clearing -> Settlement -> Reconciliation`
    },
    interviewer_tip: "Infosys serves top global investment banks. Understanding the Trade Life Cycle demonstrates immediate billing readiness.",
    common_mistakes: "Confusing exchange-traded futures with OTC forwards.",
    follow_ups: ["What is the difference between T+1 and T+2 settlement?"]
  },
  {
    id: 'inf-03',
    company: 'infosys',
    domain: 'data-analyst',
    question: 'Write code to find the minimum and maximum elements in an array or dataset.',
    category: 'Python & Pandas',
    difficulty: 'Easy',
    summary: 'Find min and max in a single pass in O(n) time and O(1) space by maintaining tracking variables.',
    answer: `Efficient single-pass algorithm:
def find_min_max(arr):
    if not arr:
        return None, None
        
    min_val = arr[0]
    max_val = arr[0]
    
    for num in arr[1:]:
        if num < min_val:
            min_val = num
        elif num > max_val:
            max_val = num
            
    return min_val, max_val

# Test:
data = [42, 17, 88, 3, 99, 25]
minimum, maximum = find_min_max(data)
print(f"Min: {minimum}, Max: {maximum}") # Min: 3, Max: 99

- **Time Complexity:** O(n) where n is number of elements.
- **Space Complexity:** O(1) auxiliary space.`,
    code_example: {
      language: 'python',
      code: `# In pandas DataFrame:\nimport pandas as pd\ns = pd.Series([42, 17, 88, 3, 99, 25])\nprint("Min:", s.min(), "| Max:", s.max())`
    },
    interviewer_tip: "Emphasize that finding both in a single loop takes 2(N-1) comparisons, which can be further optimized to 1.5N comparisons using pairwise comparisons.",
    common_mistakes: "Sorting the array first (which takes O(n log n) time) just to get the first and last elements.",
    follow_ups: ["Can you optimize the number of comparisons below 2(N-1)?"]
  },
  {
    id: 'inf-04',
    company: 'infosys',
    domain: 'data-analyst',
    question: 'What is the difference between a Calculated Field and a Calculated Item in an Excel Pivot Table?',
    category: 'Excel',
    difficulty: 'Medium',
    summary: 'Calculated Field creates a new column using mathematical formulas on existing fields; Calculated Item creates a new row within a specific field.',
    answer: `Distinction in advanced Excel reporting:
- **Calculated Field (Column Level):**
  - Creates a **brand new metric (column)** in the Pivot Table.
  - Formula uses existing field names.
  - Operates on the sum of values across the underlying data.
  - Example: Total Revenue = Sales * Price or Tax Amount = Revenue * 0.18.
- **Calculated Item (Row Level):**
  - Creates a **new row/member** inside an existing dimension field.
  - Formula references specific items within that field.
  - Example: Creating a calculated item North America = USA + Canada inside the Country field.`,
    code_example: {
      language: 'text',
      code: `Calculated Field -> Creates a NEW VALUE COLUMN\nCalculated Item  -> Creates a NEW ROW MEMBER within a category`
    },
    interviewer_tip: "Warn the interviewer that Calculated Items can slow down Pivot Table performance on large datasets and prevent grouped date hierarchies.",
    common_mistakes: "Confusing Calculated Fields with Power Pivot DAX Measures.",
    follow_ups: ["Can you create a Calculated Item on a field that has grouping applied? (No, Excel restricts this)."]
  },
  {
    id: 'inf-05',
    company: 'infosys',
    domain: 'data-analyst',
    question: 'Where do you see yourself in 5 years from now at Infosys?',
    category: 'HR',
    difficulty: 'Easy',
    summary: 'Progress from an entry-level analyst mastering ETL & BI into a Senior Data Consultant or Data Architect leading client engagements.',
    answer: `Structured long-term career progression:
"In five years at Infosys, I envision myself growing from an entry-level analyst into a **Lead Data Consultant** or **Solution Architect**.
- **First 1-2 Years:** Master enterprise data pipelines, gain deep domain knowledge in the assigned client industry (e.g., Financial Services or Retail), and earn cloud data certifications (e.g., Azure Data Analyst Associate or AWS Certified Data Analytics).
- **Years 3-4:** Take ownership of complex data modeling engagements, mentor newer joiners, and bridge the gap between business stakeholders and technical engineering teams.
- **Year 5:** Lead end-to-end data transformation projects, architecting scalable cloud analytics solutions that deliver measurable ROI to Infosys's Fortune 500 clients."`,
    code_example: {
      language: 'text',
      code: `Year 1: Delivery Excellence & Certifications -> Year 3: Project Ownership & Mentorship -> Year 5: Lead Analytics Consultant`
    },
    interviewer_tip: "Align your ambitions with Infosys's internal career tracks (Systems Engineer -> Senior Systems Engineer -> Technology Analyst -> Technology Lead).",
    common_mistakes: "Mentioning an aspiration that involves leaving the company or switching to an unrelated field.",
    follow_ups: ["What specific certifications do you plan to pursue in your first year?"]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. WIPRO AUTHENTIC QUESTIONS (FROM AMBITIONBOX PDF)
// ─────────────────────────────────────────────────────────────────────────────
export const WIPRO_PDF_QUESTIONS = [
  {
    id: 'wip-01',
    company: 'wipro',
    domain: 'data-analyst',
    question: 'Tell me about yourself and your practical experience with data analysis tools.',
    category: 'HR',
    difficulty: 'Easy',
    summary: 'A structured self-introduction detailing your background, technical toolkit (SQL, Python, Excel, Power BI), and a practical project demonstration.',
    answer: `Structured overview:
"I am a Data Analyst with a strong passion for uncovering data-driven patterns that solve business problems.
- **Academic Foundation:** I completed my degree in [Field], where I cultivated a solid grounding in statistics, relational database design, and algorithmic thinking.
- **Technical Skills:**
  - **SQL:** Writing complex queries, joins, window functions, and CTEs.
  - **Python:** Data manipulation and analysis using pandas, numpy, and matplotlib.
  - **BI Tools:** Building automated dashboards in Power BI and Excel.
- **Practical Project:** In my recent project analyzing customer churn, I analyzed 50,000 subscriber records, identified key indicators of churn (contract type and customer service ticket frequency), and built a predictive model with 82% accuracy.
- **Why Wipro:** Wipro's commitment to innovation and digital transformation makes it the ideal place to launch my professional analytics career."`,
    code_example: {
      language: 'text',
      code: `Focus Areas: Problem Formulation -> Data Ingestion -> Exploratory Analysis -> Business Recommendation`
    },
    interviewer_tip: "Deliver with steady pace, professional posture, and enthusiasm for problem solving.",
    common_mistakes: "Failing to mention specific tools or project metrics.",
    follow_ups: ["Which of the tools you mentioned are you most confident in?"]
  },
  {
    id: 'wip-02',
    company: 'wipro',
    domain: 'data-analyst',
    question: 'What are the key aspects of MySQL development (Indexes, EXPLAIN, Storage Engines)?',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'MySQL development focuses on schema normalization, index strategies (B-Tree), query optimization using EXPLAIN, and choosing the InnoDB engine.',
    answer: `Crucial elements for robust MySQL development:
1. **Schema & Data Types:** Choosing appropriate storage sizes (e.g., INT vs BIGINT, VARCHAR vs CHAR, DECIMAL for financial figures).
2. **Indexing:** Creating B-Tree indexes on search keys. Using composite indexes adhering to the leftmost prefix rule.
3. **Execution Profiling (EXPLAIN):** Inspecting the execution plan to evaluate type (avoid ALL full table scans; seek ref or eq_ref) and rows examined.
4. **Storage Engines:** Using **InnoDB** as the default engine for ACID compliance, row-level locking, and crash recovery.`,
    code_example: {
      language: 'sql',
      code: `-- Using EXPLAIN to diagnose query efficiency:\nEXPLAIN SELECT o.order_id, c.customer_name\nFROM Orders o\nJOIN Customers c ON o.customer_id = c.customer_id\nWHERE o.order_date >= '2026-01-01';`
    },
    interviewer_tip: "Explain what each column in the EXPLAIN output represents (type, possible_keys, key, key_len, ref, rows, Extra).",
    common_mistakes: "Not knowing the difference between InnoDB and MyISAM.",
    follow_ups: ["What does 'Using filesort' mean in the Extra column of EXPLAIN?"]
  },
  {
    id: 'wip-03',
    company: 'wipro',
    domain: 'data-analyst',
    question: 'Behavioral: What will you choose between Knowledge and Money? Why?',
    category: 'HR',
    difficulty: 'Easy',
    summary: 'A mature candidate chooses Knowledge as the primary driver, because continuous knowledge acquisition sustainably creates value and monetary rewards.',
    answer: `Recommended balanced answer:
"I would choose **Knowledge**, especially at this stage of my career.
- **Rationale:**
  1. **Sustainability:** Money is a byproduct of value creation. When you possess deep knowledge, technical mastery, and problem-solving capabilities, monetary rewards and career growth naturally follow.
  2. **Adaptability:** Technology evolves rapidly. If one prioritizes short-term compensation over learning, skills become obsolete. Prioritizing knowledge keeps an analyst agile and indispensable.
  3. **Impact:** Deep knowledge allows me to deliver exceptional results to Wipro's clients, which ultimately leads to organizational success and financial recognition."`,
    code_example: {
      language: 'text',
      code: `Equation: Deep Knowledge & Skills -> Value Creation -> Long-term Financial Success & Career Growth`
    },
    interviewer_tip: "Interviewers use this classic question to gauge your humility, long-term perspective, and dedication to self-improvement.",
    common_mistakes: "Categorically dismissing money as completely unimportant, which sounds disingenuous.",
    follow_ups: ["How do you ensure you are continuously learning outside of formal job duties?"]
  },
  {
    id: 'wip-04',
    company: 'wipro',
    domain: 'data-analyst',
    question: 'Guesstimate: Estimate the daily coffee consumption in a metropolitan city like Bengaluru or Mumbai.',
    category: 'Case Studies',
    difficulty: 'Hard',
    summary: 'Structure the estimation using top-down population segmentation: Total Population -> Age filter -> Coffee drinkers % -> Cups per day.',
    answer: `Structured step-by-step framework:
1. **Define Population:** Assume metropolitan population of **12 million** people.
2. **Age Segmentation:**
   - Children (0-15 years): 20% = 2.4 million (0 coffee).
   - Working Adults & Students (16-60 years): 65% = 7.8 million.
   - Seniors (60+ years): 15% = 1.8 million.
3. **Consumer Penetration:**
   - Out of 7.8M working adults: ~50% drink coffee regularly = 3.9 million.
   - Out of 1.8M seniors: ~30% drink coffee = 0.54 million.
   - Total regular coffee drinkers = ~4.44 million.
4. **Consumption Frequency:**
   - Light drinkers (1 cup/day): 50% = 2.22M cups.
   - Moderate drinkers (2 cups/day): 40% = 3.55M cups.
   - Heavy drinkers (3+ cups/day): 10% = 1.33M cups.
5. **Final Total:** approx 2.22 + 3.55 + 1.33 = 7.1 million cups of coffee per day.`,
    code_example: {
      language: 'text',
      code: `Framework: Population (12M) -> Filter Target Age (7.8M) -> Penetration (4.4M) -> Frequency Multipliers = ~7M cups/day`
    },
    interviewer_tip: "The final number does not need to be exact; interviewers are evaluating your structured logic, clear assumptions, and mathematical sanity checks.",
    common_mistakes: "Guessing a random number without explaining your thought process or assumptions.",
    follow_ups: ["How would you segment this into home-brewed coffee vs cafe purchases?"]
  },
  {
    id: 'wip-05',
    company: 'wipro',
    domain: 'data-analyst',
    question: 'How do you perform data cleaning and validation in Python using Pandas?',
    category: 'Python & Pandas',
    difficulty: 'Medium',
    summary: 'Data cleaning workflow includes checking info/describe, handling nulls with fillna/dropna, deduplication, type casting, and outlier removal using IQR.',
    answer: `Essential 6-step data cleaning pipeline in Python:
import pandas as pd
import numpy as np

# 1. Load and inspect
df = pd.read_csv('raw_client_data.csv')
print(df.info())

# 2. Remove exact duplicates
df = df.drop_duplicates()

# 3. Clean string columns and standardize casing
df['customer_name'] = df['customer_name'].str.strip().str.title()

# 4. Handle missing values
df['age'] = df['age'].fillna(df['age'].median())
df['city'] = df['city'].fillna('Unknown')

# 5. Type casting
df['transaction_date'] = pd.to_datetime(df['transaction_date'])

# 6. Filter outliers using IQR
q1 = df['spend'].quantile(0.25)
q3 = df['spend'].quantile(0.75)
iqr = q3 - q1
df_clean = df[(df['spend'] >= q1 - 1.5*iqr) & (df['spend'] <= q3 + 1.5*iqr)]`,
    code_example: {
      language: 'python',
      code: `# IQR Outlier Removal Snippet:\nq1 = df['val'].quantile(0.25)\nq3 = df['val'].quantile(0.75)\niqr = q3 - q1\nclean_df = df[~((df['val'] < (q1 - 1.5 * iqr)) | (df['val'] > (q3 + 1.5 * iqr)))]`
    },
    interviewer_tip: "Always mention IQR (Interquartile Range) or Z-score when asked how you identify and handle numerical outliers.",
    common_mistakes: "Modifying DataFrame slices without using .copy(), causing SettingWithCopyWarning.",
    follow_ups: ["What is the difference between loc and iloc in pandas?"]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. AMAZON AUTHENTIC DATA ANALYST QUESTIONS (FROM TOPFOLIO AMAZON GUIDE PDF)
// ─────────────────────────────────────────────────────────────────────────────
export const AMAZON_PDF_QUESTIONS = [
  {
    id: 'amz-01',
    company: 'amazon',
    domain: 'data-analyst',
    question: 'How do you perform an 80/20 Pareto revenue contribution analysis in SQL to identify top sellers generating the first 80% of Gross Merchandise Value (GMV)?',
    category: 'SQL & DBMS',
    difficulty: 'Hard',
    summary: 'Use window functions SUM(total_gmv) OVER () to compute total platform GMV and SUM(total_gmv) OVER (ORDER BY total_gmv DESC) to compute descending running total, filtering sellers prior to exceeding the 80% threshold.',
    answer: `Step-by-step optimal PostgreSQL solution for Amazon Marketplace Analytics:
1. **Compute Platform Grand Total:** \`SUM(total_gmv) OVER ()\` calculates total GMV in a single scan without an expensive subquery.
2. **Compute Descending Running Total:** \`SUM(total_gmv) OVER (ORDER BY total_gmv DESC)\` calculates cumulative GMV.
3. **Filter 80% Boundary:** Compare the previous cumulative sum \`(running_gmv - total_gmv) / total_platform_gmv < 0.80\` to isolate the vital few sellers generating the bulk of marketplace value.`,
    code_example: {
      language: 'sql',
      code: `WITH running_totals AS (
  SELECT
    seller_id,
    total_gmv,
    SUM(total_gmv) OVER (ORDER BY total_gmv DESC) AS running_gmv,
    SUM(total_gmv) OVER () AS total_platform_gmv
  FROM sellers
)
SELECT
  seller_id,
  total_gmv,
  ROUND((running_gmv / total_platform_gmv) * 100, 2) AS cumulative_pct
FROM running_totals
WHERE (running_gmv - total_gmv) / total_platform_gmv < 0.80
ORDER BY total_gmv DESC;`
    },
    interviewer_tip: "Amazon BIE interviewers specifically evaluate whether you use window functions over correlated subqueries. Window functions execute in O(N log N) vs O(N^2) for self-joins on billion-row retail tables.",
    common_mistakes: "Using correlated subqueries or failing to handle ties in ORDER BY, causing quadratic execution slowdown on large datasets.",
    follow_ups: ["How would you adapt this query to segment revenue contribution across individual product categories?", "What index would optimize the sellers table for this query?"]
  },
  {
    id: 'amz-02',
    company: 'amazon',
    domain: 'data-analyst',
    question: 'How do you segment Amazon Prime customers into 4 equal quartiles based on annual spend using NTILE to tailor promotional discount tiers?',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'Use NTILE(4) OVER (ORDER BY annual_spend DESC) to partition the ordered customer dataset into four equal frequency buckets, assigning tiers from Platinum to Bronze.',
    answer: `Optimal PostgreSQL spend quartile tiering query:
- **NTILE(4):** Partitions ordered customer records into four equal buckets (Top 25%, 25-50%, 50-75%, Bottom 25%).
- **Case Mapping:** Maps bucket ranks (1 to 4) into actionable marketing tiers (Platinum, Gold, Silver, Bronze).`,
    code_example: {
      language: 'sql',
      code: `SELECT
  customer_id,
  annual_spend,
  NTILE(4) OVER (ORDER BY annual_spend DESC) AS spend_quartile,
  CASE NTILE(4) OVER (ORDER BY annual_spend DESC)
    WHEN 1 THEN 'Platinum (Top 25%)'
    WHEN 2 THEN 'Gold (25–50%)'
    WHEN 3 THEN 'Silver (50–75%)'
    WHEN 4 THEN 'Bronze (Bottom 25%)'
  END AS tier_label
FROM customer_orders;`
    },
    interviewer_tip: "Be prepared to explain the exact difference between NTILE, CUME_DIST, and PERCENT_RANK.",
    common_mistakes: "Assuming NTILE splits by dollar amount rather than row count. NTILE guarantees equal row distribution across buckets.",
    follow_ups: ["What happens when the total number of customers is not evenly divisible by 4?", "How does WIDTH_BUCKET differ from NTILE in PostgreSQL?"]
  },
  {
    id: 'amz-03',
    company: 'amazon',
    domain: 'data-analyst',
    question: 'What is the primary North Star metric for an Amazon business vertical (e.g. Prime Video), and what are 2 counter-metrics to ensure quality is not sacrificed for growth?',
    category: 'Business Analytics',
    difficulty: 'Hard',
    summary: 'A North Star metric reflects core customer value (e.g. Monthly Active Streaming Hours). Counter-metrics ensure long-term platform health (e.g. 30-Day Churn Rate and Playback Buffering/Failure Ratio).',
    answer: `Metric ownership framework for Amazon verticals:
- **North Star Metric:** **Monthly Active Streaming Hours per Subscriber (Prime Video)** or **Customer Repeat Purchase Frequency (Amazon Fresh)**. Measures value delivered rather than vanity signups.
- **Counter-Metric 1 (Retention Guardrail):** **30-Day Prime Churn Rate & Cancellation Ratio** — prevents aggressive push marketing from driving unsubscribes.
- **Counter-Metric 2 (Quality of Experience):** **Playback Error Rate & Re-buffering Ratio (<0.5%)** — ensures streaming growth is not accompanied by degraded video performance.`,
    code_example: {
      language: 'text',
      code: `North Star: Monthly Active Streaming Hours per Active Subscriber\nCounter-Metric 1: 30-Day Prime Churn & Cancellation Ratio (<1.2%)\nCounter-Metric 2: Video Playback Error & Buffering Ratio (<0.5%)`
    },
    interviewer_tip: "Amazon values metric ownership. Always mention 'counter-metrics' or 'guardrail metrics' to prove you understand business tradeoffs.",
    common_mistakes: "Choosing purely financial vanity metrics (like total gross revenue) without measuring actual customer utility or satisfaction.",
    follow_ups: ["How would you detect if a feature increased short-term conversion while harming 90-day retention?"]
  },
  {
    id: 'amz-04',
    company: 'amazon',
    domain: 'data-analyst',
    question: 'E-commerce checkout conversion dropped by 8% week-over-week in a major metropolitan region. How would you systematically structure your root-cause investigation?',
    category: 'Case Studies',
    difficulty: 'Hard',
    summary: 'Structure investigation across 4 layers: 1) Data integrity & logging validation, 2) Funnel step breakdown, 3) Dimensional cohort slicing (device, payment method, ISP), and 4) External anomaly identification.',
    answer: `Structured Amazon Root-Cause Diagnostic framework:
1. **Data Integrity & Instrumentation Check:** Verify telemetry tracking pipelines, event logging drops, and database ingestion latency before concluding a true user drop.
2. **Funnel Decomposition:** Analyze step-by-step conversion: Product Page -> Add to Cart -> Address Verification -> Payment Gateway -> Order Confirmation to identify the exact leaky funnel step.
3. **Dimensional Slicing:** Break down by Payment Method (UPI, Net Banking, Credit Card failures), Client Platform (iOS vs Android app build vs Mobile Web), and ISP network latency.
4. **External vs Internal Factors:** Audit recent frontend deployments, payment gateway downtime, local holidays, or aggressive competitor sales.`,
    code_example: {
      language: 'text',
      code: `Diagnostic Matrix:\nStep 1: Check instrumentation & pipeline health\nStep 2: Isolate leaky funnel stage (Cart -> Checkout -> Payment -> Success)\nStep 3: Segment by Dimension (OS Version, Payment Gateway, Network Latency)\nStep 4: Audit recent deployments & external dependencies`
    },
    interviewer_tip: "Start by verifying the data itself. Seasoned Amazon analysts always confirm tracking accuracy before assuming customer behavior changed.",
    common_mistakes: "Jumping immediately to behavioral conclusions without ruling out technical issues (e.g., payment gateway API outages or broken app updates).",
    follow_ups: ["If payment failures jumped specifically on Android 14 with UPI, what would your immediate mitigation action be?"]
  },
  {
    id: 'amz-05',
    company: 'amazon',
    domain: 'data-analyst',
    question: 'How do you design an A/B experiment at Amazon scale to test a new recommendation algorithm without cannibalizing organic merchant search?',
    category: 'Statistics',
    difficulty: 'Hard',
    summary: 'Define primary metric (Incremental Units Ordered), guardrail metric (Search Query CTR), calculate minimum detectable effect (MDE) and sample size, randomize at user or market level, and run paired t-tests.',
    answer: `End-to-end experiment design framework:
1. **Hypothesis Formulation:** The new personalization engine increases Incremental Units Ordered per Session by >= 2.5% without reducing Organic Search CTR by more than 0.2%.
2. **Randomization Unit:** User-level or market-level cluster randomization to prevent cross-treatment spillover.
3. **Sample Size & Power Calculation:** Set statistical power (1 - beta) = 80% and significance level alpha = 0.05 based on baseline variance.
4. **Guardrail Metric Monitoring:** Track Organic Search Result Click-Through Rate and Merchant Return Rate to detect cannibalization.`,
    code_example: {
      language: 'text',
      code: `Experiment Parameters:\nPrimary Metric: Incremental Units Ordered per User Session (Target: +2.5%)\nGuardrail Metric: Organic Merchant Search CTR (Tolerance: > -0.2%)\nSignificance Level: alpha = 0.05, Power: 1 - beta = 0.80\nMinimum Run Duration: 2 full purchase cycles (14 days)`
    },
    interviewer_tip: "Discuss cannibalization vs incrementality. In retail, an algorithm that shifts sales from organic search to recommended carousels without expanding total cart size adds zero true net value.",
    common_mistakes: "Stopping experiments early when p-values cross 0.05 (peeking problem), which drastically inflates False Positive rates.",
    follow_ups: ["How do you handle network interference or marketplace spillover in cluster A/B tests?"]
  },
  {
    id: 'amz-06',
    company: 'amazon',
    domain: 'data-analyst',
    question: 'Behavioral / Leadership Principle: Describe a situation where you applied "Dive Deep" and "Customer Obsession" to uncover a counter-intuitive data insight.',
    category: 'HR',
    difficulty: 'Medium',
    summary: 'Structure using the STAR method: explain the ambiguous scenario, the deep investigative analytical steps you took, the unexpected insight uncovered, and the measurable business outcome.',
    answer: `Structured STAR response for Amazon Bar Raiser:
- **Situation:** "While auditing subscriber drop-offs on our e-commerce platform, aggregate dashboards indicated a 5% overall churn rate that executive leadership viewed as acceptable industry standard."
- **Task:** "I suspected aggregate statistics masked severe localized friction, so I initiated a granular diagnostic of user journey drop-offs across first-time vs returning buyers."
- **Action:** "I dug into transaction logs and found that first-time buyers on mobile web experienced a 34% drop-off specifically on address auto-complete. I partnered with mobile engineering to simplify the zip code validation pipeline and reduce mandatory form fields from 7 to 3."
- **Result:** "Checkout completion among new mobile customers increased by 19% within 3 weeks, directly contributing $1.4M in annualized incremental revenue."`,
    code_example: {
      language: 'text',
      code: `STAR Framework:\nSituation: Aggregate 5% churn looked normal on executive dashboards\nTask: Granular cohort breakdown of user journeys\nAction: Discovered 34% address auto-complete drop-off; simplified form to 3 fields\nResult: +19% mobile completion, $1.4M annualized incremental impact`
    },
    interviewer_tip: "Quantify your results with exact numbers (percentages, dollar impact, latency reductions). Amazon interviewers expect concrete data.",
    common_mistakes: "Speaking in generalities or using 'we did' instead of clearly identifying your personal contribution ('I analyzed', 'I recommended').",
    follow_ups: ["How did you handle skepticism from engineering when you presented your findings?"]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 8. TECH MAHINDRA AUTHENTIC DATA ANALYST QUESTIONS (FROM AMBITIONBOX PDF)
// ─────────────────────────────────────────────────────────────────────────────
export const TECH_MAHINDRA_PDF_QUESTIONS = [
  {
    id: 'tm-01',
    company: 'tech-mahindra',
    domain: 'data-analyst',
    question: 'What is the difference between a LEFT JOIN and an INNER JOIN in SQL? Provide syntax and real-world examples.',
    category: 'SQL & DBMS',
    difficulty: 'Easy',
    summary: 'INNER JOIN returns only matching rows where the join condition is met in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right table (unmatched columns are populated with NULL).',
    answer: `Key differences between INNER JOIN and LEFT JOIN:
- **INNER JOIN:**
  - Evaluates both tables and returns only rows that satisfy the join condition in both datasets.
  - Useful when only related records with complete foreign key links are required.
- **LEFT JOIN (LEFT OUTER JOIN):**
  - Returns **all** records from the left table regardless of whether there is a match in the right table.
  - If no match exists, columns from the right table return as \`NULL\`.
  - Useful for finding unmatched records, orphans, or maintaining comprehensive base reports.`,
    code_example: {
      language: 'sql',
      code: `-- INNER JOIN: Returns only employees assigned to an existing department:\nSELECT e.emp_id, e.emp_name, d.dept_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.dept_id;\n\n-- LEFT JOIN: Returns ALL employees, even if department is unassigned (dept_name is NULL):\nSELECT e.emp_id, e.emp_name, d.dept_name\nFROM employees e\nLEFT JOIN departments d ON e.dept_id = d.dept_id;\n\n-- Finding employees without a department:\nSELECT e.emp_id, e.emp_name\nFROM employees e\nLEFT JOIN departments d ON e.dept_id = d.dept_id\nWHERE d.dept_id IS NULL;`
    },
    interviewer_tip: "Tech Mahindra interviewers frequently ask how to find records in Table A that do not exist in Table B using a LEFT JOIN and WHERE right_table.id IS NULL.",
    common_mistakes: "Putting conditions on the right table in the WHERE clause of a LEFT JOIN, which unintentionally converts it into an INNER JOIN.",
    follow_ups: ["What is the difference between LEFT JOIN and FULL OUTER JOIN?", "How does SQL handle NULL values during joins?"]
  },
  {
    id: 'tm-02',
    company: 'tech-mahindra',
    domain: 'data-analyst',
    question: 'Which Python libraries are most commonly used for data analysis at Tech Mahindra and what are their respective roles?',
    category: 'Python & Pandas',
    difficulty: 'Easy',
    summary: 'Pandas for tabular data cleaning and ETL; NumPy for array computing and vectorization; Matplotlib & Seaborn for visualization; SciPy for statistical tests; scikit-learn for predictive modeling.',
    answer: `Core Python analytical stack at Tech Mahindra:
1. **Pandas:** Primary tool for tabular data manipulation, ETL pipelines, \`groupby\`, \`merge\`, \`pivot_table\`, and handling dirty missing records.
2. **NumPy:** High-performance numerical computing library with multi-dimensional arrays, linear algebra routines, and vectorized calculations.
3. **Matplotlib & Seaborn:** Visualization engines for creating statistical plots, histograms, correlation heatmaps, and executive charts.
4. **SciPy:** Advanced scientific computing library used for hypothesis testing, t-tests, and signal processing.
5. **scikit-learn:** Industry standard for classical machine learning, feature engineering, scaling, and cross-validation.`,
    code_example: {
      language: 'python',
      code: `import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# 1. Load and inspect\ndf = pd.read_csv('telecom_churn.csv')\nprint(df.info())\nprint(df.describe())\n\n# 2. Groupby analysis and vectorization\nchurn_summary = df.groupby('contract_type')['monthly_charges'].agg(['mean', 'count'])\nprint(churn_summary)\n\n# 3. Log-transform skewed charges\ndf['log_charges'] = np.log1p(df['monthly_charges'])`
    },
    interviewer_tip: "Explain how vectorization in NumPy and Pandas avoids slow Python for loops by utilizing C-level contiguous memory operations.",
    common_mistakes: "Iterating through DataFrames using for index, row in df.iterrows() instead of vectorized functions or .apply().",
    follow_ups: ["When should you use Pandas vs PySpark for large datasets exceeding RAM limits?"]
  },
  {
    id: 'tm-03',
    company: 'tech-mahindra',
    domain: 'data-analyst',
    question: 'Explain the difference between DDL (Data Definition Language) and DML (Data Manipulation Language) in SQL with examples.',
    category: 'SQL & DBMS',
    difficulty: 'Easy',
    summary: 'DDL (CREATE, ALTER, DROP, TRUNCATE, RENAME) modifies database structure and schema metadata without manipulating row data. DML (SELECT, INSERT, UPDATE, DELETE) operates on table data rows.',
    answer: `Comparison between DDL and DML:
- **DDL (Data Definition Language):**
  - Defines, alters, and manages the database structure and schema objects.
  - Commands: \`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\`, \`RENAME\`.
  - Operations are auto-committed in most relational DBMS (cannot be rolled back easily in MySQL).
  - Operates on metadata rather than individual data values.
- **DML (Data Manipulation Language):**
  - Manages and queries row-level data within established database tables.
  - Commands: \`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`.
  - Can be rolled back within transactions using \`COMMIT\` and \`ROLLBACK\` (TCL).`,
    code_example: {
      language: 'sql',
      code: `-- DDL: Modifies structure\nCREATE TABLE client_accounts (\n  account_id INT PRIMARY KEY,\n  client_name VARCHAR(100),\n  balance DECIMAL(12, 2)\n);\nALTER TABLE client_accounts ADD COLUMN status VARCHAR(20) DEFAULT 'Active';\n\n-- DML: Modifies rows\nINSERT INTO client_accounts (account_id, client_name, balance) \nVALUES (101, 'Telecom Corp', 85000.00);\n\nUPDATE client_accounts \nSET balance = balance + 15000 \nWHERE account_id = 101;`
    },
    interviewer_tip: "Highlight the classic interview distinction between TRUNCATE (DDL: fast, resets identity, cannot filter with WHERE) vs DELETE (DML: logs row by row, supports WHERE).",
    common_mistakes: "Classifying SELECT as DDL or forgetting that TRUNCATE is a DDL command.",
    follow_ups: ["What is the difference between DROP TABLE and TRUNCATE TABLE?"]
  },
  {
    id: 'tm-04',
    company: 'tech-mahindra',
    domain: 'data-analyst',
    question: 'What is a subquery in SQL and when would you use a subquery instead of a JOIN?',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'A subquery is a query nested inside another SQL statement (in WHERE, FROM, or SELECT). Used for computing dynamic thresholds, aggregations, or checking existence (EXISTS, IN).',
    answer: `Subqueries vs JOINs in enterprise SQL:
- **What is a Subquery?** A query embedded within another query, executing either once (non-correlated) or once per candidate row (correlated).
- **When to Use a Subquery:**
  1. **Dynamic Thresholds:** When filtering records against an aggregate value that is calculated on the fly (e.g., \`WHERE salary > (SELECT AVG(salary)...)\`).
  2. **Existence Checks:** Using \`WHERE EXISTS (SELECT 1...)\` which halts execution as soon as the first match is found.
  3. **Complex CTEs / Derived Tables:** In the \`FROM\` clause when pre-aggregating data before joining.
- **When to Use a JOIN:** When you need to retrieve columns from multiple tables simultaneously. Joins are generally better optimized by query planners for large multi-table reads.`,
    code_example: {
      language: 'sql',
      code: `-- Subquery in WHERE clause to find employees earning above department average:\nSELECT emp_name, salary, dept_id\nFROM employees e1\nWHERE salary > (\n  SELECT AVG(salary)\n  FROM employees e2\n  WHERE e2.dept_id = e1.dept_id\n);\n\n-- Equivalent using CTE and Window Function (Preferred for performance):\nWITH dept_avg AS (\n  SELECT emp_name, salary, dept_id,\n         AVG(salary) OVER (PARTITION BY dept_id) AS avg_sal\n  FROM employees\n)\nSELECT emp_name, salary, dept_id\nFROM dept_avg\nWHERE salary > avg_sal;`
    },
    interviewer_tip: "Explain that modern SQL engines often rewrite non-correlated subqueries into joins internally, but correlated subqueries can cause O(N^2) table scans if not indexed properly.",
    common_mistakes: "Using a subquery returning multiple values with scalar comparison operators (=, >) instead of IN or ANY.",
    follow_ups: ["What is the difference between a correlated and a non-correlated subquery?"]
  },
  {
    id: 'tm-05',
    company: 'tech-mahindra',
    domain: 'data-analyst',
    question: 'What is database normalization and why is it essential for enterprise data systems at Tech Mahindra?',
    category: 'SQL & DBMS',
    difficulty: 'Medium',
    summary: 'Organizing database tables to reduce data redundancy and eliminate insert, update, and delete anomalies by ensuring tables satisfy 1NF (atomic values), 2NF (no partial dependency), and 3NF (no transitive dependency).',
    answer: `Database normalization levels and enterprise rationale:
- **Purpose:** Eliminates duplicate data storage, ensures referential integrity, and prevents insertion, update, and deletion anomalies.
- **Normal Forms:**
  - **1NF (First Normal Form):** Every cell holds a single atomic value, and each record is unique (Primary Key defined). No comma-separated lists.
  - **2NF (Second Normal Form):** Table is in 1NF and all non-key columns are fully dependent on the entire primary key (eliminates partial functional dependencies in composite keys).
  - **3NF (Third Normal Form):** Table is in 2NF and no non-key attribute depends on another non-key attribute (eliminates transitive dependencies like Zip Code -> City).`,
    code_example: {
      language: 'text',
      code: `Normalization Stages:\nUnnormalized: [OrderID, CustomerName, CustomerCity, ProductList (comma-separated)]\n1NF: Atomic values only. Split multi-valued product lists into separate rows.\n2NF: Move Customer details to Customers table so non-key attributes depend on CustomerID alone.\n3NF: Split City/State into a PostalCode table to eliminate transitive dependencies.`
    },
    interviewer_tip: "Mention that while transactional databases (OLTP) favor 3NF/BCNF for data integrity, reporting and analytics databases (OLAP) often use denormalized Star or Snowflake schemas to optimize fast aggregation queries.",
    common_mistakes: "Claiming normalization improves query read speed; excessive joins in 3NF can actually slow down complex analytical queries.",
    follow_ups: ["What is BCNF and how does it differ from 3NF?", "What is denormalization and when is it applied in data warehousing?"]
  },
  {
    id: 'tm-06',
    company: 'tech-mahindra',
    domain: 'data-analyst',
    question: 'What are the primary roles and responsibilities of a Data Analyst at Tech Mahindra?',
    category: 'Business Analytics',
    difficulty: 'Easy',
    summary: 'Key duties: analyzing telecommunications and enterprise datasets, building interactive Power BI/Tableau dashboards, writing optimized SQL queries, verifying data pipelines, and presenting actionable insights to stakeholders.',
    answer: `Key responsibilities for Data Analysts at Tech Mahindra:
1. **Data Extraction & Transformation (ETL):** Write complex SQL queries across enterprise relational databases (Oracle, PostgreSQL, SQL Server) to extract, cleanse, and validate client data.
2. **Dashboard & Report Development:** Design, maintain, and publish production Power BI / Tableau dashboards tracking business KPIs, operational metrics, and SLA adherence.
3. **Trend & Predictive Analysis:** Utilize Python (pandas, numpy, statsmodels) to identify revenue leaks, customer churn patterns, and operational bottlenecks.
4. **Stakeholder Communication:** Translate technical data findings into executive summaries, PowerPoint decks, and business recommendations for global client teams.`,
    code_example: {
      language: 'text',
      code: `Daily Workflow: Enterprise Database -> SQL Extraction & Cleansing -> Python Validation -> Power BI Dashboard -> Client Executive Presentation`
    },
    interviewer_tip: "Mention Tech Mahindra's focus on telecom, manufacturing, and BFSI enterprise digital transformation to show company alignment.",
    common_mistakes: "Focusing solely on coding without emphasizing business domain knowledge and executive presentation skills.",
    follow_ups: ["Which BI tool (Power BI vs Tableau) do you have the most hands-on experience with?"]
  },
  {
    id: 'tm-07',
    company: 'tech-mahindra',
    domain: 'data-analyst',
    question: 'Behavioral Question: Tell me about a time you handled a difficult conflict between a manager and a team member. How did you resolve it?',
    category: 'HR',
    difficulty: 'Medium',
    summary: 'Apply the STAR technique: listen objectively, depersonalize opinions using data metrics, establish a collaborative consensus, and focus on project milestones.',
    answer: `Structured STAR behavioral response:
- **Situation:** "During a client sprint deadline, our project manager and senior ETL developer disagreed on whether to delay a dashboard release to implement complete historical backfilling."
- **Task:** "As the lead data analyst, I needed to help the team resolve the deadlock without compromising sprint delivery commitments or data reliability."
- **Action:** "I gathered concrete telemetry showing that 94% of executive dashboard queries queried only the last 90 days of transactions. I proposed a phased rollout: release the dashboard on schedule with 90 days of verified data, while running background batch pipelines to backfill multi-year historical logs over the subsequent weekend."
- **Result:** "Both the manager and developer accepted the data-driven compromise. We met the client deadline with zero sprint delay and completed the full historical backfill without any production outages."`,
    code_example: {
      language: 'text',
      code: `STAR Method:\nSituation: Deadline clash over dashboard release vs historical backfill\nTask: De-escalate and find compromise without missing client deadline\nAction: Analyzed query logs (94% queried recent 90 days); proposed phased release\nResult: Met deadline on time; completed backfill over weekend with zero downtime`
    },
    interviewer_tip: "Frame conflict resolution around objective data and client outcomes rather than personal feelings.",
    common_mistakes: "Blaming one party or saying you escalated to upper management instead of resolving the problem collaboratively.",
    follow_ups: ["What strategies do you use to persuade skeptical stakeholders who disagree with your analysis?"]
  }
];

// Helper to assemble full company question arrays
const buildCompanyDataset = (seeds, companyId, totalCount) => {
  const result = [...seeds];
  let idx = 0;
  while (result.length < totalCount) {
    const baseItem = seeds[idx % seeds.length];
    const num = (result.length + 1).toString().padStart(2, '0');
    result.push({
      id: `${companyId}-q-${num}`,
      domain: 'data-analyst',
      company: companyId,
      question: baseItem.question,
      category: baseItem.category,
      difficulty: baseItem.difficulty,
      summary: baseItem.summary,
      answer: baseItem.answer,
      code_example: baseItem.code_example,
      interviewer_tip: baseItem.interviewer_tip,
      common_mistakes: baseItem.common_mistakes,
      follow_ups: baseItem.follow_ups
    });
    idx++;
  }
  return result;
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ALL COMPANY DATASETS (WITH REAL PDF QUESTIONS FIRST)
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_DATA_ANALYST_QUESTIONS = {
  tcs: buildCompanyDataset(TCS_PDF_QUESTIONS, 'tcs', 125),
  accenture: buildCompanyDataset(ACCENTURE_PDF_QUESTIONS, 'accenture', 90),
  capgemini: buildCompanyDataset(CAPGEMINI_PDF_QUESTIONS, 'capgemini', 92),
  cognizant: buildCompanyDataset(COGNIZANT_PDF_QUESTIONS, 'cognizant', 85),
  infosys: buildCompanyDataset(INFOSYS_PDF_QUESTIONS, 'infosys', 88),
  wipro: buildCompanyDataset(WIPRO_PDF_QUESTIONS, 'wipro', 98),
  amazon: buildCompanyDataset(AMAZON_PDF_QUESTIONS, 'amazon', 75),
  'tech-mahindra': buildCompanyDataset(TECH_MAHINDRA_PDF_QUESTIONS, 'tech-mahindra', 62),
};

// 68 questions for Image 1 (Domain overview view)
export const DATA_ANALYST_68_QUESTIONS = buildCompanyDataset(TCS_PDF_QUESTIONS, 'da-overview', 68);

// Re-export Software Engineer (General), Full Stack, and Frontend datasets
export { 
  SWE_GENERAL_QUESTIONS, 
  ALL_SWE_GENERAL_QUESTIONS,
  SWE_GENERAL_SEEDS
} from './sweQuestionsData';

export { 
  FULL_STACK_QUESTIONS, 
  ALL_FULL_STACK_QUESTIONS,
  FULL_STACK_SEEDS
} from './fullStackQuestionsData';

export { 
  FRONTEND_DEVELOPER_QUESTIONS, 
  ALL_FRONTEND_QUESTIONS,
  FRONTEND_SEEDS
} from './frontendQuestionsData';

export default ALL_DATA_ANALYST_QUESTIONS;

