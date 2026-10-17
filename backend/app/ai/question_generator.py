"""
Question Generator — Uses Qwen3 via LLM service to generate interview questions.

Falls back to FALLBACK_QUESTIONS dict when LLM is unavailable.
"""

import logging
from typing import List, Optional

from app.ai.llm_service import call_llm_json
from app.ai.prompt_templates import (
    behavioral_question_prompt,
    hr_question_prompt,
    resume_question_prompt,
    technical_question_prompt,
)

logger = logging.getLogger(__name__)

# ── Fallback Question Bank ────────────────────────────────────────────────────
# Used when LLM is unavailable (no token, API down, AI_MOCK_MODE=true)

FALLBACK_QUESTIONS = {
    "Technical": {
        "Software Engineer": [
            "Explain the difference between a process and a thread, and how they share resources.",
            "What is a hash table? Explain how collision resolution works in hash tables.",
            "Describe the REST architectural style and its six key constraints.",
            "What are the differences between SQL and NoSQL databases? When would you choose each?",
            "Explain Big O notation and analyze the time complexity of merge sort.",
        ],
        "React Developer": [
            "Explain the virtual DOM and how React's reconciliation algorithm works.",
            "What are React Hooks? Describe the rules of hooks and explain useEffect.",
            "How do you manage global state in a large React app? Compare Redux with Context API.",
            "What is the difference between controlled and uncontrolled components in React?",
            "Explain Server Components in Next.js and how they differ from Client Components.",
        ],
        "Python Developer": [
            "What is the GIL in Python, and how does it affect multi-threading performance?",
            "Explain list comprehensions vs generators — when would you use a generator?",
            "How does Python's garbage collection and reference counting work?",
            "What are decorators in Python? Write a simple logging decorator.",
            "Explain the difference between shallow copy and deep copy in Python.",
        ],
        "Data Scientist": [
            "Explain the bias-variance tradeoff and how it affects model selection.",
            "What is gradient descent and how does learning rate affect convergence?",
            "Describe the differences between precision, recall, and F1 score.",
            "How do you handle class imbalance in a classification problem?",
            "Explain regularization (L1 vs L2) and when to use each.",
        ],
        "DevOps Engineer": [
            "Explain the difference between Docker containers and virtual machines.",
            "What is Kubernetes and how does it orchestrate containerized applications?",
            "Describe a CI/CD pipeline and the key stages involved.",
            "What is infrastructure as code and how does Terraform implement it?",
            "Explain blue-green deployment and canary releases.",
        ],
        "Data Analyst": [
            "Can you describe your basic computer skills and analytical toolkit with MS Excel, SQL, and Python or Power BI?",
            "What is the difference between Aggregate and Scalar functions in SQL? Give practical examples.",
            "Explain Row-Level Security (RLS) in Power BI and how you implement Dynamic RLS with USERPRINCIPALNAME().",
            "What is the difference between a Purchase Requisition (PR) and a Purchase Order (PO) in enterprise business systems?",
            "How do you handle missing values, duplicates, and outliers using IQR in Python Pandas or Excel?",
            "Write a SQL query to find the 2nd highest salary from an Employee table without using LIMIT or TOP.",
            "What is the difference between Power BI and Tableau: advantages and limitations of both?",
            "What are the primary roles and responsibilities of a Data Analyst at TCS?",
            "What is SAP MM and what are its main functions in procurement and inventory control?",
            "Explain SQL Joins (INNER, LEFT, RIGHT, FULL OUTER) and explain what 3-way matching is.",
        ],
    },
    "TCS Data Analyst": [
        "Can you describe your basic computer skills and analytical toolkit with MS Excel, SQL, and Python for enterprise reporting?",
        "What is SAP MM and what are its main functions in enterprise procurement and inventory management?",
        "What is the difference between a Purchase Requisition (PR) and a Purchase Order (PO) in enterprise business systems?",
        "What is the difference between a Purchase Order (PO) and a Goods Receipt (GR), and how does 3-way matching operate?",
        "What is data and what are its main classifications: Structured, Semi-structured, and Unstructured?",
        "What are the key roles & responsibilities of a Data Analyst at TCS when delivering solutions to enterprise clients?",
        "Explain the functions in SQL (Aggregate vs Scalar) and write an example combining both in a single query.",
        "What is the difference between Power BI and Tableau: what are the key advantages and limitations of both?",
        "What is Row-Level Security (RLS) in Power BI and how do you implement Dynamic RLS using USERPRINCIPALNAME()?",
        "Explain SQL Constraints (Primary Key, Foreign Key, Unique) and types of Joins (Inner, Left, Right, Full Outer).",
        "Write a SQL query to find the 2nd highest salary from an Employee table without using LIMIT or TOP.",
        "How do you perform data cleaning and validation in Python using Pandas (handling missing values, deduplication, IQR outliers)?",
        "Why do you want to join TCS as a Data Analyst?",
    ],
    "TCS": [
        "What is the difference between Call by Value and Call by Reference in C/C++ and Java?",
        "Explain the concept of Method Overloading vs Method Overriding with a pseudocode example.",
        "What are primary keys, foreign keys, and unique keys in SQL databases?",
        "Explain the memory architecture in C/C++/Java (Stack memory vs Heap memory).",
        "How would you find duplicate elements in an array with O(n) time complexity?",
        "Explain ACID properties in database management system (DBMS).",
        "What is the difference between static binding and dynamic binding in OOPs?",
    ],
    "Capgemini": [
        "Explain the core 4 pillars of Object-Oriented Programming (OOPs) with practical examples.",
        "What is the difference between Abstract Classes and Interfaces in Java/C++?",
        "Explain how Exception Handling works using try, catch, finally, and throw blocks.",
        "How would you reverse a linked list or string in-place without using extra space?",
        "Explain SQL Joins (INNER, LEFT, RIGHT, FULL OUTER) with example tables.",
        "What is the difference between String, StringBuilder, and StringBuffer in Java?",
        "Explain how memory management and Garbage Collection operate in modern languages.",
    ],
    "Banking & FinTech": [
        "In financial transaction processing, how do you ensure strict ACID compliance and prevent race conditions?",
        "How would you design an idempotent payment processing API to handle network retries cleanly?",
        "Explain the difference between Symmetric and Asymmetric encryption, and how HTTPS/TLS protects bank data.",
        "How do you handle microservices transaction consistency across multiple databases (Saga Pattern vs 2PC)?",
        "What strategies do you use for high-availability database replication and zero-downtime failover?",
    ],
    "Cloud & DevOps": [
        "Explain the lifecycle of a Kubernetes Pod and how self-healing deployments work.",
        "How do you secure secrets and sensitive API credentials in CI/CD pipelines?",
        "Describe how Blue-Green and Canary deployment strategies minimize risk in production.",
        "What is Infrastructure as Code (IaC) and how do Terraform state files manage infrastructure drift?",
        "Explain reverse proxies (like NGINX) and load balancer algorithms (Round Robin, Least Connections).",
    ],
    "Wipro": [
        "Explain the differences between procedural programming and Object-Oriented Programming (OOPs).",
        "What are the differences between method overloading and method overriding in Java/C++?",
        "How does garbage collection work in modern managed runtimes, and can you force garbage collection?",
        "Explain linear data structures versus non-linear data structures with practical use cases.",
        "What are aggregate functions in SQL and how do GROUP BY and HAVING clauses differ?",
        "How would you detect if a string is an anagram of another string in optimal time complexity?",
    ],
    "Infosys": [
        "Explain the difference between binary search and linear search. What are the prerequisites for binary search?",
        "What are database indexes, and how do B-Trees optimize data retrieval?",
        "Explain the difference between abstract classes and interfaces in Java 8+.",
        "Describe the concept of recursion and how stack overflow occurs if base conditions are missing.",
        "What is normalisation in relational databases, and why do we normalize up to 3NF?",
        "How do you find the second largest element in an unsorted array in single traversal (O(n))?",
    ],
    "Accenture": [
        "Explain the architectural differences between Monolithic and Microservices architectures.",
        "What is the difference between synchronous and asynchronous communication in distributed systems?",
        "Explain RESTful API design principles, idempotency of HTTP methods, and status codes.",
        "What is the role of caching layers (like Redis or Memcached) and how do cache eviction policies work?",
        "How do relational databases maintain ACID transactions during concurrent multi-user writes?",
        "Explain the Singleton design pattern and how to make it thread-safe.",
    ],
    "Cognizant": [
        "Explain how memory is allocated for variables and objects in Stack memory versus Heap memory.",
        "What are the differences between SQL and NoSQL databases, and when is MongoDB preferred over MySQL?",
        "Explain the concept of multithreading, race conditions, and how thread synchronization prevents deadlocks.",
        "How do you implement binary tree traversals (Inorder, Preorder, Postorder) iteratively and recursively?",
        "What is the purpose of database transactions and what is the difference between COMMIT and ROLLBACK?",
        "Explain the difference between compile-time errors, run-time errors, and logical errors.",
    ],
    "Python": [
        "Explain the Global Interpreter Lock (GIL) in CPython and how it affects CPU-bound vs I/O-bound tasks.",
        "What are Python generators and iterators? How does the 'yield' keyword differ from 'return'?",
        "Explain how memory management and cyclic garbage collection work in Python.",
        "What are decorators in Python and how do you write a decorator with arguments?",
        "Explain *args, **kwargs, and how argument unpacking operates in function definitions.",
        "What is the difference between deepcopy and shallow copy in Python?",
    ],
    "Java": [
        "Explain the internal architecture of the JVM, including ClassLoader, JVM Memory Areas, and Execution Engine.",
        "What is the difference between String, StringBuilder, and StringBuffer in terms of mutability and thread safety?",
        "How does the Java Collections Framework organize List, Set, and Map? How does HashMap resolve collisions in Java 8+?",
        "Explain how Exception Handling works with try-with-resources and custom checked/unchecked exceptions.",
        "What are Java Streams and Lambda expressions? Explain the difference between intermediate and terminal operations.",
        "Explain the concept of volatile keyword and synchronized blocks in multithreading.",
    ],
    "DSA": [
        "Explain how hash tables achieve average O(1) time complexity and compare chaining vs open addressing for collision resolution.",
        "How would you detect and remove a cycle in a singly linked list (Floyd's Cycle-Finding Algorithm)?",
        "Explain the difference between Breadth-First Search (BFS) and Depth-First Search (DFS) with time/space complexities.",
        "What is dynamic programming and how do memoization (top-down) and tabulation (bottom-up) compare?",
        "Explain the difference between QuickSort and MergeSort. Which one is stable and why?",
        "How does a Binary Search Tree (BST) differ from a balanced AVL or Red-Black Tree?",
    ],
    "DBMS": [
        "Explain the 4 ACID properties in DBMS and what isolation levels prevent dirty reads and phantom reads.",
        "What is the difference between Clustered and Non-Clustered Indexes in relational databases?",
        "Explain Database Normalization from 1NF, 2NF, 3NF to BCNF with concrete schema examples.",
        "What are SQL Joins (INNER, LEFT, RIGHT, FULL OUTER, CROSS)? Write an example of a self-join.",
        "Explain the difference between optimistic concurrency control and pessimistic locking in databases.",
        "What is database sharding versus replication, and how do read replicas scale query throughput?",
    ],
    "Operating Systems": [
        "Explain the core differences between a Process and a Thread, and what resources are shared between threads.",
        "What is Virtual Memory, paging, and how does page fault handling work with TLB?",
        "Explain the 4 Coffman conditions required for a Deadlock to occur and how deadlock prevention works.",
        "Compare CPU scheduling algorithms: First-Come-First-Served, Round Robin, and Shortest Job First.",
        "What is a system call, and what transitions occur between user mode and kernel mode?",
        "Explain Inter-Process Communication (IPC) mechanisms such as pipes, message queues, and shared memory.",
    ],
    "OOP": [
        "Walk me through the 4 fundamental pillars of OOP — Abstraction, Encapsulation, Inheritance, and Polymorphism.",
        "Explain the difference between Abstraction and Encapsulation with real-world examples.",
        "What are SOLID design principles? Explain the Single Responsibility Principle and Open/Closed Principle.",
        "What is the difference between Composition and Inheritance? Why is composition often favored?",
        "Explain Method Overloading (Compile-time polymorphism) vs Method Overriding (Run-time polymorphism).",
        "What is an abstract class and how does it differ from an interface?",
    ],
    "Web Development": [
        "Explain the Critical Rendering Path: what happens from the moment a browser enters a URL to pixels on screen?",
        "What is the DOM and Virtual DOM? How do modern frontend frameworks optimize UI re-rendering?",
        "Explain the differences between Cookies, SessionStorage, and LocalStorage, and how CORS protects web apps.",
        "What are WebSockets and how do they differ from HTTP Long Polling and Server-Sent Events (SSE)?",
        "How do you optimize web application performance (lazy loading, code splitting, asset compression, CDN)?",
        "Explain common web security vulnerabilities such as Cross-Site Scripting (XSS) and CSRF, and how to mitigate them.",
    ],
    "Machine Learning": [
        "Explain the bias-variance tradeoff and what techniques you use to prevent model overfitting.",
        "How does Gradient Descent work, and what are the differences between Batch, Mini-batch, and Stochastic Gradient Descent?",
        "Explain the difference between classification metrics: Precision, Recall, F1-Score, and ROC-AUC.",
        "What is the difference between L1 (Lasso) and L2 (Ridge) regularization, and how do they affect model weights?",
        "Explain the difference between supervised, unsupervised, and reinforcement learning with examples.",
        "What is transfer learning in deep learning and when would you fine-tune a pre-trained transformer model?",
    ],
    "HR": [
        "Tell me about yourself and why you are interested in this position.",
        "What are your greatest professional strengths and one area you are actively improving?",
        "Where do you see yourself professionally in three to five years?",
        "Why should we choose you over other qualified candidates?",
        "Describe a time you had a disagreement with a colleague and how you resolved it.",
    ],
    "Behavioral": [
        "Describe a challenging project you worked on. What was your role and how did you handle obstacles?",
        "Tell me about a time you made a significant mistake at work. How did you handle it and what did you learn?",
        "Give an example of when you had to deliver results under extreme time pressure.",
        "Describe a situation where you had to influence others without formal authority.",
        "Tell me about a time you proactively identified and solved a problem before it escalated.",
    ],
}


def _get_fallback_questions(
    role: str,
    interview_type: str,
    num_questions: int,
    resume_text: Optional[str],
    company_domain: Optional[str] = None,
) -> List[str]:
    """Return fallback questions from the hardcoded bank."""
    questions: List[str] = []

    domain_str = (company_domain or "").lower()
    role_lower = (role or "").lower()
    is_data_analyst = "analyst" in role_lower or "data" in role_lower or "analytics" in role_lower or "bi" in role_lower

    if "tcs" in domain_str and is_data_analyst:
        questions = list(FALLBACK_QUESTIONS["TCS Data Analyst"])
    elif "tcs" in domain_str:
        questions = list(FALLBACK_QUESTIONS["TCS"])
    elif is_data_analyst:
        questions = list(FALLBACK_QUESTIONS["Technical"]["Data Analyst"])
    elif "wipro" in domain_str:
        questions = list(FALLBACK_QUESTIONS["Wipro"])
    elif "infosys" in domain_str:
        questions = list(FALLBACK_QUESTIONS["Infosys"])
    elif "capgemini" in domain_str:
        questions = list(FALLBACK_QUESTIONS["Capgemini"])
    elif "accenture" in domain_str:
        questions = list(FALLBACK_QUESTIONS["Accenture"])
    elif "cognizant" in domain_str:
        questions = list(FALLBACK_QUESTIONS["Cognizant"])
    elif "banking" in domain_str or "fintech" in domain_str:
        questions = list(FALLBACK_QUESTIONS["Banking & FinTech"])
    elif "cloud" in domain_str or "devops" in domain_str:
        questions = list(FALLBACK_QUESTIONS["Cloud & DevOps"])
    elif "dsa" in domain_str or "algorithm" in domain_str:
        questions = list(FALLBACK_QUESTIONS["DSA"])
    elif "dbms" in domain_str or "database" in domain_str or "sql" in domain_str:
        questions = list(FALLBACK_QUESTIONS["DBMS"])
    elif "operating system" in domain_str or "os" == domain_str:
        questions = list(FALLBACK_QUESTIONS["Operating Systems"])
    elif "oop" in domain_str or "object" in domain_str:
        questions = list(FALLBACK_QUESTIONS["OOP"])
    elif "web" in domain_str or "frontend" in domain_str:
        questions = list(FALLBACK_QUESTIONS["Web Development"])
    elif "machine learning" in domain_str or "ml" in domain_str or "ai" in domain_str:
        questions = list(FALLBACK_QUESTIONS["Machine Learning"])
    elif "python" in domain_str:
        questions = list(FALLBACK_QUESTIONS["Python"])
    elif "java" in domain_str:
        questions = list(FALLBACK_QUESTIONS["Java"])
    elif "hr" in domain_str or "behavioral" in domain_str or interview_type in ("HR", "Behavioral"):
        questions = list(FALLBACK_QUESTIONS.get(interview_type, FALLBACK_QUESTIONS["HR"]))
    elif interview_type == "Technical":
        # Find best matching role
        role_key = "Software Engineer"
        role_lower = role.lower()
        for k in FALLBACK_QUESTIONS["Technical"]:
            if k.lower() in role_lower or any(
                w in role_lower for w in k.lower().split()
            ):
                role_key = k
                break
        questions = list(FALLBACK_QUESTIONS["Technical"][role_key])
    elif interview_type in FALLBACK_QUESTIONS:
        questions = list(FALLBACK_QUESTIONS[interview_type])
    else:
        questions = list(FALLBACK_QUESTIONS["HR"])

    # Prepend a resume-specific question if resume is available
    if resume_text and len(resume_text.strip()) > 50:
        questions.insert(
            0,
            "Based on your resume, could you walk me through the most technically challenging project you've listed and what your specific contributions were?",
        )

    return questions[:num_questions]


# ── Public API ────────────────────────────────────────────────────────────────

async def generate_questions(
    role: str,
    experience_level: str,
    interview_type: str,
    resume_text: Optional[str] = None,
    num_questions: int = 5,
) -> List[str]:
    """
    Generate interview questions using Qwen3 via LLM service.
    Falls back to FALLBACK_QUESTIONS on LLM failure.

    interview_type: "Technical" | "HR" | "Behavioral"
    """
    logger.info(
        "Generating %d %s questions for role: %s (%s level)",
        num_questions,
        interview_type,
        role,
        experience_level,
    )

    # Build the appropriate prompt
    if interview_type == "Technical":
        # Summarise resume skills (first 600 chars) for the prompt
        resume_skills = None
        if resume_text and resume_text.strip():
            resume_skills = resume_text.strip()[:600]
        prompt = technical_question_prompt(role, experience_level, resume_skills, num_questions)
    elif interview_type == "HR":
        prompt = hr_question_prompt(role, num_questions)
    elif interview_type == "Behavioral":
        prompt = behavioral_question_prompt(role, num_questions)
    else:
        # Mixed / custom: use resume if available, otherwise HR
        if resume_text and resume_text.strip():
            prompt = resume_question_prompt(resume_text, role, num_questions)
        else:
            prompt = hr_question_prompt(role, num_questions)

    # Call LLM
    data = await call_llm_json(prompt, max_new_tokens=512)

    if data:
        # Extract list from common keys
        questions: List[str] = []
        if isinstance(data, list):
            questions = data
        elif "questions" in data and isinstance(data["questions"], list):
            questions = data["questions"]
        else:
            # Search for any list value
            for v in data.values():
                if isinstance(v, list):
                    questions = v
                    break

        questions = [str(q).strip() for q in questions if str(q).strip()]
        if questions:
            logger.info("LLM generated %d questions successfully", len(questions))
            return questions[:num_questions]

    # LLM failed or returned invalid data — use fallback
    logger.warning("LLM question generation failed or returned empty — using fallback bank")
    return _get_fallback_questions(role, interview_type, num_questions, resume_text)
