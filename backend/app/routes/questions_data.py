"""
Curated Interview Question Bank Dataset
Includes questions from TCS, Capgemini, Infosys, Wipro, Accenture, Cognizant, and general technical drives.
"""

from typing import List, Dict, Any

CURATED_QUESTION_BANK: List[Dict[str, Any]] = [
    # ── TCS QUESTIONS ─────────────────────────────────────────────────────────
    {
        "id": "tcs-01",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "96% (Most Frequent in TCS NQT)",
        "question": "What is the difference between Call by Value and Call by Reference in C/C++ and Java?",
        "summary": "Call by Value passes a copy of the variable, while Call by Reference passes the memory address/reference of the actual variable.",
        "answer": """In **Call by Value**, the actual argument's value is copied into the formal parameter of the function. Any modifications made to the parameter inside the function do not affect the original variable in the caller.

In **Call by Reference**, the address/reference of the actual variable is passed. The formal parameter refers directly to the original memory location, so any change inside the function modifies the original variable.

**Java Specific Gotcha:** Java is strictly **Pass-by-Value**. When an object is passed, the value of the object reference (memory address pointer) is passed by value, not the object itself.""",
        "code_example": {
            "language": "cpp",
            "code": """// C++ Demonstration
#include <iostream>
using namespace std;

void callByValue(int x) {
    x = 100; // Modifies local copy only
}

void callByReference(int &x) {
    x = 100; // Modifies original variable directly
}

int main() {
    int a = 10, b = 10;
    callByValue(a);
    cout << "a: " << a << endl; // Output: 10
    
    callByReference(b);
    cout << "b: " << b << endl; // Output: 100
    return 0;
}"""
        },
        "interviewer_tip": "TCS interviewers love asking: 'Is Java pass-by-reference?' Answer clearly: 'No, Java is strictly pass-by-value, but for objects, the reference handle is passed by value.'",
        "common_mistakes": "Saying that Java passes objects by reference. In Java, primitives and references are both passed by value.",
        "follow_ups": [
            "Can you swap two integers in Java using a helper method?",
            "How does memory allocation differ for local primitive variables versus object references in Java?"
        ]
    },
    {
        "id": "tcs-02",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Medium",
        "frequency": "92% (High in TCS Technical)",
        "question": "Explain Memory Architecture in C/C++/Java: Stack Memory vs Heap Memory.",
        "summary": "Stack memory stores primitive local variables and function execution frames (LIFO), whereas Heap memory stores dynamically allocated objects.",
        "answer": """### Stack Memory:
- **Allocation:** Managed automatically by the CPU operating system in a Last-In-First-Out (LIFO) order.
- **Contents:** Local primitive variables, function call stack frames, and object references/pointers.
- **Speed:** Very fast access because allocation and deallocation happen via pointer movement.
- **Error:** When stack memory is exhausted (e.g. infinite recursion), a `StackOverflowError` is raised.

### Heap Memory:
- **Allocation:** Managed by the runtime/JVM programmer for dynamic memory allocation (`malloc`/`new`).
- **Contents:** All instantiated objects and class metadata.
- **Speed:** Slower than Stack; requires garbage collection or manual `free()` to prevent leaks.
- **Error:** When heap is full and GC cannot free memory, `OutOfMemoryError` is raised.""",
        "code_example": {
            "language": "java",
            "code": """public class MemoryDemo {
    public static void main(String[] args) {
        int id = 101;            // Primitive 'id' stored on Stack
        String name = new String("TCS"); // 'name' reference on Stack, "TCS" object on Heap
        calculate(id);          // New stack frame pushed
    }                           // Stack frame popped

    static void calculate(int val) {
        int bonus = val * 2;    // 'bonus' on calculate()'s stack frame
    }
}"""
        },
        "interviewer_tip": "Clearly mention what happens during an infinite recursive call (StackOverflowError) versus an infinite array allocation loop (OutOfMemoryError).",
        "common_mistakes": "Confusing where the reference variable lives vs where the actual object instance lives.",
        "follow_ups": [
            "What is the difference between StackOverflowError and OutOfMemoryError?",
            "What is JVM PermGen / Metaspace?"
        ]
    },
    {
        "id": "tcs-03",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "OOPs",
        "difficulty": "Easy",
        "frequency": "95% (Top TCS OOPs Question)",
        "question": "Explain Method Overloading vs Method Overriding with practical examples.",
        "summary": "Overloading is compile-time polymorphism (same name, different signature in same class), while Overriding is runtime polymorphism (child class redefines parent method with identical signature).",
        "answer": """### Method Overloading (Compile-Time / Static Polymorphism):
- Occurs within the **same class**.
- Methods share the same name but must have **different parameter lists** (number, types, or sequence of arguments).
- Return type can be the same or different, but differing return type alone is NOT sufficient.
- Resolved at compile time by the compiler.

### Method Overriding (Run-Time / Dynamic Polymorphism):
- Occurs between a **Parent (Super) class** and a **Child (Sub) class**.
- Method name, return type, and parameter list must be **identical**.
- The `@Override` annotation is recommended.
- Private, static, and final methods cannot be overridden.
- Resolved at runtime using dynamic method dispatch based on the actual object instance.""",
        "code_example": {
            "language": "java",
            "code": """class Calculator {
    // Method Overloading
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
}

class Bank {
    double getInterestRate() { return 5.0; }
}

class TCSBank extends Bank {
    // Method Overriding
    @Override
    double getInterestRate() { return 7.5; }
}"""
        },
        "interviewer_tip": "TCS interviewers frequently ask: 'Can we override static methods in Java?' Answer: No, static methods are bonded at compile time to the class; declaring the same static method in a child class is called 'Method Hiding', not overriding.",
        "common_mistakes": "Saying that changing only the return type creates an overloaded method (it causes a compile error).",
        "follow_ups": [
            "Can we override private or final methods?",
            "What is Method Hiding in Java?"
        ]
    },
    {
        "id": "tcs-04",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Medium",
        "frequency": "94% (DBMS Core for TCS)",
        "question": "Explain ACID Properties in DBMS with a real-world Banking transaction example.",
        "summary": "ACID stands for Atomicity, Consistency, Isolation, and Durability, ensuring reliable transaction processing in database systems.",
        "answer": """Consider Account A transferring ₹1,000 to Account B:

1. **Atomicity ('All or Nothing'):**
   - The deduction of ₹1,000 from Account A and the addition of ₹1,000 to Account B must both succeed. If the system crashes midway, the transaction rolls back completely.
2. **Consistency (Integrity constraints preserved):**
   - Total sum of money in the bank (Account A + Account B) must remain constant before and after the transaction. No phantom or negative balances if constraints forbid it.
3. **Isolation (Concurrent transactions don't interfere):**
   - If User C checks Account A's balance simultaneously, they will see either the balance before or after the transfer, never an intermediate partial state.
4. **Durability (Committed data survives crashes):**
   - Once the user receives a 'Transfer Successful' confirmation, even if power cuts out immediately, the database logs (WAL - Write Ahead Logging) guarantee the changes are saved to persistent disk.""",
        "code_example": {
            "language": "sql",
            "code": """-- SQL Transaction Block demonstrating ACID
START TRANSACTION;

UPDATE Accounts 
SET balance = balance - 1000 
WHERE account_id = 'A' AND balance >= 1000;

UPDATE Accounts 
SET balance = balance + 1000 
WHERE account_id = 'B';

-- If both updates succeed without constraint violation:
COMMIT;

-- If an error or crash occurs:
-- ROLLBACK;"""
        },
        "interviewer_tip": "Always illustrate with the ₹1,000 bank transfer scenario. TCS evaluates whether you understand transaction rollback upon system failures.",
        "common_mistakes": "Forgetting to mention Write-Ahead Logging (WAL) or Redo logs when explaining Durability.",
        "follow_ups": [
            "What are database Isolation Levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable)?",
            "What is a dirty read vs a phantom read?"
        ]
    },
    {
        "id": "tcs-05",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Coding & DSA",
        "category": "Coding & DSA",
        "difficulty": "Medium",
        "frequency": "91% (TCS Digital / Ninja Coding)",
        "question": "Write an optimal SQL query to find the N-th (or 2nd) highest salary from an Employee table.",
        "summary": "Can be solved using subqueries with MAX, LIMIT with OFFSET, or the DENSE_RANK() window function.",
        "answer": """In interviews, TCS interviewers expect candidates to provide at least 2 distinct approaches:
1. **Window Function (`DENSE_RANK()`):** The modern, industry-standard approach that handles duplicates cleanly.
2. **Subquery with `MAX()`:** Classic SQL query that works across all relational DBs.
3. **`LIMIT` and `OFFSET`:** MySQL / PostgreSQL specific syntax.""",
        "code_example": {
            "language": "sql",
            "code": """-- Method 1: Modern DENSE_RANK() Window Function (Recommended)
WITH RankedSalaries AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rank_pos
    FROM Employee
)
SELECT DISTINCT salary 
FROM RankedSalaries 
WHERE rank_pos = 2; -- Change 2 to N for N-th highest

-- Method 2: Correlated Subquery (Universal)
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);

-- Method 3: MySQL LIMIT/OFFSET
SELECT DISTINCT salary 
FROM Employee
ORDER BY salary DESC
LIMIT 1 OFFSET 1;"""
        },
        "interviewer_tip": "Explain why `DENSE_RANK()` is preferred over `RANK()`: If two employees share the highest salary (e.g., $100k, $100k), `RANK()` skips rank 2 to 3, but `DENSE_RANK()` assigns rank 2 to the actual second distinct salary.",
        "common_mistakes": "Using `ORDER BY salary DESC LIMIT 1 OFFSET 1` without `DISTINCT`, which fails if top 2 employees have the identical salary.",
        "follow_ups": [
            "What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER()?",
            "How would you optimize this query on a table with 10 million rows? (Answer: Index on salary column)"
        ]
    },
    {
        "id": "tcs-06",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "HR & Behavioral",
        "category": "HR",
        "difficulty": "Easy",
        "frequency": "98% (Standard TCS HR Round)",
        "question": "Why do you want to join TCS, and are you comfortable with relocation and rotational shifts?",
        "summary": "Showcase knowledge of TCS's global scale, research & innovation (Tata Research Development and Design Centre), client footprint, and give an enthusiastic, adaptable response regarding relocation.",
        "answer": """### Recommended Structuring (Tata Values & Growth):
1. **Pillar 1 — Global Scale & Learning:** "TCS is a global leader in IT transformation with over 600,000 professionals, known for its extensive training programs like TCS Elevate and iON learning platforms."
2. **Pillar 2 — Tata Legacy of Ethics:** "Being part of the Tata Group signifies working in an organization that values ethics, innovation, and societal impact alongside profitability."
3. **Pillar 3 — Adaptability:** "Regarding relocation and rotational shifts: Yes, absolutely. As a fresh software engineer, I view relocation as an opportunity to experience new cultures, work directly with client delivery centers, and learn how global 24/7 enterprise systems operate." """,
        "code_example": None,
        "interviewer_tip": "TCS HR checks your flexibility and willingness to sign employment terms. Never sound hesitant about relocation or rotational night shifts; express genuine excitement about enterprise client projects.",
        "common_mistakes": "Saying 'I only want to work in my hometown' or 'I prefer not to do shift work.'",
        "follow_ups": [
            "What do you know about TCS's recent investments in AI and Cloud?",
            "Where do you see yourself after 3 years at TCS?"
        ]
    },

    # ── CAPGEMINI QUESTIONS ───────────────────────────────────────────────────
    {
        "id": "cap-01",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Technical Round",
        "category": "OOPs",
        "difficulty": "Easy",
        "frequency": "98% (Top Capgemini Technical Question)",
        "question": "Walk me through the 4 Fundamental Pillars of Object-Oriented Programming (OOPs) with a practical real-world scenario.",
        "summary": "The 4 pillars are Encapsulation (data hiding), Abstraction (hiding implementation complexity), Inheritance (reusability), and Polymorphism (many forms).",
        "answer": """### 1. Encapsulation (Data Hiding & Protection):
- Wrapping data (variables) and code (methods) together into a single unit (Class).
- Variables are kept `private`, and accessed only through `public` getters/setters.
- *Real-world:* A bank account class where `balance` cannot be directly overwritten from outside; it can only be changed via `deposit()` or `withdraw()` which enforce validation.

### 2. Abstraction (Hiding Complexity):
- Displaying only essential features and hiding internal execution mechanisms.
- Achieved using **Abstract Classes** and **Interfaces**.
- *Real-world:* Driving a car — you press the accelerator pedal to speed up without knowing the internal fuel injection combustion valves.

### 3. Inheritance (Reusability & Extensibility):
- Mechanism where one class acquires the properties and behaviors of a parent class (`extends`).
- *Real-world:* `Vehicle` is a parent class with properties like `speed` and `fuelCapacity`; `ElectricCar` inherits them and adds `batteryPercentage`.

### 4. Polymorphism (Many Forms):
- Ability of a message, method, or object to be processed in more than one form.
- **Compile-time:** Method Overloading.
- **Run-time:** Method Overriding (e.g. `Shape.draw()` implemented differently by `Circle` and `Square`).""",
        "code_example": {
            "language": "java",
            "code": """// Encapsulation
class BankAccount {
    private double balance; // Private data

    public void deposit(double amount) {
        if (amount > 0) this.balance += amount; // Validation
    }
    public double getBalance() { return this.balance; }
}

// Abstraction
interface Vehicle {
    void accelerate(); // Abstract contract
}

// Inheritance & Polymorphism
class Tesla implements Vehicle {
    @Override
    public void accelerate() {
        System.out.println("Accelerating silently via electric motor.");
    }
}"""
        },
        "interviewer_tip": "Capgemini technical panels almost always ask for real-world analogies (e.g. car, ATM, smartphone) rather than textbook definitions.",
        "common_mistakes": "Confusing Encapsulation with Abstraction. (Encapsulation is *hiding data by bundling it*; Abstraction is *hiding implementation details*).",
        "follow_ups": [
            "Can a class achieve 100% abstraction in Java? (Answer: Yes, using pure Interfaces)",
            "What is the difference between an Abstract Class and an Interface in Java 8+?"
        ]
    },
    {
        "id": "cap-02",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Pseudocode & Logic",
        "category": "Pseudocode",
        "difficulty": "Medium",
        "frequency": "97% (Core Capgemini Elimination Round)",
        "question": "Capgemini Pseudocode: What will be the output of bitwise operations and loop execution?",
        "summary": "Capgemini's first round has 30 pseudocode questions testing bitwise operators (^ XOR, & AND, | OR, >> right shift, << left shift) and nested loops.",
        "answer": """### Key Rules for Capgemini Pseudocode:
1. **Bitwise XOR (`^`):** Same bits produce `0`, different bits produce `1`.
   - `x ^ x = 0`
   - `x ^ 0 = x`
2. **Bitwise AND (`&`):** Both bits must be `1` to produce `1`.
3. **Bitwise OR (`|`):** If any bit is `1`, result is `1`.
4. **Left Shift (`x << n`):** Equivalent to `x * (2^n)`.
5. **Right Shift (`x >> n`):** Equivalent to `floor(x / (2^n))`.

### Example Problem Tracing:
Given:
- `Integer a = 7, b = 4, c = 3`
- `c = (a ^ b) + (b & c)`
- `a = (a << 1) + c`
- Print `a + b + c`

Calculation:
- `a = 7` (Binary: `0111`), `b = 4` (Binary: `0100`)
- `a ^ b = 0111 ^ 0100 = 0011` (Decimal: `3`)
- `b & c = 0100 & 0011 = 0000` (Decimal: `0`)
- `c = 3 + 0 = 3`
- `a = (7 << 1) + 3 = (14) + 3 = 17`
- Result `a + b + c = 17 + 4 + 3 = 24`.""",
        "code_example": {
            "language": "cpp",
            "code": """// C++ Pseudocode Verification
#include <iostream>
using namespace std;

int main() {
    int a = 7, b = 4, c = 3;
    c = (a ^ b) + (b & c);
    a = (a << 1) + c;
    cout << "Final Answer: " << (a + b + c) << endl; // Prints 24
    return 0;
}"""
        },
        "interviewer_tip": "In the Capgemini Pseudo-code round, questions have a strict 1-minute time limit. Learn powers of 2 and bitwise properties by heart to solve without scratchpad lag.",
        "common_mistakes": "Mistaking `^` for exponentiation instead of bitwise XOR.",
        "follow_ups": [
            "How do you check if an integer is even or odd using bitwise AND?",
            "How do you swap two variables without using a temporary variable using XOR?"
        ]
    },
    {
        "id": "cap-03",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Medium",
        "frequency": "93% (Frequent in Capgemini Tech)",
        "question": "Explain Exception Handling in Java: Differences between throw vs throws, and final vs finally vs finalize().",
        "summary": "throw explicitly raises an exception; throws declares it in method signature. final is a keyword modifier, finally is an exception cleanup block, finalize() is an Object cleanup method.",
        "answer": """### throw vs throws:
- `throw`: Used inside a method block to explicitly trigger an exception instance (`throw new ArithmeticException("Divide by zero");`).
- `throws`: Used in the method declaration signature to inform the caller that this method may throw checked exceptions (`void readFile() throws IOException`).

### final vs finally vs finalize():
- `final`: Keyword modifier.
  - Final variable = Constant (cannot be reassigned).
  - Final method = Cannot be overridden.
  - Final class = Cannot be inherited (e.g. `java.lang.String`).
- `finally`: Code block following `try-catch`. Always executes whether an exception occurs or not, even if `try` contains a `return` statement (ideal for closing database/file handles).
- `finalize()`: Protected method of `java.lang.Object` invoked by the Garbage Collector prior to reclaiming memory (deprecated in modern Java 9+).""",
        "code_example": {
            "language": "java",
            "code": """public class ExceptionDemo {
    public static void checkAge(int age) throws InvalidAgeException {
        if (age < 18) {
            throw new InvalidAgeException("Age must be 18+ to register.");
        }
    }

    public static void main(String[] args) {
        try {
            checkAge(15);
        } catch (InvalidAgeException e) {
            System.err.println("Caught: " + e.getMessage());
        } finally {
            System.out.println("Cleanup executed successfully.");
        }
    }
}"""
        },
        "interviewer_tip": "Capgemini trick question: 'Does a finally block execute if System.exit(0) is called in try block?' Answer: NO! `System.exit(0)` halts the JVM immediately, so finally does not run.",
        "common_mistakes": "Saying finally block does not execute if try has a return statement (it DOES execute before returning!).",
        "follow_ups": [
            "What is the difference between Checked and Unchecked Exceptions in Java?",
            "What is try-with-resources introduced in Java 7?"
        ]
    },
    {
        "id": "cap-04",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "94% (Java Core in Capgemini)",
        "question": "What is the difference between String, StringBuilder, and StringBuffer in Java?",
        "summary": "String is immutable and stored in the String Constant Pool. StringBuilder is mutable and not thread-safe (fast). StringBuffer is mutable and thread-safe (synchronized, slower).",
        "answer": """### 1. `String`:
- **Mutability:** **Immutable** (once created, cannot be altered). Any modification creates a new object in the String Constant Pool (SCP).
- **Thread-Safety:** Inherently thread-safe due to immutability.
- **Performance:** Slow for frequent modifications/concatenations due to garbage object creation.

### 2. `StringBuilder` (Introduced Java 5):
- **Mutability:** **Mutable** (modifies characters in-place inside buffer).
- **Thread-Safety:** **Not thread-safe** (methods are not synchronized).
- **Performance:** **Fastest** for single-threaded string manipulations.

### 3. `StringBuffer` (Java 1.0):
- **Mutability:** **Mutable**.
- **Thread-Safety:** **Thread-safe** (methods are marked `synchronized`).
- **Performance:** Slower than StringBuilder due to synchronization overhead.""",
        "code_example": {
            "language": "java",
            "code": """// Comparison Demonstration
String s = "Capgemini";
s.concat(" Tech");
System.out.println(s); // Still "Capgemini" (Immutable!)

StringBuilder sb = new StringBuilder("Capgemini");
sb.append(" Tech");
System.out.println(sb); // "Capgemini Tech" (Mutable, Fast)

StringBuffer sbf = new StringBuffer("Capgemini");
sbf.append(" Tech");
System.out.println(sbf); // "Capgemini Tech" (Thread-safe)"""
        },
        "interviewer_tip": "Mention the String Constant Pool (SCP) in Heap memory. When you write `String a = 'hello'; String b = 'hello';`, both point to the exact same reference in SCP, saving memory.",
        "common_mistakes": "Confusing `==` with `.equals()`. `==` compares memory addresses, whereas `.equals()` compares character sequence values.",
        "follow_ups": [
            "Why is String immutable in Java? (Security, Thread-safety, Caching/SCP, HashCode caching)",
            "What happens when you do `String str = new String('hello')`? How many objects are created?"
        ]
    },
    {
        "id": "cap-05",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Coding & DSA",
        "category": "Coding & DSA",
        "difficulty": "Medium",
        "frequency": "90% (Capgemini Coding Round)",
        "question": "How to detect a cycle/loop in a Singly Linked List? Explain Floyd's Tortoise and Hare algorithm.",
        "summary": "Use two pointers moving at different speeds: slow moves 1 step, fast moves 2 steps. If they meet, a cycle exists; if fast reaches null, no cycle exists.",
        "answer": """### Floyd's Cycle-Finding Algorithm (Tortoise and Hare):
- **Concept:** Maintain two pointers, `slow` and `fast`, both starting at the `head`.
- In each step:
  - `slow = slow.next` (1 step)
  - `fast = fast.next.next` (2 steps)
- **Mathematical Guarantee:** If there is a cycle, the relative speed of `fast` with respect to `slow` is 1 node per iteration. Inside the loop of length $L$, the distance decreases by 1 each step until `slow == fast`.
- **Complexities:**
  - **Time Complexity:** $O(N)$
  - **Space Complexity:** $O(1)$ (no extra memory needed, unlike a HashSet approach).""",
        "code_example": {
            "language": "python",
            "code": """class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def hasCycle(head: ListNode) -> bool:
    if not head or not head.next:
        return False

    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next          # 1 step
        fast = fast.next.next     # 2 steps

        if slow == fast:
            return True           # Cycle detected!

    return False                  # Reached end of list (No cycle)"""
        },
        "interviewer_tip": "Once you explain cycle detection, Capgemini interviewers immediately ask: 'How do you find the starting node of the cycle?' Answer: Reset `slow` to `head`, keep `fast` at meeting point, move both 1 step at a time; where they collide is the cycle entry node.",
        "common_mistakes": "Forgetting to check `while fast and fast.next:`, leading to NullPointerException.",
        "follow_ups": [
            "How do you find the starting node of the cycle?",
            "How do you calculate the length of the cycle?"
        ]
    },
    {
        "id": "cap-06",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "HR & Behavioral",
        "category": "HR",
        "difficulty": "Easy",
        "frequency": "95% (Capgemini HR Round)",
        "question": "Tell me about a time you handled a disagreement or conflict in a college team project.",
        "summary": "Use the STAR method (Situation, Task, Action, Result) to demonstrate active listening, data-driven decisions, and emotional maturity.",
        "answer": """### STAR Framework Answer:
- **Situation:** "During our final-year engineering capstone project, our 4-person team had a disagreement regarding whether to use SQL (PostgreSQL) or NoSQL (MongoDB) for our application's database architecture."
- **Task:** "As the backend lead, I had to resolve the technical deadlock before our sprint deadline without harming team cohesion."
- **Action:** "Instead of arguing opinions, I called a 30-minute whiteboard session. We listed our application's actual data requirements: structured user transactions, foreign keys, and ACID compliance. I created a small prototype proving that PostgreSQL handled our relational schemas with zero data redundancy."
- **Result:** "The team agreed unanimously based on the objective benchmarks. We delivered our project on time and earned an 'A' grade with distinction." """,
        "code_example": None,
        "interviewer_tip": "Capgemini values its 'Seven Values' (Honesty, Boldness, Trust, Freedom, Team Spirit, Modesty, Fun). Emphasize 'Team Spirit' and 'Trust' in conflict answers.",
        "common_mistakes": "Blaming teammates, saying 'I was right and they were incompetent', or saying 'I have never had any disagreement with anyone.'",
        "follow_ups": [
            "What would you do if your project manager assigned a task with an impossible deadline?",
            "What are Capgemini's core values?"
        ]
    },

    # ── NEW QUESTIONS FROM USER PDFS ──────────────────────────────────────────

    # 1. Database Connection Code
    {
        "id": "pdf-db-conn",
        "company": "TCS",
        "company_tag": "TCS / Technical",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Easy",
        "frequency": "94% (Frequently Asked in Full Stack / Tech)",
        "question": "Write the connection code to a database in Python (e.g., MySQL).",
        "summary": "We can connect a Python application to a MySQL database using the mysql.connector or PyMySQL library using connect().",
        "answer": """We can connect a Python application to a MySQL database using the `mysql.connector` library.

The `connect()` function establishes a connection between Python and the MySQL server. It accepts host, username, password, and target database name as parameters. Once established, `conn.is_connected()` verifies active connection status, and resources should be closed using `conn.close()`.""",
        "code_example": {
            "language": "python",
            "code": """import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="your_password",
        database="mydatabase"
    )

    if conn.is_connected():
        print("Database connected successfully!")
        cursor = conn.cursor()
        cursor.execute("SELECT DATABASE();")
        record = cursor.fetchone()
        print("Connected to database:", record[0])

    conn.close()
    print("MySQL connection closed.")
except mysql.connector.Error as err:
    print(f"Error: {err}")"""
        },
        "interviewer_tip": "Always wrap your database connection logic in try-except-finally blocks or a context manager to ensure connections are safely closed even if an exception occurs.",
        "common_mistakes": "Hardcoding production database passwords in source code rather than using environment variables (`.env`).",
        "follow_ups": [
            "What is connection pooling and why is it essential in high-traffic web applications?",
            "How do ORMs like SQLAlchemy or Prisma compare with raw driver connections?"
        ]
    },

    # 2. Database Project Creation
    {
        "id": "pdf-db-project",
        "company": "Infosys",
        "company_tag": "Infosys / Project Round",
        "round": "Technical Round",
        "category": "HR",
        "difficulty": "Easy",
        "frequency": "96% (Project Deep-Dive)",
        "question": "How did you design and integrate the database in your academic/capstone project?",
        "summary": "First created the database and required relational tables with constraints, connected the backend via drivers, and implemented CRUD queries with indexing.",
        "answer": """### Recommended Structuring for Project Database Discussion:
1. **Schema Design & Normalization:** First designed ER diagrams and normalized relational tables up to 3NF to prevent duplicate records.
2. **Driver / Connector Integration:** Connected the backend (Python FastAPI/Node.js/Spring Boot) to the database using connection drivers and environment variable configuration.
3. **CRUD Operations:** Used SQL queries and parameterized statements (preventing SQL Injection) to insert, retrieve, update, and delete data.
4. **Validation & Indexing:** Tested query execution times, added primary and foreign key constraints for referential integrity, and created B-Tree indexes on frequently filtered columns.""",
        "code_example": None,
        "interviewer_tip": "Explain the actual database (PostgreSQL, MySQL, SQLite, MongoDB) you used, mentioning 1-2 key tables, relations (1-to-many, many-to-many), and how you tested connectivity.",
        "common_mistakes": "Giving a generic one-line answer without mentioning table relationships or security against SQL injection.",
        "follow_ups": [
            "How did you handle database migrations when schemas changed during development?",
            "How did you prevent SQL injection in your project queries?"
        ]
    },

    # 3. Derived Data Types vs User-Defined in C++
    {
        "id": "pdf-cpp-derived",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "91% (C++ Core Fundamentals)",
        "question": "What are derived data types? Name the user-defined data types in C++.",
        "summary": "Derived data types are built from fundamental types (Arrays, Pointers, References, Functions). User-defined types are created by programmer (Class, Struct, Union, Enum, Typedef).",
        "answer": """### Derived Data Types:
Data types created by combining fundamental/primitive types (`int`, `float`, `char`).
- **Arrays:** Collection of elements of the same type stored in contiguous memory.
- **Pointers:** Variables storing memory addresses of other variables.
- **References:** Aliases or alternative names for existing variables.
- **Functions:** Named blocks of code returning specific data types.

### User-Defined Data Types in C++:
Types defined by the developer to model real-world domain entities:
- **Class:** Blueprint defining private/public members, methods, and constructors.
- **Structure (`struct`):** Composite type (public by default in C++).
- **Union (`union`):** Memory-sharing type where all members share the same memory location.
- **Enumeration (`enum` / `enum class`):** Set of named integer constants.
- **Type Aliases (`typedef` or `using`):** Custom synonym for existing types.""",
        "code_example": {
            "language": "cpp",
            "code": """// User-Defined Types in C++
enum class Status { SUCCESS, PENDING, FAILED };

struct Student {
    int id;
    float gpa;
};

class Box {
private:
    double width;
public:
    Box(double w) : width(w) {}
    double getWidth() const { return width; }
};"""
        },
        "interviewer_tip": "Highlight that in C++, `struct` and `class` are almost identical except for default access specifiers (struct is public, class is private).",
        "common_mistakes": "Confusing derived types (like arrays/pointers) with user-defined types (like class/struct).",
        "follow_ups": [
            "What is the difference between enum and enum class in modern C++?",
            "How much memory does a union allocate compared to a struct?"
        ]
    },

    # 4. Are Higher Normal Forms Better Regarding Redundancy?
    {
        "id": "pdf-norm-redundancy",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Medium",
        "frequency": "95% (Top DBMS Normalization Question)",
        "question": "Are higher normal forms better than lower normal forms as far as redundancy is concerned?",
        "summary": "Yes for redundancy reduction, but higher normal forms require more table joins which can reduce query read performance.",
        "answer": """**Yes, as far as redundancy is concerned, higher normal forms are strictly better.** They eliminate redundant data storage and prevent insertion, update, and deletion anomalies.

### However, the Trade-Off:
- **Redundancy vs Query Performance:** Decomposing tables to reach BCNF or 4NF/5NF creates many smaller tables. To retrieve comprehensive data, the database engine must execute multiple expensive `JOIN` operations.
- **OLTP vs OLAP:**
  - **OLTP (Transactional Systems):** Normalized up to 3NF/BCNF to ensure fast concurrent write operations and strict ACID data integrity.
  - **OLAP (Data Warehousing / Analytics):** Often **denormalized** (Star Schema / Snowflake Schema) to optimize complex read queries and minimize join overhead.""",
        "code_example": None,
        "interviewer_tip": "Conclude your answer with: 'Therefore, the ideal normal form depends on whether the system is write-heavy (OLTP - 3NF/BCNF) or read-heavy (OLAP - denormalized).'",
        "common_mistakes": "Assuming higher normalization is always best in all real-world database architectures.",
        "follow_ups": [
            "What is denormalization and when is it recommended?",
            "What is Boyce-Codd Normal Form (BCNF)?"
        ]
    },

    # 5. Tokens in C++
    {
        "id": "pdf-cpp-tokens",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "90% (Compiler & Language Basics)",
        "question": "Explain tokens in C++. Also, describe their role and importance.",
        "summary": "Tokens are the smallest individual lexical units of a C++ program recognized by the compiler during lexical analysis.",
        "answer": """A **token** is the smallest meaningful individual unit of a C++ source code file that the compiler identifies during lexical analysis.

### Main Types of Tokens:
1. **Keywords:** Reserved words with predefined meanings (e.g., `int`, `if`, `while`, `return`, `class`). Cannot be used as variable names.
2. **Identifiers:** Names given by programmer to variables, functions, and classes (e.g., `total`, `Student`, `calculateSum`).
3. **Constants & Literals:** Fixed immutable values (e.g., `10`, `3.14159`, `'A'`, `"Capgemini"`).
4. **Operators:** Symbols performing operations (e.g., arithmetic `+`, `-`, relational `==`, `!=`, bitwise `&`, `^`).
5. **Punctuators & Separators:** Characters that organize code structure (e.g., `;`, `,`, `{}`, `()`, `[]`).

### Role & Importance:
Tokens allow the compiler's lexical analyzer (lexer) to convert raw characters into a token stream for syntactic and semantic parsing, building the Abstract Syntax Tree (AST).""",
        "code_example": {
            "language": "cpp",
            "code": """int total = 100 + 50;
// Tokens identified by compiler:
// 1. Keyword: int
// 2. Identifier: total
// 3. Operator: =
// 4. Literal: 100
// 5. Operator: +
// 6. Literal: 50
// 7. Punctuator: ;"""
        },
        "interviewer_tip": "Mention the compiler stage (lexical analysis / lexer) where tokens are generated before parsing into an AST.",
        "common_mistakes": "Calling comments tokens. (Comments and whitespaces are stripped out during preprocessing and lexical analysis).",
        "follow_ups": [
            "What is the difference between an identifier and a keyword?",
            "What are the phases of a C++ compiler?"
        ]
    },

    # 6. Database Table without Primary Key
    {
        "id": "pdf-db-no-pk",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Easy",
        "frequency": "93% (Database Integrity Basics)",
        "question": "Can a database table exist without a primary key?",
        "summary": "Yes, relational databases allow tables without primary keys (stored as heaps), but it is strongly discouraged as it allows duplicates and hurts query performance.",
        "answer": """**Yes, a database table can exist without a primary key** in virtually all relational database systems (MySQL, PostgreSQL, Oracle, SQL Server). Such tables are physically stored as **Heaps** (unordered collections of rows).

### Why a Primary Key is Strongly Recommended:
1. **Entity Integrity:** Guarantees that every row is uniquely identifiable.
2. **Prevents Duplicate Records:** Without a primary key or unique constraint, identical duplicate rows can be inserted.
3. **Clustered Indexing:** Most RDBMS engines (e.g., MySQL InnoDB) automatically build a clustered B-Tree index on the primary key, drastically accelerating search and join speeds.
4. **Foreign Key Relations:** Child tables require a primary key or unique key in the parent table to establish referential constraints.""",
        "code_example": {
            "language": "sql",
            "code": """-- Valid SQL: Table without a Primary Key (Heap Table)
CREATE TABLE RawLogs (
    event_timestamp TIMESTAMP,
    log_message VARCHAR(255)
);

-- Recommended SQL: Table with a Primary Key
CREATE TABLE SecureUsers (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE
);"""
        },
        "interviewer_tip": "Explain that MySQL InnoDB will invisibly generate a hidden 6-byte row ID (`DB_ROW_ID`) as a synthetic clustered index if no primary key or unique non-null key is defined.",
        "common_mistakes": "Saying 'No, an SQL table cannot be created without a primary key.' SQL syntactically allows it.",
        "follow_ups": [
            "What is a surrogate key vs a natural key?",
            "What is a composite primary key?"
        ]
    },

    # 7. Similarities and Differences between Class and Structure in C++
    {
        "id": "pdf-class-struct",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Technical Round",
        "category": "OOPs",
        "difficulty": "Easy",
        "frequency": "96% (Classic C++ OOPs Question)",
        "question": "What are the similarities and differences between a class and a structure in C++?",
        "summary": "Similarities: Both can have data members, methods, and constructors. Difference: Class members and inheritance are private by default, while struct is public by default.",
        "answer": """### Similarities:
- Both can have member variables and member functions.
- Both support constructors, destructors, and access specifiers (`public`, `private`, `protected`).
- Both can implement inheritance, polymorphism, and operator overloading.
- Both are instantiated into objects in memory.

### Key Differences:
1. **Default Member Access:**
   - `class`: Members are **private** by default.
   - `struct`: Members are **public** by default.
2. **Default Inheritance Access:**
   - `class`: Inheritance is **private** by default (`class B : A`).
   - `struct`: Inheritance is **public** by default (`struct B : A`).""",
        "code_example": {
            "language": "cpp",
            "code": """class Student {
    int age; // Private by default (cannot access directly from outside)
public:
    void setAge(int a) { age = a; }
};

struct Employee {
    int id; // Public by default (can access directly e.id = 101)
};

int main() {
    Student s;
    // s.age = 20; // COMPILE ERROR: age is private

    Employee e;
    e.id = 101;    // OK: id is public by default
    return 0;
}"""
        },
        "interviewer_tip": "Emphasize that in C++, `struct` is NOT just passive data like in C — it is a full-fledged OOP class with public defaults.",
        "common_mistakes": "Saying that structs cannot have functions or constructors in C++ (they can in C++, unlike in C).",
        "follow_ups": [
            "Why does C++ maintain both struct and class? (Answer: Backward compatibility with C)",
            "What is memory alignment and structure padding?"
        ]
    },

    # 8. Reasons behind INNER JOIN and OUTER JOIN
    {
        "id": "pdf-db-joins",
        "company": "TCS",
        "company_tag": "TCS / Capgemini",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Medium",
        "frequency": "97% (Core Relational Joins)",
        "question": "What is the reason behind using INNER JOIN and OUTER JOIN (LEFT, RIGHT, FULL)?",
        "summary": "INNER JOIN returns only rows with matches in both tables. OUTER JOIN preserves unmatched rows from one or both tables.",
        "answer": """Joins combine records from two or more tables linked by a common key.

### 1. INNER JOIN (Strict Intersection):
- Returns **only matching records** where the join predicate evaluates to true in both tables.
- *Use case:* Showing orders with confirmed customer details.

### 2. OUTER JOIN (Inclusive Union):
Preserves records even when no match exists in the counterpart table (fills missing columns with `NULL`).
- **LEFT (OUTER) JOIN:** All records from Left table + matching records from Right table. (e.g. List all students, even those not assigned to any department).
- **RIGHT (OUTER) JOIN:** All records from Right table + matching records from Left table.
- **FULL (OUTER) JOIN:** All records from both tables. Rows without matches in either table are preserved with `NULL`s.""",
        "code_example": {
            "language": "sql",
            "code": """-- INNER JOIN: Only students assigned to a valid department
SELECT s.name, d.department_name
FROM Students s
INNER JOIN Departments d ON s.department_id = d.department_id;

-- LEFT JOIN: ALL students, including those with NULL department
SELECT s.name, d.department_name
FROM Students s
LEFT JOIN Departments d ON s.department_id = d.department_id;"""
        },
        "interviewer_tip": "In technical interviews, mention `CROSS JOIN` (Cartesian Product $N \\times M$ rows) as well to demonstrate complete command of relational algebra.",
        "common_mistakes": "Assuming LEFT JOIN and RIGHT JOIN are fundamentally different operations; `A LEFT JOIN B` is semantically identical to `B RIGHT JOIN A`.",
        "follow_ups": [
            "What is a Self-Join and what is an example scenario? (e.g. Employee and Manager in same table)",
            "How do you simulate FULL OUTER JOIN in MySQL using UNION?"
        ]
    },

    # 9. Top-N Analysis in DBMS
    {
        "id": "pdf-db-top-n",
        "company": "Infosys",
        "company_tag": "Infosys / Wipro",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Easy",
        "frequency": "91% (SQL Data Retrieval)",
        "question": "What is Top-N analysis in DBMS?",
        "summary": "Top-N analysis retrieves the highest or lowest N records based on a specific sorting column and limit condition.",
        "answer": """**Top-N analysis** is a database query technique used to retrieve a specific number of highest or lowest records based on a sorted criteria (e.g., top 5 salaried employees, top 10 best-selling products).

### Implementation Across Dialects:
- **MySQL / PostgreSQL:** `ORDER BY column DESC LIMIT N;`
- **SQL Server:** `SELECT TOP N * FROM Table ORDER BY column DESC;`
- **Oracle (12c+):** `OFFSET 0 ROWS FETCH FIRST N ROWS ONLY;`
- **Window Functions (Handles ties):** Using `DENSE_RANK()` or `ROW_NUMBER()` inside a CTE.""",
        "code_example": {
            "language": "sql",
            "code": """-- Top 5 Highest Paid Employees (MySQL/PostgreSQL)
SELECT emp_id, name, salary
FROM Employee
ORDER BY salary DESC
LIMIT 5;

-- Top 5 with Ties handled using Window Functions
WITH Ranked AS (
    SELECT name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk
    FROM Employee
)
SELECT name, salary FROM Ranked WHERE rnk <= 5;"""
        },
        "interviewer_tip": "Discuss what happens when there are ties (e.g. 3 people sharing the 5th highest salary). Mention that `LIMIT 5` will arbitrarily cut off ties, whereas `DENSE_RANK()` includes them.",
        "common_mistakes": "Executing `LIMIT N` without an `ORDER BY` clause (which returns an arbitrary non-deterministic top N).",
        "follow_ups": [
            "What is the difference between LIMIT with OFFSET and pagination?",
            "How does index scanning accelerate Top-N queries?"
        ]
    },

    # 10. Prime Number Checker Function
    {
        "id": "pdf-algo-prime",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Coding & DSA",
        "category": "Coding & DSA",
        "difficulty": "Easy",
        "frequency": "94% (Capgemini Coding / Pseudocode)",
        "question": "Write a function to take an integer argument and return 0 if the given number is prime; otherwise, return -1.",
        "summary": "Check divisibility up to square root of n (i <= n / i). Return -1 if n < 2 or divisible, 0 if prime.",
        "answer": """A prime number is greater than 1 and has no positive divisors other than 1 and itself.
- If $n < 2$, return -1.
- Test divisibility from $i = 2$ up to $\\sqrt{n}$ (or $i \\times i \\le n$). If $n \\% i == 0$, return -1.
- If loop completes with no factors, return 0 (indicating prime).
- **Time Complexity:** $O(\\sqrt{n})$
- **Space Complexity:** $O(1)$""",
        "code_example": {
            "language": "cpp",
            "code": """// C++ Prime Checker returning 0 for prime, -1 otherwise
int isPrime(int n) {
    if (n < 2) return -1;
    
    // Check up to sqrt(n) using i <= n / i to prevent overflow
    for (int i = 2; i <= n / i; i++) {
        if (n % i == 0) {
            return -1; // Not prime
        }
    }
    return 0; // Prime number
}"""
        },
        "interviewer_tip": "Writing `i <= n / i` instead of `i * i <= n` avoids integer overflow when $n$ is near `INT_MAX`.",
        "common_mistakes": "Checking all numbers up to $n$ ($O(n)$) instead of stopping at $\\sqrt{n}$ ($O(\\sqrt{n})$).",
        "follow_ups": [
            "How does the Sieve of Eratosthenes find all primes up to N in O(N log log N)?",
            "Why does divisibility check only need to go up to square root of n?"
        ]
    },

    # 11. What is Normalization?
    {
        "id": "pdf-db-norm-def",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Easy",
        "frequency": "98% (Core Relational Theory)",
        "question": "What do you mean by Normalization in database management systems?",
        "summary": "Normalization is the systematic process of organizing data to reduce redundancy and eliminate insertion, update, and deletion anomalies.",
        "answer": """**Normalization** is a formal database design technique that organizes table columns and relations to minimize data duplication and prevent data anomalies.

### Key Goals:
1. **Eliminate Redundant Data:** Prevents storing the same customer address or department name repeatedly across hundreds of order rows.
2. **Prevent Anomalies:**
   - **Insertion Anomaly:** Inability to add a record without adding unrelated data (e.g., cannot add a course without an enrolled student).
   - **Update Anomaly:** Modifying a single value requires updates across multiple duplicate rows; partial updates cause data inconsistency.
   - **Deletion Anomaly:** Deleting one record inadvertently deletes other critical data.""",
        "code_example": None,
        "interviewer_tip": "Always illustrate with the 3 anomalies (Insertion, Update, Deletion). It shows you understand the practical engineering problem normalization solves.",
        "common_mistakes": "Stating that normalization speeds up query execution. (Normalization actually increases JOINs and can slow reads, but preserves write consistency).",
        "follow_ups": [
            "Walk me through 1NF, 2NF, and 3NF with an example table.",
            "What is lossless-join decomposition?"
        ]
    },

    # 12. Where to Create an Index?
    {
        "id": "pdf-db-index-where",
        "company": "Infosys",
        "company_tag": "Infosys DSE / Specialist",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Medium",
        "frequency": "95% (Database Performance Tuning)",
        "question": "Where do we generally create an INDEX in a database?",
        "summary": "Create indexes on columns frequently used in WHERE conditions, JOIN ON clauses, ORDER BY, and foreign keys. Avoid over-indexing frequently updated columns.",
        "answer": """An **Index** is created on table columns to speed up data retrieval operations.

### Columns Ideal for Indexing:
1. **Primary & Foreign Keys:** Automatically indexed for referential lookups and JOIN speed.
2. **`WHERE` Filtering Columns:** Columns with high selectivity (e.g. `email`, `user_uuid`, `created_at`).
3. **`JOIN` Condition Columns:** Columns matching two tables together (`ON a.dept_id = b.dept_id`).
4. **`ORDER BY` and `GROUP BY` Columns:** Pre-sorted B-Tree indexes avoid expensive in-memory sort operations (`filesort`).

### Where NOT to Create an Index:
- Small tables (full table scan is faster than index lookup).
- Columns with low cardinality (e.g. `gender` with only M/F values).
- Write-heavy tables where `INSERT`/`UPDATE`/`DELETE` are frequent, as indexes must be rebalanced on every write.""",
        "code_example": {
            "language": "sql",
            "code": """-- Creating a B-Tree Index for faster WHERE lookups
CREATE INDEX idx_employee_salary
ON Employee(salary);

-- Composite Index for queries filtering by both department and status
CREATE INDEX idx_emp_dept_status
ON Employee(department_id, status);"""
        },
        "interviewer_tip": "Mention the trade-off: Indexes accelerate `SELECT` lookups ($O(\\log N)$), but add overhead to `INSERT`, `UPDATE`, and `DELETE` operations due to B-Tree rebalancing.",
        "common_mistakes": "Creating indexes on every single column without evaluating write throughput degradation.",
        "follow_ups": [
            "What is a composite index and what is the leftmost prefix rule?",
            "What is an index seek versus an index scan?"
        ]
    },

    # 13. Reference Variables in C++
    {
        "id": "pdf-cpp-ref",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "92% (C++ Pointers vs References)",
        "question": "What are reference variables, and how are they defined in C++?",
        "summary": "A reference variable is an alias (another name) for an existing variable, declared using the ampersand (&) symbol. It cannot be NULL and must be initialized on declaration.",
        "answer": """A **reference variable** in C++ is an alias or alternative name for an existing variable. It shares the exact same memory address as the original variable.

### Syntax & Properties:
- Declared using the `&` operator: `int &ref = a;`
- **Must be initialized** immediately upon declaration.
- **Cannot be reseated:** Once bound to a variable, it cannot refer to another variable later.
- **Cannot be NULL:** Unlike pointers, references must always refer to valid memory.""",
        "code_example": {
            "language": "cpp",
            "code": """#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int &ref = a; // 'ref' is an alias for 'a'

    ref = 20; // Modifies 'a' directly through the alias

    cout << "Value of a: " << a << endl;     // Output: 20
    cout << "Address of a: " << &a << endl;
    cout << "Address of ref: " << &ref << endl; // EXACT same memory address!

    return 0;
}"""
        },
        "interviewer_tip": "Capgemini interviewers often ask: 'What is the difference between a pointer and a reference?' Answer: Pointers can be NULL and reassigned; references cannot be NULL and cannot be reseated.",
        "common_mistakes": "Declaring a reference without initializing it (`int &r;` causes a compilation error).",
        "follow_ups": [
            "Can you create an array of references in C++? (Answer: No, because references are not objects)",
            "What is an rvalue reference (&&) introduced in C++11?"
        ]
    },

    # 14. Various Forms of Normalization (1NF, 2NF, 3NF, BCNF, 4NF, 5NF)
    {
        "id": "pdf-db-norm-forms",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Medium",
        "frequency": "96% (Comprehensive Normalization)",
        "question": "What are the various normal forms in database normalization (1NF to 5NF)?",
        "summary": "1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency), BCNF (determinant is superkey), 4NF (multivalued dependency), 5NF (join dependency).",
        "answer": """### Summary of Normal Forms:
1. **1NF (First Normal Form):**
   - Each column contains **atomic (indivisible)** values.
   - No repeating groups or arrays stored in a single cell (e.g. multiple phone numbers in one column violates 1NF).
2. **2NF (Second Normal Form):**
   - Must be in 1NF.
   - Eliminates **partial dependencies**: Every non-key column must depend on the *entire* composite primary key, not just a subset.
3. **3NF (Third Normal Form):**
   - Must be in 2NF.
   - Eliminates **transitive dependencies**: Non-key columns must not depend on other non-key columns (e.g. City depending on ZipCode instead of Primary Key).
4. **BCNF (Boyce-Codd Normal Form):**
   - Stricter form of 3NF.
   - For every functional dependency $X \\rightarrow Y$, $X$ must be a **superkey**.
5. **4NF:** Must be in BCNF and eliminates non-trivial **multivalued dependencies**.
6. **5NF (Project-Join Normal Form):** Eliminates non-trivial **join dependencies** not implied by candidate keys.""",
        "code_example": None,
        "interviewer_tip": "Remember the classic mnemonic: 'The key, the whole key (2NF), and nothing but the key (3NF), so help me Codd (BCNF)'.",
        "common_mistakes": "Thinking 2NF applies when a table has a single-column primary key. (Partial dependency only exists when there is a composite primary key!).",
        "follow_ups": [
            "Can a 3NF relation have redundancy? (Yes, if determinants are not candidate keys — resolved by BCNF)",
            "What is a surrogate key?"
        ]
    },

    # 15. Why is DML Provided?
    {
        "id": "pdf-db-dml",
        "company": "Wipro",
        "company_tag": "Wipro Elite & Turbo",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Easy",
        "frequency": "91% (SQL Sublanguages)",
        "question": "Why is DML (Data Manipulation Language) provided in SQL? What are its main commands?",
        "summary": "DML enables users and application programs to insert, retrieve, update, and delete data rows within database tables.",
        "answer": """**DML (Data Manipulation Language)** is provided to allow applications and users to query and modify data stored inside relational database tables.

While DDL (Data Definition Language) creates database schemas/tables, DML manages the actual records inside them.

### Main DML Commands:
- `SELECT`: Retrieves data rows matching criteria.
- `INSERT`: Adds new records into a table.
- `UPDATE`: Modifies existing row values.
- `DELETE`: Removes specific rows based on conditions.""",
        "code_example": {
            "language": "sql",
            "code": """-- INSERT new record
INSERT INTO Employee (id, name, salary)
VALUES (101, 'Rahul Sharma', 45000);

-- UPDATE existing salary
UPDATE Employee
SET salary = 50000
WHERE id = 101;

-- SELECT filtered data
SELECT * FROM Employee WHERE salary >= 50000;

-- DELETE specific record
DELETE FROM Employee WHERE id = 101;"""
        },
        "interviewer_tip": "Mention that DML operations are transaction-safe (can be committed or rolled back), whereas DDL operations (like `DROP`, `TRUNCATE`) auto-commit in most engines.",
        "common_mistakes": "Confusing DDL (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`) with DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).",
        "follow_ups": [
            "What is DCL (Data Control Language) and TCL (Transaction Control Language)?",
            "Why is TRUNCATE considered DDL while DELETE is DML?"
        ]
    },

    # 16. What is an Operating System and Main Functions?
    {
        "id": "pdf-os-functions",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "94% (OS Core Fundamentals)",
        "question": "What is an Operating System? Explain its primary functions.",
        "summary": "An Operating System is system software that manages computer hardware and software resources and provides a user-hardware interface.",
        "answer": """An **Operating System (OS)** is system software that acts as an intermediary between the computer hardware and software applications, providing an environment in which users can execute programs efficiently.

### 5 Main Functions of an OS:
1. **Process Management:** CPU scheduling, process creation, termination, synchronization, and deadlock prevention.
2. **Memory Management:** Allocation and deallocation of RAM to active processes, paging, segmentation, and virtual memory.
3. **File System Management:** Managing files, directories, access permissions, and disk storage allocation.
4. **Device / I/O Management:** Managing peripheral device communication via device drivers and interrupt handling.
5. **Security & Protection:** User authentication, authorization, and process memory isolation.""",
        "code_example": None,
        "interviewer_tip": "Be prepared to give real-world examples: Linux, Windows, macOS, Android, and real-time operating systems (RTOS like FreeRTOS).",
        "common_mistakes": "Forgetting to mention the difference between kernel space and user space.",
        "follow_ups": [
            "What is the difference between a monolithic kernel and a microkernel?",
            "What happens during a context switch?"
        ]
    },

    # 17. Deadlock Conditions (Coffman Conditions)
    {
        "id": "pdf-os-deadlock",
        "company": "Cognizant",
        "company_tag": "Cognizant GenC & GenC Next",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Medium",
        "frequency": "96% (OS Deadlock Standard)",
        "question": "What conditions lead to a Deadlock situation in Operating Systems? Explain Coffman Conditions.",
        "summary": "A deadlock occurs when processes wait indefinitely for resources held by each other. The 4 Coffman conditions are Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.",
        "answer": """A **Deadlock** is a state in which two or more processes are permanently blocked because each process holds a resource that the other process needs, and neither can proceed.

### 4 Coffman Conditions (Must ALL hold simultaneously):
1. **Mutual Exclusion:** At least one resource must be non-shareable (only one process can use it at a time).
2. **Hold and Wait:** A process is currently holding at least one resource and requesting additional resources held by others.
3. **No Preemption:** Resources cannot be forcibly revoked from a process; they must be released voluntarily.
4. **Circular Wait:** A closed chain of processes exists: $P_0$ waits for $P_1$, $P_1$ waits for $P_2$, ..., and $P_n$ waits for $P_0$.""",
        "code_example": None,
        "interviewer_tip": "Explain how deadlocks are prevented: breaking ANY one of the 4 Coffman conditions (e.g. strict resource ordering to break Circular Wait) eliminates deadlocks completely.",
        "common_mistakes": "Confusing deadlock (no progress possible) with starvation (a process waits indefinitely due to low priority, but others make progress).",
        "follow_ups": [
            "What is Dijkstra's Banker's Algorithm for deadlock avoidance?",
            "What is a Resource Allocation Graph (RAG)?"
        ]
    },

    # 18. Semaphores (Binary vs Counting) & Flagging
    {
        "id": "pdf-os-semaphore",
        "company": "Cognizant",
        "company_tag": "Cognizant GenC & GenC Next",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Medium",
        "frequency": "93% (Process Synchronization)",
        "question": "Explain the concept of flagging a semaphore and differentiate Binary vs Counting semaphores.",
        "summary": "A semaphore is an integer variable used for synchronization accessed only via atomic wait() (P) and signal() (V) operations.",
        "answer": """A **Semaphore** is a synchronization mechanism used by operating systems to control access to shared critical resources.

### Flagging a Semaphore:
Using its state/integer value to indicate whether a resource is available or a process must wait in a queue.

### Types of Semaphores:
1. **Binary Semaphore (Mutex-like):**
   - Value is strictly **0 or 1**.
   - Used for mutual exclusion to protect a single critical resource.
   - `1`: Resource available; `0`: Resource locked.
2. **Counting Semaphore:**
   - Value can be any **non-negative integer**.
   - Used to control access to a pool of $N$ identical resources (e.g. 5 database connection handles, printer pool).

### Atomic Operations:
- `wait()` / `P()`: Decrements semaphore; blocks if value $\\le 0$.
- `signal()` / `V()`: Increments semaphore; unblocks a waiting process.""",
        "code_example": {
            "language": "cpp",
            "code": """// Pseudo-code of Semaphore Operations
void wait(Semaphore S) {
    S.value--;
    if (S.value < 0) {
        // Add this process to S.queue and block
    }
}

void signal(Semaphore S) {
    S.value++;
    if (S.value <= 0) {
        // Remove process P from S.queue and wakeup(P)
    }
}"""
        },
        "interviewer_tip": "Clarify that `wait()` and `signal()` must execute atomically without interruption, typically enforced via hardware instructions like Test-and-Set or disabling interrupts in kernel mode.",
        "common_mistakes": "Using regular variables with loops (busy waiting) without hardware atomic guarantees, which leads to race conditions.",
        "follow_ups": [
            "What is the difference between a Binary Semaphore and a Mutex lock?",
            "What is Priority Inversion and how does Priority Inheritance solve it?"
        ]
    },

    # 19. rand() vs srand() in C++
    {
        "id": "pdf-cpp-rand-srand",
        "company": "Core CS",
        "company_tag": "Core CS Track",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "89% (Random Number Generation)",
        "question": "What is the difference between rand() and srand() in C/C++?",
        "summary": "rand() generates pseudo-random numbers using an internal seed. srand() initializes the seed value (typically with time(0)) to ensure different sequences across runs.",
        "answer": """### Differences:
- `rand()`: Computes and returns a pseudo-random integer between `0` and `RAND_MAX` using a deterministic mathematical formula.
- `srand(seed)`: Sets the starting **seed** value for the pseudo-random number algorithm used by `rand()`.

If you call `rand()` without `srand()`, the seed defaults to `1`, producing the **exact same sequence of numbers** every time the program runs. To generate different numbers on every execution, seed it with the current timestamp: `srand(time(0))`.""",
        "code_example": {
            "language": "cpp",
            "code": """#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main() {
    // Seed with current time in seconds
    srand(time(0));

    // Generate random number between 1 and 100
    int randomNum = (rand() % 100) + 1;
    cout << "Random Number: " << randomNum << endl;

    return 0;
}"""
        },
        "interviewer_tip": "Mention that in modern C++11, the `<random>` library (`std::mt19937` Mersenne Twister) is preferred over `rand()` because `rand() % N` introduces modulo bias.",
        "common_mistakes": "Calling `srand(time(0))` inside a loop (it resets the seed repeatedly, generating identical numbers).",
        "follow_ups": [
            "What is modulo bias in `rand() % N`?",
            "How does `std::mt19937` in `<random>` improve cryptographic security?"
        ]
    },

    # 20. Subquery Definition & Example
    {
        "id": "pdf-db-subquery",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Easy",
        "frequency": "93% (SQL Query Formulation)",
        "question": "Define a Subquery with an example in SQL.",
        "summary": "A subquery (nested query) is an SQL query written inside another query, used to calculate intermediate results for the outer query.",
        "answer": """A **Subquery** (or inner query) is an SQL query nested within another query (`SELECT`, `INSERT`, `UPDATE`, or `DELETE`). The outer query uses the result produced by the inner query.

### Types of Subqueries:
1. **Scalar Subquery:** Returns a single value (one row, one column).
2. **Multi-row Subquery:** Returns multiple rows using operators like `IN`, `ANY`, `ALL`.
3. **Correlated Subquery:** References columns from the outer query and executes once for each candidate row evaluated by the outer query.""",
        "code_example": {
            "language": "sql",
            "code": """-- Example: Employees earning more than the company average salary
SELECT name, salary
FROM Employee
WHERE salary > (
    SELECT AVG(salary) 
    FROM Employee
);"""
        },
        "interviewer_tip": "Explain that Correlated Subqueries can be slow on huge datasets ($O(N^2)$), and can often be optimized by rewriting them as `JOIN`s or Window Functions.",
        "common_mistakes": "Using `=` with a subquery that returns multiple rows (which causes a runtime error; must use `IN` instead).",
        "follow_ups": [
            "What is the difference between a Correlated Subquery and a Non-Correlated Subquery?",
            "What is the EXISTS operator in SQL?"
        ]
    },

    # 21. BCNF (Boyce-Codd Normal Form)
    {
        "id": "pdf-db-bcnf",
        "company": "Capgemini",
        "company_tag": "Capgemini / TCS",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Medium",
        "frequency": "92% (Advanced Normalization)",
        "question": "What is BCNF (Boyce-Codd Normal Form)? How does it differ from 3NF?",
        "summary": "A table is in BCNF if for every non-trivial functional dependency X -> Y, X must be a superkey. BCNF is stricter than 3NF.",
        "answer": """**BCNF (Boyce-Codd Normal Form)** is an advanced normal form that is strictly stronger than 3NF (sometimes referred to as 3.5NF).

### Strict Rule for BCNF:
A relation $R$ is in BCNF if, for every non-trivial functional dependency $X \\rightarrow Y$:
- **$X$ is a Superkey**.

### Difference from 3NF:
In 3NF, a dependency $X \\rightarrow Y$ is allowed if $X$ is a superkey **OR** $Y$ is a prime attribute (part of a candidate key).
In BCNF, this second exception is removed: **$X$ MUST be a superkey**, period!

### Practical Insight:
BCNF removes all redundancy based on functional dependencies. However, decomposing a relation into BCNF may sometimes fail to preserve functional dependencies, which is why 3NF is often chosen in enterprise production systems.""",
        "code_example": None,
        "interviewer_tip": "If asked 'Why not always use BCNF over 3NF?', state: 'Because 3NF guarantees dependency preservation and lossless join, whereas BCNF guarantees lossless join but may lose functional dependencies.'",
        "common_mistakes": "Saying that BCNF and 3NF are identical.",
        "follow_ups": [
            "What is a functional dependency?",
            "What is a prime attribute vs a non-prime attribute?"
        ]
    },

    # 22. Semaphore vs Monitor
    {
        "id": "pdf-os-sem-monitor",
        "company": "Cognizant",
        "company_tag": "Cognizant GenC & GenC Next",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Medium",
        "frequency": "91% (Concurrency Constructs)",
        "question": "What is the difference between a Semaphore and a Monitor in Operating Systems?",
        "summary": "Semaphores are integer OS synchronization primitives requiring explicit wait/signal calls. Monitors are high-level programming language constructs encapsulating shared data with automatic mutual exclusion.",
        "answer": """### Key Differences:
1. **Level of Abstraction:**
   - **Semaphore:** Low-level OS synchronization primitive based on integer counters.
   - **Monitor:** High-level language-level construct (e.g. `synchronized` methods/blocks in Java).
2. **Encapsulation:**
   - **Semaphore:** Shared data is separate from the semaphore itself.
   - **Monitor:** Encapsulates shared data variables and synchronization methods into a single unit.
3. **Ease of Use & Safety:**
   - **Semaphore:** Error-prone; forgetting a `signal()` causes deadlocks, omitting `wait()` causes race conditions.
   - **Monitor:** Compiler and runtime enforce that only one thread can execute inside a monitor at any time.
4. **Operations:**
   - **Semaphore:** `wait()` (P) and `signal()` (V).
   - **Monitor:** Condition variables with `wait()`, `notify()`, `notifyAll()`.""",
        "code_example": {
            "language": "java",
            "code": """// Java Monitor Example (using 'synchronized')
public class BankAccountMonitor {
    private double balance = 1000;

    // Monitor automatically locks 'this' object
    public synchronized void withdraw(double amount) throws InterruptedException {
        while (balance < amount) {
            wait(); // Releases lock and waits for deposit
        }
        balance -= amount;
    }

    public synchronized void deposit(double amount) {
        balance += amount;
        notifyAll(); // Wakes up waiting withdraw threads
    }
}"""
        },
        "interviewer_tip": "Mention that Java's `synchronized` methods and `Object.wait()`/`notify()` are the quintessential implementation of Hoare's Monitor construct in modern software.",
        "common_mistakes": "Calling a monitor a hardware mechanism (monitors are programming language level abstractions).",
        "follow_ups": [
            "What is the difference between Mesa style and Hoare style monitors?",
            "Why must wait() in Java be called inside a while loop rather than an if statement?"
        ]
    },

    # 23. Linear Data Structures: Linked List, Stack, and Queue
    {
        "id": "pdf-dsa-linear-ds",
        "company": "Wipro",
        "company_tag": "Wipro Elite & Turbo",
        "round": "Technical Round",
        "category": "Coding & DSA",
        "difficulty": "Easy",
        "frequency": "95% (Linear Data Structures)",
        "question": "Explain and compare these terms: Linked List, Stack, and Queue.",
        "summary": "Linked List is dynamic node chains. Stack follows LIFO (push/pop/peek). Queue follows FIFO (enqueue/dequeue).",
        "answer": """### 1. Linked List:
- A linear collection of data elements called **nodes**, where each node contains data and a pointer/reference to the next node.
- **Advantage:** Dynamic size; $O(1)$ insertion/deletion at known positions without contiguous memory reallocation.

### 2. Stack (LIFO — Last In, First Out):
- The last element added is the first one removed.
- **Operations:** `push()` (insert), `pop()` (remove), `peek()` (view top).
- **Applications:** Function call stack, recursion management, undo operations in text editors, expression evaluation.

### 3. Queue (FIFO — First In, First Out):
- The first element added is the first one removed.
- **Operations:** `enqueue()` (insert at rear), `dequeue()` (remove from front).
- **Applications:** CPU process scheduling (Round Robin), printer spooling, Breadth-First Search (BFS) graph traversal.""",
        "code_example": None,
        "interviewer_tip": "Always mention real-world computing applications: Stacks for function call recursion and browser Back button; Queues for message brokers (Kafka/RabbitMQ) and printer jobs.",
        "common_mistakes": "Confusing the order: Stack is LIFO, Queue is FIFO.",
        "follow_ups": [
            "How do you implement a Queue using two Stacks?",
            "What is a Circular Queue and what problem does it solve?"
        ]
    },

    # 24. Database Triggers
    {
        "id": "pdf-db-triggers",
        "company": "Accenture",
        "company_tag": "Accenture / Infosys",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Medium",
        "frequency": "91% (Database Event Automation)",
        "question": "Define database triggers. Give their practical applications and syntax.",
        "summary": "A trigger is a database object that automatically executes a specified action when an INSERT, UPDATE, or DELETE event occurs on a table.",
        "answer": """A **Trigger** is a stored procedure in a database that automatically fires or executes in response to specified DML events (`INSERT`, `UPDATE`, `DELETE`) on a particular table.

### Practical Applications of Triggers:
1. **Audit Logging:** Automatically recording who made changes, old values, and timestamps in an audit table.
2. **Data Cleansing / Formatting:** Trimming spaces or capitalizing emails before saving.
3. **Complex Business Rule Enforcement:** Preventing updates that violate complex constraints across multiple tables.
4. **Replicating / Synchronizing Tables:** Keeping summary counters updated in parent tables.""",
        "code_example": {
            "language": "sql",
            "code": """-- Example: Audit Trigger in MySQL
CREATE TRIGGER before_employee_insert
BEFORE INSERT ON Employee
FOR EACH ROW
BEGIN
    -- Trim leading and trailing spaces automatically
    SET NEW.name = TRIM(NEW.name);
    -- Set creation timestamp
    SET NEW.created_at = NOW();
END;"""
        },
        "interviewer_tip": "Discuss the downside of triggers: They run invisibly in the database ('hidden side effects'), making debugging complex and slowing down batch bulk-insert operations.",
        "common_mistakes": "Writing recursive triggers that update the same table and trigger an infinite execution loop.",
        "follow_ups": [
            "What is the difference between a BEFORE trigger and an AFTER trigger?",
            "What are the pseudo-records `NEW` and `OLD` in triggers?"
        ]
    },

    # 25. Doubly Linked List
    {
        "id": "pdf-dsa-dll",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Technical Round",
        "category": "Coding & DSA",
        "difficulty": "Easy",
        "frequency": "92% (Data Structures Core)",
        "question": "Define a Doubly Linked List and explain its advantages and disadvantages.",
        "summary": "A doubly linked list node contains data, next pointer, and previous pointer, allowing bidirectional traversal.",
        "answer": """A **Doubly Linked List (DLL)** is a linear data structure in which each node contains three fields:
1. `data`: The value stored in the node.
2. `next`: Pointer/reference to the next node in the sequence.
3. `prev`: Pointer/reference to the preceding node.

### Advantages over Singly Linked List:
- **Bidirectional Traversal:** Can be traversed in both forward and backward directions.
- **Efficient Deletions:** Deleting a node given its pointer takes $O(1)$ time because we have direct access to `node->prev`, without traversing from the head.

### Disadvantages:
- Extra memory overhead for the `prev` pointer per node.
- Additional pointer maintenance during insertions and deletions.""",
        "code_example": {
            "language": "cpp",
            "code": """struct Node {
    int data;
    Node* prev;
    Node* next;

    Node(int val) : data(val), prev(nullptr), next(nullptr) {}
};"""
        },
        "interviewer_tip": "Mention real-world uses: Browser history navigation (Forward / Back buttons), LRU Cache implementations, and Undo/Redo stacks.",
        "common_mistakes": "Forgetting to update both `prev->next` and `next->prev` during insertions/deletions, corrupting the list links.",
        "follow_ups": [
            "How does an LRU (Least Recently Used) Cache combine a Doubly Linked List with a Hash Map?",
            "How do you reverse a Doubly Linked List in-place?"
        ]
    },

    # 26. Scope Rules in C++
    {
        "id": "pdf-cpp-scope",
        "company": "Core CS",
        "company_tag": "Core CS Track",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "90% (C++ Variable Lifetimes)",
        "question": "Explain Scope Rules in C++ (Local, Global, Class, Namespace, Block scope).",
        "summary": "Scope determines where an identifier is accessible. Includes Local, Global, Class, Namespace, and Block scopes.",
        "answer": """In C++, **scope** defines the region of the program where a variable, function, or class name is visible and accessible.

### 5 Main Types of Scope in C++:
1. **Local Scope:** Declared inside a function; accessible only within that function.
2. **Global Scope:** Declared outside all functions; accessible throughout the file. Can be accessed inside functions using the scope resolution operator `::globalVar`.
3. **Class Scope:** Members declared inside a class; accessed via objects (`obj.member`) or class scope resolution (`Class::staticMember`).
4. **Namespace Scope:** Identifiers declared inside `namespace MySpace { ... }`; accessed via `MySpace::identifier` to prevent naming collisions.
5. **Block Scope:** Variables declared inside curly braces `{ ... }` like an `if` block or loop; destroyed when exiting the block.""",
        "code_example": {
            "language": "cpp",
            "code": """#include <iostream>
using namespace std;

int val = 100; // Global Scope

int main() {
    int val = 20; // Local Scope (shadows global)

    cout << "Local val: " << val << endl;       // Prints 20
    cout << "Global val: " << ::val << endl;     // Prints 100 using ::

    {
        int blockVal = 50; // Block Scope
        cout << "Inside block: " << blockVal << endl;
    }
    // cout << blockVal; // COMPILE ERROR: out of scope!

    return 0;
}"""
        },
        "interviewer_tip": "Point out the Scope Resolution Operator `::` which allows accessing shadowed global variables inside a local scope.",
        "common_mistakes": "Attempting to access a loop counter outside the `for` statement body.",
        "follow_ups": [
            "What is variable shadowing?",
            "What is the difference between lifetime and scope of a static local variable?"
        ]
    },

    # 27. Stored Procedures Advantages
    {
        "id": "pdf-db-stored-proc",
        "company": "Accenture",
        "company_tag": "Accenture / Infosys",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Medium",
        "frequency": "94% (Enterprise SQL Architecture)",
        "question": "What are the advantages of using Stored Procedures in SQL databases?",
        "summary": "Stored procedures are compiled SQL statement blocks stored in the database providing reusability, reduced network traffic, security, and precompiled performance.",
        "answer": """A **Stored Procedure** is a precompiled collection of one or more SQL statements saved in the database data dictionary and executed on call.

### Key Advantages:
1. **Performance & Execution Plan Caching:** The database parses, compiles, and optimizes the procedure on first run, caching the execution plan for fast subsequent calls.
2. **Reduced Network Latency:** Instead of sending multiple SQL queries back and forth over the network, a client sends a single call: `CALL ProcessOrder(101);`.
3. **Enhanced Security:** DBAs can grant users permissions to execute the procedure without granting direct `SELECT` or `UPDATE` access to sensitive underlying tables.
4. **Protection Against SQL Injection:** Parameterized stored procedures prevent malicious input manipulation.
5. **Centralized Business Logic:** Reusable across web, mobile, and desktop applications.""",
        "code_example": {
            "language": "sql",
            "code": """DELIMITER //
CREATE PROCEDURE GetCustomerOrders(IN cust_id INT)
BEGIN
    SELECT order_id, order_date, total_amount
    FROM Orders
    WHERE customer_id = cust_id;
END //
DELIMITER ;

-- Calling the procedure
CALL GetCustomerOrders(105);"""
        },
        "interviewer_tip": "Contrast stored procedures with functions: Stored procedures can return multiple result sets and modify database state via transactions; functions return a single value and typically do not modify database tables.",
        "common_mistakes": "Putting too much core business logic in stored procedures, which makes version controlling, unit testing, and migrating databases difficult.",
        "follow_ups": [
            "What is the difference between a Stored Procedure and a Stored Function?",
            "How do stored procedures protect against SQL injection?"
        ]
    },

    # 28. Python Decorators
    {
        "id": "pdf-py-decorators",
        "company": "Amazon",
        "company_tag": "Python / Product Track",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Medium",
        "frequency": "96% (Top Python Language Question)",
        "question": "What is a decorator in Python? Provide a sample code along with an explanation.",
        "summary": "A decorator is a function that takes another function as an argument, extends its behavior without modifying its source code, and returns a new function using the @ syntax.",
        "answer": """In Python, functions are **first-class citizens** (they can be passed as arguments, assigned to variables, and returned from other functions).

A **decorator** is a callable that accepts a function, wraps additional functionality around it (e.g., logging, access control, execution timing, caching), and returns the modified wrapper function. It is applied cleanly using the `@decorator_name` syntax.""",
        "code_example": {
            "language": "python",
            "code": """import time
from functools import wraps

# Decorator to measure function execution time
def execution_timer(original_func):
    @wraps(original_func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = original_func(*args, **kwargs)
        duration = time.time() - start_time
        print(f"[{original_func.__name__}] took {duration:.4f}s to execute")
        return result
    return wrapper

@execution_timer
def compute_heavy_task(n):
    return sum(i * i for i in range(n))

# Calling the decorated function
compute_heavy_task(1000000)"""
        },
        "interviewer_tip": "Always mention `functools.wraps`. Without `@wraps(original_func)`, the decorated function loses its original `__name__` and `__doc__` metadata.",
        "common_mistakes": "Forgetting `*args, **kwargs` in the wrapper, which breaks functions that accept parameters.",
        "follow_ups": [
            "How do you write a decorator that takes arguments (e.g. `@repeat(num_times=3)`)?",
            "What are common built-in decorators in Python? (`@staticmethod`, `@classmethod`, `@property`)"
        ]
    },

    # 29. Find Missing Number in Sequence
    {
        "id": "pdf-py-missing-num",
        "company": "TCS",
        "company_tag": "TCS / Capgemini",
        "round": "Coding & DSA",
        "category": "Coding & DSA",
        "difficulty": "Easy",
        "frequency": "95% (Frequent Coding Problem)",
        "question": "Given an array of numbers from 1 to n with one number missing, write Python code to find the missing number.",
        "summary": "Use the mathematical sum of first n natural numbers: expected = n*(n+1)//2, missing = expected - actual_sum in O(n) time and O(1) space.",
        "answer": """### Method 1: Mathematical Formula (Optimal)
The sum of the first $n$ natural numbers is given by:
$$S = \\frac{n(n + 1)}{2}$$
Subtract the sum of the array elements from $S$. The difference is the missing number.
- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(1)$

### Method 2: Bitwise XOR (Prevents Integer Overflow)
XOR all numbers from 1 to $n$, then XOR with all elements in the array. Since $x \\oplus x = 0$, duplicate elements cancel out, leaving the missing number.""",
        "code_example": {
            "language": "python",
            "code": """def find_missing_number(arr, n):
    # Method 1: Sum Formula
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(arr)
    return expected_sum - actual_sum

def find_missing_xor(arr, n):
    # Method 2: Bitwise XOR (prevents integer overflow)
    xor_all = 0
    for i in range(1, n + 1):
        xor_all ^= i
    for num in arr:
        xor_all ^= num
    return xor_all

# Example
nums = [1, 2, 4, 5, 6]
print("Missing:", find_missing_number(nums, 6)) # Output: 3"""
        },
        "interviewer_tip": "If the interviewer asks: 'What if $N$ is very large (e.g. $10^9$) and sum overflows in C++/Java?', present the Bitwise XOR method ($O(1)$ space, zero overflow risk).",
        "common_mistakes": "Using nested loops to search each number from 1 to $N$ ($O(N^2)$ runtime).",
        "follow_ups": [
            "How would you find TWO missing numbers in the array?",
            "How do you find the duplicate number if one number is repeated and one is missing?"
        ]
    },

    # 30. Python Garbage Collection
    {
        "id": "pdf-py-gc",
        "company": "Amazon",
        "company_tag": "Python / Product Track",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Medium",
        "frequency": "93% (Python Memory Internals)",
        "question": "Can you explain how Garbage Collection works in Python?",
        "summary": "Python manages memory primarily through Reference Counting, complemented by a Generational Cyclic Garbage Collector to detect reference cycles.",
        "answer": """Python's memory management combines two key mechanisms:

### 1. Reference Counting (Primary):
- Every Python object has an internal `ob_refcnt` field tracking how many references point to it.
- When an object's reference count drops to **zero**, its memory is deallocated **immediately**.

### 2. Generational Cyclic Garbage Collector:
- Reference counting fails on **cyclic references** (Object A references B, and B references A; neither count reaches zero even if unreachable).
- To resolve this, Python runs a background cyclic GC dividing objects into **3 generations** (Gen 0: new objects, Gen 1, Gen 2: long-lived objects).
- The `gc` module allows manual control: `import gc; gc.collect()`.""",
        "code_example": {
            "language": "python",
            "code": """import sys
import gc

# 1. Reference counting demonstration
a = [1, 2, 3]
print("Ref count:", sys.getrefcount(a) - 1) # 1

b = a
print("Ref count:", sys.getrefcount(a) - 1) # 2

# 2. Manual garbage collection for cyclic references
gc.collect()"""
        },
        "interviewer_tip": "Mention the GIL (Global Interpreter Lock) in CPython: Reference counting increments and decrements must be thread-safe, which is one of the foundational historical reasons for the GIL.",
        "common_mistakes": "Thinking Python only uses mark-and-sweep like Java (Python's primary mechanism is immediate reference counting).",
        "follow_ups": [
            "What triggers a collection cycle across Python's 3 generations?",
            "What are weak references in Python (`import weakref`)?"
        ]
    },

    # 31. Regular Expressions (Regex) Pattern Matching
    {
        "id": "pdf-py-regex",
        "company": "Accenture",
        "company_tag": "Accenture / General Tech",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "90% (Pattern Matching & Validation)",
        "question": "Provide examples of pattern matching questions using Regular Expressions (Regex).",
        "summary": "Regex matches specific text patterns like email addresses, phone numbers, and dates using character classes, quantifiers, and anchors.",
        "answer": """**Regular Expressions (Regex)** define search patterns used for input validation, text parsing, and string manipulation.

### Common Real-World Patterns:
1. **Email Validation:** `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`
2. **Phone Number (10 Digits):** `^\\+?[0-9]{1,3}?[- .]?\\d{10}$`
3. **Date Format (`YYYY-MM-DD`):** `^\\d{4}-\\d{2}-\\d{2}$`""",
        "code_example": {
            "language": "python",
            "code": r"""import re

# Email validation example
email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

test_email = "candidate@interviewai.com"
if re.match(email_pattern, test_email):
    print("Valid email address")
else:
    print("Invalid email format")"""
        },
        "interviewer_tip": "Mention `re.compile()` in Python. Compiling a regex pattern once and reusing it speeds up evaluation significantly over compiling it inside loops.",
        "common_mistakes": "Using unescaped dots (`.`), which match any character rather than a literal period.",
        "follow_ups": [
            "What is the difference between re.match(), re.search(), and re.findall() in Python?",
            "What is a greedy vs non-greedy (lazy) quantifier in Regex?"
        ]
    },

    # 32. Handling ETL Schema Change from Numeric to Alphanumeric
    {
        "id": "pdf-etl-datatype",
        "company": "Accenture",
        "company_tag": "Accenture Data / Consulting",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Medium",
        "frequency": "91% (Data Engineering & ETL)",
        "question": "If there is a change of data type in the source column from numeric to alphanumeric, how do you handle it in target database and validate?",
        "summary": "Update ETL mappings, modify target table schema from INT to VARCHAR, implement type casting/cleansing, and run reconciliation validation.",
        "answer": """When a source system column changes from numeric to alphanumeric (e.g., product IDs changing from `1001` to `A-1001`):

### Step-by-Step Resolution:
1. **Impact Analysis:** Identify downstream reports, views, and foreign key relations dependent on the numeric column.
2. **Schema Alteration:** Modify the target and staging table schemas:
   ```sql
   ALTER TABLE TargetTable MODIFY COLUMN product_id VARCHAR(50);
   ```
3. **Update ETL Pipeline:** Update mapping transformations in the ETL pipeline (Informatica / dbt / Spark / Airflow) from Integer to String.
4. **Data Cleansing:** Handle legacy records, trim whitespace, and sanitize incoming formats.
5. **Validation & Reconciliation:**
   - Run row count verification.
   - Run `NULL` and truncation checks (`WHERE LENGTH(product_id) > 50`).
   - Validate checksums between source and target data.""",
        "code_example": {
            "language": "sql",
            "code": """-- Modifying Target Schema
ALTER TABLE Customers 
MODIFY COLUMN customer_code VARCHAR(30) NOT NULL;

-- Verification Query checking for truncation or invalid characters
SELECT customer_code 
FROM Customers 
WHERE customer_code IS NULL 
   OR LENGTH(customer_code) = 0;"""
        },
        "interviewer_tip": "Accenture and IT consultancies evaluate whether you consider downstream impacts (e.g. BI dashboards or external APIs breaking) before changing database types.",
        "common_mistakes": "Truncating data by specifying too small a `VARCHAR` length without checking maximum incoming alphanumeric string length.",
        "follow_ups": [
            "What is schema drift in modern data pipelines?",
            "What is the difference between full load and incremental (CDC) ETL?"
        ]
    },

    # 33. C vs Java Platform Independence & Hiring Question
    {
        "id": "pdf-c-vs-java-fresher",
        "company": "Infosys",
        "company_tag": "Infosys Fresher Track",
        "round": "Technical Round",
        "category": "HR",
        "difficulty": "Easy",
        "frequency": "95% (Infosys Onboarding / HR)",
        "question": "'C is procedural while Java is OOP; Java is platform independent via JVM while C is platform dependent.' How do you answer: 'Why should we hire you?'",
        "summary": "Explain JVM bytecode vs machine code, and tie it into your adaptability, strong foundational fundamentals, and excitement to train on enterprise technologies.",
        "answer": """### Technical Core:
- **C:** Compiled directly into machine-specific native binary code; platform-dependent (requires recompilation on different OS/CPUs).
- **Java:** Compiled into intermediate **Bytecode** (`.class`), which runs on any machine with a Java Virtual Machine (JVM) — *'Write Once, Run Anywhere' (WORA)*.

### 'Why Should We Hire You?' Structured Answer:
"You should hire me because I have built a strong, disciplined foundation in core programming paradigms — understanding low-level memory in C and object-oriented architecture in Java. 

Beyond technical skills, I am highly adaptable, eager to learn, and completely flexible with relocation and training. I look forward to contributing actively to client projects while rapidly mastering enterprise platforms like Cloud and Full Stack systems." """,
        "code_example": None,
        "interviewer_tip": "Keep your response confident, humble, and forward-looking. Emphasize your trainability and positive attitude.",
        "common_mistakes": "Giving a textbook definition without explaining how your technical skills help the company.",
        "follow_ups": [
            "What is the JIT (Just-In-Time) compiler in JVM?",
            "Are you willing to undergo training in new programming languages?"
        ]
    },

    # 34. Abstract Classes vs Interfaces in Java
    {
        "id": "pdf-java-abstract-interface",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Technical Round",
        "category": "OOPs",
        "difficulty": "Medium",
        "frequency": "97% (Core Java OOPs)",
        "question": "What are the differences between Abstract Classes and Interfaces in Java 8+?",
        "summary": "Abstract classes support state (instance variables) and constructors with single inheritance. Interfaces define contracts with multiple inheritance, and support default/static methods in Java 8+.",
        "answer": """### Key Differences:
1. **Inheritance:** A class can extend only **one** abstract class, but can implement **multiple** interfaces.
2. **State / Variables:**
   - Abstract classes can have instance variables (non-final, mutable state).
   - Interfaces can only have `public static final` constants.
3. **Constructors:** Abstract classes can have constructors (invoked via `super()`); interfaces cannot have constructors.
4. **Methods (Java 8+ update):**
   - Abstract classes can have both abstract and concrete methods.
   - Interfaces traditionally had only abstract methods, but since Java 8 they can also have **`default`** and **`static`** implemented methods, and private methods in Java 9+.""",
        "code_example": {
            "language": "java",
            "code": """// Abstract Class: Shares code among closely related classes
abstract class Animal {
    String name;
    Animal(String name) { this.name = name; }
    abstract void sound(); // Abstract method
    void breathe() { System.out.println("Breathing..."); } // Concrete
}

// Interface: Contract for unrelated classes
interface Flyable {
    void fly(); // Abstract contract
    default void glide() { System.out.println("Gliding through air"); }
}"""
        },
        "interviewer_tip": "Highlight the Java 8 `default` method update. It proves you understand modern Java rather than outdated textbooks.",
        "common_mistakes": "Saying that interfaces can never contain any method implementations (Java 8 added default/static methods!).",
        "follow_ups": [
            "Why did Java 8 introduce default methods in interfaces? (To enable lambda support without breaking existing implementations)",
            "What is a Functional Interface and what is the `@FunctionalInterface` annotation?"
        ]
    },

    # 35. Low-Level Design (LLD) Principles
    {
        "id": "pdf-lld-principles",
        "company": "Amazon",
        "company_tag": "Amazon / Product Track",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Hard",
        "frequency": "93% (System Design & LLD)",
        "question": "Can you explain the principles of Low-Level Design (LLD) and provide examples?",
        "summary": "LLD converts high-level architecture into detailed class diagrams, methods, data structures, and SOLID design patterns ready for implementation.",
        "answer": """**Low-Level Design (LLD)** (also called Detailed Design) translates high-level architecture into concrete class diagrams, method signatures, design patterns, and database schemas.

### Core Principles of LLD:
1. **SOLID Principles:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.
2. **Design Patterns:** Applying GoF patterns (Factory, Singleton, Strategy, Observer).
3. **UML Modeling:** Class diagrams, Sequence diagrams, and State machine diagrams.

### Example: User Authentication Module
- `User`: Entity class storing credentials and roles.
- `AuthService`: Interface declaring `login()`, `register()`, `validateToken()`.
- `TokenManager`: Component handling JWT creation and expiry verification.
- `UserRepository`: Interface isolating database operations.""",
        "code_example": {
            "language": "java",
            "code": """// LLD Strategy Pattern for Payment Processing
interface PaymentStrategy {
    void pay(double amount);
}

class UpiPayment implements PaymentStrategy {
    public void pay(double amount) { System.out.println("Paid ₹" + amount + " via UPI"); }
}

class CreditCardPayment implements PaymentStrategy {
    public void pay(double amount) { System.out.println("Paid ₹" + amount + " via Card"); }
}

class CheckoutService {
    private PaymentStrategy strategy;
    public CheckoutService(PaymentStrategy strategy) { this.strategy = strategy; }
    public void completeOrder(double amount) { strategy.pay(amount); }
}"""
        },
        "interviewer_tip": "In LLD rounds, interviewers care about code modularity, loose coupling, and how easily new features can be added without modifying existing tested code (Open/Closed principle).",
        "common_mistakes": "Creating god classes that handle both UI, business logic, and database queries in one massive file.",
        "follow_ups": [
            "Walk me through the Singleton pattern and how to make it thread-safe in Java.",
            "What is the difference between High-Level Design (HLD) and Low-Level Design (LLD)?"
        ]
    },

    # 36. Balanced Parentheses using Stack
    {
        "id": "pdf-dsa-balanced-parentheses",
        "company": "TCS",
        "company_tag": "TCS / Capgemini",
        "round": "Coding & DSA",
        "category": "Coding & DSA",
        "difficulty": "Easy",
        "frequency": "97% (Classic Stack Problem)",
        "question": "Write a program to check for balanced parentheses in an expression using a Stack.",
        "summary": "Push opening brackets '({[' onto stack. When closing bracket is encountered, verify top matches. Stack must be empty at the end.",
        "answer": """### Algorithm:
1. Initialize an empty stack.
2. Iterate through each character in the string:
   - If the character is an opening bracket (`(`, `{`, `[`), **push** it onto the stack.
   - If it is a closing bracket (`)`, `}`, `]`):
     - If the stack is empty, return `False` (unmatched closing bracket).
     - **Pop** the top element. If it doesn't match the closing bracket, return `False`.
3. At the end, return `True` if stack is empty; otherwise `False`.
- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(N)$""",
        "code_example": {
            "language": "python",
            "code": """def is_balanced(expression):
    stack = []
    bracket_map = {')': '(', '}': '{', ']': '['}

    for char in expression:
        if char in "({[":
            stack.append(char)
        elif char in ")}]":
            if not stack:
                return False
            top = stack.pop()
            if top != bracket_map[char]:
                return False

    return len(stack) == 0

# Test cases
print(is_balanced("{[()]}")) # True
print(is_balanced("{[(])}")) # False
print(is_balanced("(()"))    # False"""
        },
        "interviewer_tip": "Handle edge cases clearly: an empty string `\"\"` (returns True), a string with only closing brackets `\"]]\"` (returns False without popping empty stack).",
        "common_mistakes": "Forgetting to check `if not stack:` before popping, which raises an IndexError.",
        "follow_ups": [
            "How would you find the length of the longest valid parentheses substring?",
            "Can you solve this without extra space if only single parenthesis type '()' is present?"
        ]
    },

    # 37. Difference between DELETE and TRUNCATE in SQL
    {
        "id": "pdf-db-delete-truncate",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Easy",
        "frequency": "98% (SQL Core DDL vs DML)",
        "question": "What is the difference between DELETE and TRUNCATE in SQL?",
        "summary": "DELETE is DML (row-by-row, logged, supports WHERE, fires triggers). TRUNCATE is DDL (deallocates pages, faster, no WHERE, resets auto-increment).",
        "answer": """### Key Differences:
1. **SQL Category:**
   - `DELETE`: **DML** (Data Manipulation Language).
   - `TRUNCATE`: **DDL** (Data Definition Language).
2. **Filter / WHERE Clause:**
   - `DELETE`: Supports `WHERE` clause to delete specific rows.
   - `TRUNCATE`: Removes **all rows**; `WHERE` clause is not supported.
3. **Performance & Logging:**
   - `DELETE`: Slower; logs each deleted row individually in the transaction log.
   - `TRUNCATE`: Much faster; deallocates entire data storage pages and logs only page deallocations.
4. **Triggers:**
   - `DELETE`: Activates `ON DELETE` triggers for each row.
   - `TRUNCATE`: Does not fire any delete triggers.
5. **Identity / Auto-Increment:**
   - `DELETE`: Retains current auto-increment sequence value.
   - `TRUNCATE`: Resets auto-increment counter back to seed (1).""",
        "code_example": {
            "language": "sql",
            "code": """-- DELETE: Removes specific rows, slower, fires triggers
DELETE FROM Employees WHERE status = 'Inactive';

-- TRUNCATE: Wipes entire table data instantly, resets ID to 1
TRUNCATE TABLE TempStagingLogs;"""
        },
        "interviewer_tip": "Clarify rollback capability: In modern RDBMS like SQL Server and PostgreSQL, both `DELETE` and `TRUNCATE` can be rolled back if executed inside an active transaction block (`BEGIN TRANSACTION`).",
        "common_mistakes": "Saying 'TRUNCATE can never be rolled back' (in SQL Server and Postgres it CAN be rolled back within a transaction).",
        "follow_ups": [
            "What is the difference between TRUNCATE and DROP?",
            "Can you TRUNCATE a table referenced by a Foreign Key constraint?"
        ]
    },

    # 38. Bubble Sort and Time Complexity
    {
        "id": "pdf-dsa-bubble-sort",
        "company": "Capgemini",
        "company_tag": "Capgemini / Wipro",
        "round": "Coding & DSA",
        "category": "Coding & DSA",
        "difficulty": "Easy",
        "frequency": "92% (Sorting Algorithms)",
        "question": "Explain Bubble Sort, its time complexity, and write the optimized algorithm.",
        "summary": "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if in wrong order. Best case O(N), Worst case O(N^2).",
        "answer": """**Bubble Sort** is a comparison-based sorting algorithm where adjacent elements are repeatedly compared and swapped if they are in descending order. In each pass, the largest unsorted element 'bubbles up' to its correct final position at the end of the array.

### Time & Space Complexities:
- **Best Case:** $O(N)$ (when array is already sorted, detected via `swapped` flag).
- **Average Case:** $O(N^2)$
- **Worst Case:** $O(N^2)$ (when array is in reverse order).
- **Space Complexity:** $O(1)$ (in-place sorting).
- **Stability:** **Stable** (does not alter the relative order of identical elements).""",
        "code_example": {
            "language": "cpp",
            "code": """#include <iostream>
using namespace std;

void bubbleSortOptimized(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;

        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }

        // If no two elements were swapped in inner loop, array is sorted
        if (!swapped) break;
    }
}"""
        },
        "interviewer_tip": "Always include the boolean `swapped` optimization! Without it, Bubble Sort runs in $O(N^2)$ even on an already-sorted array.",
        "common_mistakes": "Running the inner loop up to `n - 1` instead of `n - i - 1`, doing unnecessary comparisons on already sorted tail elements.",
        "follow_ups": [
            "Why is Bubble Sort rarely used in production compared to QuickSort or MergeSort?",
            "What makes a sorting algorithm 'stable'?"
        ]
    },

    # 39. JDK vs JRE vs JVM
    {
        "id": "pdf-java-jdk-jre-jvm",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "98% (Java Architecture Basics)",
        "question": "Explain the difference between JDK, JRE, and JVM in Java.",
        "summary": "JVM executes bytecode. JRE contains JVM + core libraries to run apps. JDK contains JRE + development tools (javac, debugger) to write and compile apps.",
        "answer": """### 1. JVM (Java Virtual Machine):
- Abstract computing machine that executes compiled Java **bytecode** (`.class`).
- Provides platform independence by converting bytecode into platform-specific machine code.
- Contains ClassLoader, JVM Memory Areas (Heap, Stack, Method Area), and Execution Engine (Interpreter + JIT Compiler + GC).

### 2. JRE (Java Runtime Environment):
- **Formula:** $\\text{JRE} = \\text{JVM} + \\text{Core Class Libraries} + \\text{Supporting Files}$
- Minimum requirement needed to **run** a Java program. Does NOT contain development tools like `javac`.

### 3. JDK (Java Development Kit):
- **Formula:** $\\text{JDK} = \\text{JRE} + \\text{Development Tools}$ (`javac`, `jdb`, `javadoc`, `jar`)
- Complete software development environment needed to **develop, compile, and run** Java applications.""",
        "code_example": None,
        "interviewer_tip": "Remember: Developers need the JDK; end users running an application only need the JRE.",
        "common_mistakes": "Stating that JVM is platform-independent. (Bytecode is platform-independent, but the JVM itself is platform-dependent!).",
        "follow_ups": [
            "What is the role of the JIT (Just-In-Time) compiler inside the JVM?",
            "What is the Java ClassLoader subsystem?"
        ]
    },

    # 40. Longest Palindrome in String
    {
        "id": "pdf-algo-longest-palindrome",
        "company": "Amazon",
        "company_tag": "Amazon / Capgemini",
        "round": "Coding & DSA",
        "category": "Coding & DSA",
        "difficulty": "Medium",
        "frequency": "94% (String Algorithms)",
        "question": "Write a Python program to find the longest palindromic substring in a string.",
        "summary": "Expand around center for both odd and even length centers in O(n^2) time and O(1) auxiliary space.",
        "answer": """A palindrome reads the same backwards and forwards. A string has $2n - 1$ possible centers (each character for odd lengths, between characters for even lengths).

### Expand Around Center Algorithm:
1. For each index $i$ in string:
   - Expand outward checking `s[left] == s[right]` for **odd palindrome** (center `i, i`).
   - Expand outward for **even palindrome** (center `i, i+1`).
2. Track the longest substring observed.
- **Time Complexity:** $O(N^2)$
- **Space Complexity:** $O(1)$ auxiliary space (optimal compared to dynamic programming $O(N^2)$ table).""",
        "code_example": {
            "language": "python",
            "code": """def longest_palindrome(s: str) -> str:
    if not s or len(s) < 1:
        return ""

    def expand_around_center(left: int, right: int) -> str:
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]

    longest = ""
    for i in range(len(s)):
        # Odd length palindrome (center is s[i])
        odd = expand_around_center(i, i)
        # Even length palindrome (center between s[i] and s[i+1])
        even = expand_around_center(i, i + 1)
        
        longest = max(longest, odd, even, key=len)

    return longest

# Example:
print(longest_palindrome("babad")) # Output: "bab" or "aba"
print(longest_palindrome("cbbd"))  # Output: "bb" """
        },
        "interviewer_tip": "Mention Manacher's Algorithm ($O(N)$ linear time) if targeting top tech companies, noting that Expand Around Center ($O(N^2)$) is the standard clean interview solution.",
        "common_mistakes": "Checking all $O(N^2)$ substrings with $O(N)$ palindrome verification, resulting in an inefficient $O(N^3)$ brute-force approach.",
        "follow_ups": [
            "How does Manacher's Algorithm achieve O(N) linear time?",
            "How many distinct palindromic substrings exist in a string?"
        ]
    },

    # 41. TCP/IP Model and Its Layers
    {
        "id": "pdf-net-tcp-ip",
        "company": "Core CS",
        "company_tag": "Networking Track",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Medium",
        "frequency": "93% (Computer Networks Core)",
        "question": "Explain the TCP/IP model and its 4 layers.",
        "summary": "The TCP/IP model has 4 layers: Application, Transport, Internet, and Network Access (Link) layer.",
        "answer": """The **TCP/IP model** is the foundational protocol suite powering the global Internet.

### The 4 Layers of TCP/IP:
1. **Application Layer:** Provides user protocols for communication (HTTP, HTTPS, FTP, SMTP, DNS, SSH).
2. **Transport Layer:** Responsible for end-to-end data delivery:
   - **TCP:** Connection-oriented, reliable, with congestion and flow control.
   - **UDP:** Connectionless, unreliable, low-latency streaming protocol.
3. **Internet Layer:** Handles logical addressing and routing packets across networks (IPv4, IPv6, ICMP, ARP).
4. **Network Access (Link / Network Interface) Layer:** Handles physical hardware transmission over cables and switches (Ethernet, Wi-Fi, MAC addresses).""",
        "code_example": None,
        "interviewer_tip": "Interviewers love contrasting TCP (3-way handshake SYN-SYNACK-ACK, reliable) with UDP (fire-and-forget, ideal for gaming and live video streaming).",
        "common_mistakes": "Confusing the 4-layer TCP/IP model with the 7-layer theoretical OSI reference model.",
        "follow_ups": [
            "Explain the TCP 3-way handshake process.",
            "What is the difference between IPv4 and IPv6?"
        ]
    },

    # 42. Binary Search Tree (BST) Concept & Insertion Algorithm
    {
        "id": "pdf-dsa-bst-insert",
        "company": "Capgemini",
        "company_tag": "Capgemini / TCS",
        "round": "Coding & DSA",
        "category": "Coding & DSA",
        "difficulty": "Medium",
        "frequency": "95% (Tree Data Structures)",
        "question": "Explain the concept of a Binary Search Tree (BST) and write its insertion algorithm.",
        "summary": "A BST is a binary tree where left child < root < right child. Inorder traversal produces sorted keys.",
        "answer": """A **Binary Search Tree (BST)** is a hierarchical binary tree data structure with the ordering property:
- For any node $N$:
  - All keys in the **left subtree** are strictly **less than** $N$'s key.
  - All keys in the **right subtree** are strictly **greater than** $N$'s key.
  - In-order traversal (`Left -> Root -> Right`) of a BST always yields keys in **ascending sorted order**.

### Time Complexity:
- Average Case: $O(\\log N)$ for search, insertion, and deletion.
- Worst Case: $O(N)$ (skewed tree — resolved by self-balancing AVL or Red-Black trees).""",
        "code_example": {
            "language": "python",
            "code": """class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None

def insert(root, key):
    # 1. Base case: create new node if tree is empty
    if root is None:
        return Node(key)

    # 2. Recur down the tree
    if key < root.key:
        root.left = insert(root.left, key)
    elif key > root.key:
        root.right = insert(root.right, key)

    return root

# Example Usage
root = None
keys = [50, 30, 70, 20, 40, 60, 80]
for k in keys:
    root = insert(root, k)"""
        },
        "interviewer_tip": "Mention how skewed BSTs degrade to $O(N)$ (acting like a linked list), and how balanced trees (AVL, Red-Black) maintain strict $O(\\log N)$ height balance.",
        "common_mistakes": "Allowing duplicate keys without specifying policy (BST typically stores distinct keys or uses counter).",
        "follow_ups": [
            "How do you delete a node with two children from a BST?",
            "How do you validate if a given binary tree is a valid BST?"
        ]
    },

    # 43. 7 Layers of OSI Model
    {
        "id": "pdf-net-osi-7-layers",
        "company": "Wipro",
        "company_tag": "Wipro / Core CS",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Medium",
        "frequency": "96% (Computer Networks Standard)",
        "question": "What are the 7 layers of the OSI model? Explain each layer's role.",
        "summary": "Physical, Data Link, Network, Transport, Session, Presentation, Application (Mnemonic: Please Do Not Throw Sausage Pizza Away).",
        "answer": """The **OSI (Open Systems Interconnection)** reference model defines 7 conceptual layers of network communication:

1. **Layer 7 — Application:** User interface and application services (HTTP, FTP, SMTP, DNS).
2. **Layer 6 — Presentation:** Data formatting, encryption/decryption, and compression (SSL/TLS, JSON, JPEG).
3. **Layer 5 — Session:** Establishes, manages, and terminates dialog connections between applications.
4. **Layer 4 — Transport:** End-to-end communication, segmentation, flow control, and error recovery (TCP, UDP, Ports).
5. **Layer 3 — Network:** Logical addressing and packet routing across different networks (IP, Routers).
6. **Layer 2 — Data Link:** Framing, MAC physical addressing, error detection between adjacent nodes (Ethernet, Switches).
7. **Layer 1 — Physical:** Raw bitstream transmission over physical cables, radio waves, and fiber optics.""",
        "code_example": None,
        "interviewer_tip": "Remember the popular mnemonic: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way (Physical to Application).",
        "common_mistakes": "Confusing routers (Layer 3 - Network) with switches (Layer 2 - Data Link).",
        "follow_ups": [
            "At which layer do HTTP and HTTPS operate?",
            "What is encapsulation and decapsulation as a packet travels down and up the OSI stack?"
        ]
    },

    # 44. Compiler vs Interpreter
    {
        "id": "pdf-compiler-vs-interpreter",
        "company": "Accenture",
        "company_tag": "Accenture Freshers Track",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "92% (Language Processing Fundamentals)",
        "question": "What is the difference between a Compiler and an Interpreter?",
        "summary": "Compiler translates entire source code into machine code prior to execution. Interpreter executes instructions line-by-line at runtime.",
        "answer": """### Key Differences:
- **Compiler:**
  - Translates the entire source code program into target machine code or bytecode all at once before execution.
  - Generates intermediate object code (`.obj` or `.exe`).
  - Execution is fast once compiled.
  - Examples: C, C++, Rust, Go.
- **Interpreter:**
  - Translates and executes instructions statement-by-statement at runtime without generating an independent object file.
  - Slower execution compared to compiled binaries, but provides easier dynamic debugging.
  - Examples: Python, JavaScript, Ruby, PHP.
- **Hybrid Approach:** Languages like Java and C# compile to intermediate bytecode (`.class` or MSIL), which is then interpreted or JIT-compiled at runtime by the virtual machine.""",
        "code_example": None,
        "interviewer_tip": "Point out that compilation vs interpretation is a property of the *implementation/runtime*, not strictly the language syntax itself (e.g., CPython interprets, PyPy JIT-compiles).",
        "common_mistakes": "Saying Java is purely compiled or purely interpreted (it is hybrid: compiles to bytecode, JIT-interprets at runtime).",
        "follow_ups": [
            "What is Just-In-Time (JIT) compilation?",
            "What are the main phases of a compiler?"
        ]
    },

    # 45. What is an API?
    {
        "id": "pdf-web-api-def",
        "company": "Accenture",
        "company_tag": "Accenture / Web Track",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "95% (Web & API Integration)",
        "question": "What is an API? Explain RESTful APIs with an example.",
        "summary": "An API (Application Programming Interface) defines protocols and tools for software components to communicate, typically via HTTP REST endpoints returning JSON.",
        "answer": """An **API (Application Programming Interface)** is a set of rules and protocols enabling different software applications to communicate and exchange data.

### RESTful APIs:
In modern web applications, **REST (Representational State Transfer)** APIs expose resources over standard HTTP protocols:
- `GET /api/products`: Retrieve list of products.
- `POST /api/orders`: Create a new order with payload data.
- `PUT /api/users/1`: Update user record with ID 1.
- `DELETE /api/items/5`: Delete item with ID 5.

Data is formatted and exchanged using structured **JSON (JavaScript Object Notation)** with standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Server Error`).""",
        "code_example": {
            "language": "python",
            "code": """from fastapi import FastAPI

app = FastAPI()

# Example REST Endpoint
@app.get("/api/products/{product_id}")
def get_product(product_id: int):
    return {
        "product_id": product_id,
        "name": "Mechanical Keyboard",
        "price": 2999.00,
        "status": "In Stock"
    }"""
        },
        "interviewer_tip": "Mention the key constraints of REST: Statelessness, Client-Server architecture, Cacheability, and Uniform Interface.",
        "common_mistakes": "Confusing an API with a user interface (UI). APIs are programmatic contracts between systems.",
        "follow_ups": [
            "What is the difference between REST and GraphQL?",
            "What is the difference between HTTP PUT and PATCH?"
        ]
    },

    # 46. SQL WHERE vs HAVING
    {
        "id": "pdf-sql-where-vs-having",
        "company": "Accenture",
        "company_tag": "Accenture / TCS",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Easy",
        "frequency": "98% (Top SQL Query Distinction)",
        "question": "What is the difference between WHERE and HAVING clauses in SQL?",
        "summary": "WHERE filters individual rows before aggregation. HAVING filters grouped rows after GROUP BY aggregate calculations.",
        "answer": """### Key Differences:
1. **Application Level:**
   - `WHERE`: Filters **individual rows** before groups are formed and before aggregates are calculated.
   - `HAVING`: Filters **aggregated groups** after the `GROUP BY` operation.
2. **Aggregate Functions:**
   - `WHERE` **cannot** contain aggregate functions (`WHERE COUNT(*) > 5` causes a syntax error!).
   - `HAVING` **can** use aggregate functions (`HAVING COUNT(*) > 5` or `HAVING AVG(salary) > 50000`).
3. **Execution Order in SQL Engine:**
   `FROM` $\\rightarrow$ `WHERE` $\\rightarrow$ `GROUP BY` $\\rightarrow$ `HAVING` $\\rightarrow$ `SELECT` $\\rightarrow$ `ORDER BY`.""",
        "code_example": {
            "language": "sql",
            "code": """-- Demonstration using both WHERE and HAVING
SELECT department_id, COUNT(*) AS employee_count, AVG(salary) AS avg_sal
FROM Employee
WHERE salary >= 25000       -- 1. Filters individual employees FIRST
GROUP BY department_id      -- 2. Groups remaining employees by department
HAVING COUNT(*) > 5         -- 3. Filters departments with more than 5 qualifying employees
ORDER BY avg_sal DESC;"""
        },
        "interviewer_tip": "Reciting the SQL query logical processing execution order (`FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY`) immediately impresses the panel.",
        "common_mistakes": "Attempting to use `WHERE AVG(salary) > 50000`, which is invalid SQL.",
        "follow_ups": [
            "Can HAVING be used without a GROUP BY clause in SQL?",
            "What is the performance difference between filtering in WHERE versus HAVING?"
        ]
    },

    # 47. How to Debug a Slow Web Page
    {
        "id": "pdf-web-debug-slow",
        "company": "Accenture",
        "company_tag": "Accenture / Web Track",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Medium",
        "frequency": "92% (Web Performance & Optimization)",
        "question": "How would you diagnose and debug a slow web application in production?",
        "summary": "Analyze network waterfall in DevTools, check Core Web Vitals (LCP, INP, CLS), optimize render-blocking CSS/JS, compress images, and leverage caching.",
        "answer": """### Systematic Web Performance Debugging Steps:
1. **Measure First with Chrome DevTools:**
   - **Network Tab / Waterfall:** Check DNS lookup, TTFB (Time to First Byte), and payload transfer sizes.
   - **Performance Tab:** Profile CPU flame charts to identify long JavaScript tasks blocking the main thread (> 50ms).
   - **Lighthouse Audit:** Evaluate Core Web Vitals:
     - **LCP (Largest Contentful Paint):** Loading speed (< 2.5s).
     - **INP (Interaction to Next Paint):** Responsiveness (< 200ms).
     - **CLS (Cumulative Layout Shift):** Visual stability (< 0.1).
2. **Key Optimizations:**
   - **Render-Blocking Resources:** Add `defer` or `async` to non-critical `<script>` tags.
   - **Asset Optimization:** Compress images to WebP/AVIF format and enable lazy loading (`loading="lazy"`).
   - **Caching & CDN:** Leverage browser caching (`Cache-Control: max-age`) and CDN edge delivery.
   - **Code Splitting:** Lazy-load routes and heavy components using dynamic `import()`.""",
        "code_example": None,
        "interviewer_tip": "Always state: 'Measure before optimizing — never guess.' Mention Core Web Vitals (LCP, INP, CLS) to demonstrate modern frontend engineering knowledge.",
        "common_mistakes": "Jumping immediately to random code changes without profiling the network waterfall or CPU flame graph.",
        "follow_ups": [
            "What is Time to First Byte (TTFB) and what causes high TTFB?",
            "What is Critical Rendering Path?"
        ]
    },

    # 48. Why are there No Global Variables in Java?
    {
        "id": "pdf-java-no-globals",
        "company": "Accenture",
        "company_tag": "Accenture / Java Track",
        "round": "Technical Round",
        "category": "OOPs",
        "difficulty": "Easy",
        "frequency": "93% (Java Language Philosophy)",
        "question": "Why does Java not support global variables like C/C++?",
        "summary": "Java promotes strict encapsulation, avoids global namespace pollution, prevents thread-safety bugs, and maintains referential transparency.",
        "answer": """Java does not have a `global` keyword because James Gosling and Java's designers intentionally designed it as a pure Object-Oriented language enforcing encapsulation.

### 4 Key Reasons:
1. **Encapsulation & Security:** Global variables can be accessed and modified from anywhere in the codebase, leading to uncontrolled side effects and spaghetti code.
2. **Namespace Collisions:** Global variables create naming conflicts when combining libraries from different vendors.
3. **Thread Safety Issues:** In multithreaded applications, shared global variables cause race conditions unless heavily locked.
4. **How Java Achieves Shared State Cleanly:**
   - Using `public static final` constants scoped inside a class (e.g. `Math.PI`).""",
        "code_example": {
            "language": "java",
            "code": """public class AppConfig {
    // Clean, scoped constant replacement in Java
    public static final String APP_NAME = "InterviewAI";
    public static final int MAX_RETRIES = 3;
}"""
        },
        "interviewer_tip": "Mention that `public static` variables within a class serve a similar purpose when needed, but are always explicitly scoped under a class namespace.",
        "common_mistakes": "Saying that Java has no way to share data across classes (classes can declare static members).",
        "follow_ups": [
            "What is the difference between static and non-static variables in Java?",
            "What is the Singleton design pattern?"
        ]
    },

    # 49. Constructor vs Method in OOP
    {
        "id": "pdf-oop-constructor-vs-method",
        "company": "TCS",
        "company_tag": "TCS / Capgemini",
        "round": "Technical Round",
        "category": "OOPs",
        "difficulty": "Easy",
        "frequency": "96% (OOPs Core Fundamentals)",
        "question": "What is the difference between a Constructor and a Method?",
        "summary": "A constructor initializes a newly created object, shares the class name, has no return type, and is invoked via 'new'. A method defines object behavior, has a return type, and is invoked via dot operator.",
        "answer": """### Key Differences:
1. **Purpose:**
   - **Constructor:** Initializes instance variables of an object upon creation.
   - **Method:** Performs operations and executes business logic for an existing object.
2. **Name:**
   - **Constructor:** Must have the **exact same name** as the class.
   - **Method:** Can have any valid identifier name.
3. **Return Type:**
   - **Constructor:** Has **no return type** (not even `void`).
   - **Method:** Must declare a return type (`void`, primitive, or object type).
4. **Invocation:**
   - **Constructor:** Invoked implicitly when creating an instance with `new` keyword.
   - **Method:** Invoked explicitly using the dot operator (`object.methodName()`).""",
        "code_example": {
            "language": "java",
            "code": """public class Student {
    String name;

    // Constructor (no return type, matches class name)
    public Student(String name) {
        this.name = name;
    }

    // Method (has return type 'void')
    public void display() {
        System.out.println("Student: " + name);
    }
}"""
        },
        "interviewer_tip": "Point out default constructors: If you don't define any constructor, the compiler provides a default no-argument constructor; but if you define any parameterized constructor, the default constructor is suppressed.",
        "common_mistakes": "Giving a constructor a return type (`void Student()` turns it into a regular method with a bad name!).",
        "follow_ups": [
            "Can a constructor be private in Java? (Yes, in Singleton pattern or utility classes)",
            "What is constructor chaining using `this()` and `super()`?"
        ]
    },

    # 50. Thrashing in Operating Systems
    {
        "id": "pdf-os-thrashing",
        "company": "Cognizant",
        "company_tag": "Cognizant / Core CS",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Medium",
        "frequency": "92% (Virtual Memory & Paging)",
        "question": "How does Thrashing cause computer performance to degrade?",
        "summary": "Thrashing occurs when the OS spends more time swapping virtual memory pages between RAM and disk than executing user processes.",
        "answer": """**Thrashing** occurs in an operating system when physical RAM is insufficient to hold the working sets of all active processes.

### Mechanism & Breakdown:
1. When memory is full and a process requests a page not in RAM, a **Page Fault** occurs.
2. The OS page replacement algorithm swaps a page out to disk and reads the required page from disk.
3. Because all processes need memory simultaneously, replaced pages are immediately needed again, causing continuous page faults.
4. **Result:** Disk I/O queues become saturated, CPU utilization drops near zero because processes are constantly waiting for disk I/O, and the computer freezes or becomes completely unresponsive.

### Prevention & Recovery:
- **Working Set Model:** Allocating each process enough page frames to cover its working set.
- **Page Fault Frequency (PFF):** Suspending low-priority processes if overall page fault rate exceeds threshold.
- Adding physical RAM to the system.""",
        "code_example": None,
        "interviewer_tip": "Mention the Working Set Model by Peter Denning as the textbook solution to prevent thrashing in modern operating systems.",
        "common_mistakes": "Confusing thrashing with a deadlock or infinite loop (thrashing is high paging I/O activity with zero useful CPU work).",
        "follow_ups": [
            "What is Page Fault Frequency (PFF)?",
            "What is Belady's Anomaly in FIFO page replacement?"
        ]
    },

    # 51. Turnaround Time vs Response Time
    {
        "id": "pdf-os-turnaround-response",
        "company": "Wipro",
        "company_tag": "Wipro / Core CS",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "91% (CPU Scheduling Metrics)",
        "question": "What is the difference between Turnaround Time and Response Time in CPU scheduling?",
        "summary": "Turnaround Time = Completion Time - Arrival Time. Response Time = First Response Time - Arrival Time.",
        "answer": """### Definitions & Formulas:
1. **Turnaround Time (TAT):**
   - The total elapsed time from the moment a process is submitted until it completely finishes execution.
   $$\\text{Turnaround Time} = \\text{Completion Time} - \\text{Arrival Time}$$
   - Includes waiting time in the ready queue, I/O operations, and CPU execution time.

2. **Response Time (RT):**
   - The time elapsed from the submission of a process until the CPU produces its **first response** or first slice of CPU time.
   $$\\text{Response Time} = \\text{Time of First CPU Execution} - \\text{Arrival Time}$$
   - Crucial metric in interactive time-sharing systems where quick feedback matters to users.""",
        "code_example": None,
        "interviewer_tip": "Explain that Round Robin scheduling optimizes **Response Time** for interactive systems, while Shortest Job First (SJF) minimizes average **Turnaround Time**.",
        "common_mistakes": "Confusing Waiting Time with Turnaround Time (Waiting Time = Turnaround Time - Burst Time).",
        "follow_ups": [
            "How does Round Robin CPU scheduling balance response time and context-switching overhead?",
            "What is Starvation in Priority Scheduling?"
        ]
    },

    # 52. Introduce Yourself (HR Opening Question)
    {
        "id": "pdf-hr-intro-yourself",
        "company": "TCS",
        "company_tag": "All Companies HR",
        "round": "HR & Behavioral",
        "category": "HR",
        "difficulty": "Easy",
        "frequency": "100% (Opening Question in Every Interview)",
        "question": "Tell me about yourself / Introduce yourself (Structured Elevator Pitch).",
        "summary": "Concise 60-90 second summary covering academic background, core technical skills, notable projects, and enthusiasm for the target role.",
        "answer": """### Proven 4-Part Structure (The Present-Past-Future Model):
1. **Who You Are (Present):** "Hello, my name is [Name]. I graduated with a degree in Computer Science/IT from [University], where I developed a strong foundation in data structures, database design, and software development."
2. **Key Skills & Experience (Past):** "Over my academic coursework and internship/projects, I have focused primarily on [Python / Java / Full Stack], building projects such as [Project Name — e.g., an automated web application or AI system]. Through this, I gained hands-on experience in API development, database optimization, and teamwork."
3. **Problem-Solving Passion:** "What drives me most is practical problem-solving — breaking down complex problems into clean, modular code."
4. **Why This Role (Future):** "I am enthusiastic about starting my career at [Company Name] because of your innovation track record and learning opportunities, and I look forward to contributing to your engineering teams." """,
        "code_example": None,
        "interviewer_tip": "Keep it under 90 seconds. Don't recite your entire resume line-by-line; focus on what makes you a capable, excited software engineer.",
        "common_mistakes": "Talking extensively about school hobbies or family background instead of technical projects and problem-solving readiness.",
        "follow_ups": [
            "What has been your proudest achievement in college?",
            "Why did you choose Computer Science / Engineering?"
        ]
    },

    # 53. Project Discussion (STAR Method)
    {
        "id": "pdf-hr-project-discussion",
        "company": "Capgemini",
        "company_tag": "All Companies Tech/HR",
        "round": "HR & Behavioral",
        "category": "HR",
        "difficulty": "Easy",
        "frequency": "98% (Core Project Review)",
        "question": "What projects have you worked on? Walk me through your most technically challenging project.",
        "summary": "Explain using the STAR framework: Situation/Problem, Task/Role, Architecture & Technologies used, Challenge encountered, and Measurable Outcome.",
        "answer": """### STAR Framework for Project Discussion:
1. **Situation & Overview:** "In my final year, our team developed [Project Title], an application designed to solve [specific user/business problem]."
2. **Task & Role:** "As the backend and database lead, I was responsible for designing the database schema, creating RESTful API endpoints, and implementing user authentication."
3. **Technologies Used:** "We built the application using [Python FastAPI / Node.js / Java], connected to a [PostgreSQL / MySQL] database with JWT security."
4. **Challenge & Resolution:** "A significant technical challenge was handling high-latency database queries during concurrent operations. I profiled the slow queries and added composite B-Tree indexes on foreign keys, which reduced query response times by over 60%."
5. **Outcome:** "The project achieved an 'A' grade and was showcased at our college technical symposium." """,
        "code_example": None,
        "interviewer_tip": "Always prepare one specific technical challenge you overcame (e.g. debugging a concurrency deadlock, optimizing query latency, or integrating a tricky third-party API).",
        "common_mistakes": "Using vague passive voice like 'The project was done' without clarifying YOUR individual code contributions.",
        "follow_ups": [
            "If you had another month, what improvements or architectural changes would you add to this project?",
            "How did your team resolve code conflicts in Git?"
        ]
    },

    # 54. Primary Key vs Secondary Key in DBMS
    {
        "id": "pdf-db-pk-vs-secondary",
        "company": "TCS",
        "company_tag": "TCS NQT / Digital",
        "round": "Technical Round",
        "category": "DBMS & SQL",
        "difficulty": "Easy",
        "frequency": "92% (Database Keys)",
        "question": "What is the difference between a Primary Key and a Secondary Key in DBMS?",
        "summary": "Primary key uniquely identifies each row and cannot be NULL. Secondary key is an indexed column used to accelerate search lookups and does not have to be unique.",
        "answer": """### Key Differences:
- **Primary Key:**
  - A column or combination of columns that **uniquely identifies** each row in a table.
  - Cannot contain duplicate values or `NULL` values.
  - Only **one** primary key per table (forms the default clustered index).
- **Secondary Key (Alternative / Search Key):**
  - A candidate key not chosen as primary, or an index created on non-primary columns (e.g., `email`, `department_name`) used to accelerate search queries.
  - Does not necessarily have to be strictly unique unless defined with a `UNIQUE` constraint.
  - A table can have **multiple** secondary keys.""",
        "code_example": {
            "language": "sql",
            "code": """CREATE TABLE Students (
    student_id INT PRIMARY KEY,      -- Primary Key (Unique, Not Null)
    email VARCHAR(100) UNIQUE,       -- Secondary Candidate Key (Unique)
    department VARCHAR(50)           -- Secondary Search Key (Indexed, allows duplicates)
);

CREATE INDEX idx_student_dept ON Students(department);"""
        },
        "interviewer_tip": "Mention that Secondary Keys are implemented via Non-Clustered B-Tree indexes pointing back to the Clustered Primary Key row locator.",
        "common_mistakes": "Confusing Secondary Key with Foreign Key (a foreign key references a primary key in another table).",
        "follow_ups": [
            "What is the difference between a Super Key and a Candidate Key?",
            "What is a composite primary key?"
        ]
    },

    # 55. Diamond Problem in OOP
    {
        "id": "pdf-oop-diamond-problem",
        "company": "Capgemini",
        "company_tag": "Capgemini Technical",
        "round": "Technical Round",
        "category": "OOPs",
        "difficulty": "Medium",
        "frequency": "95% (Multiple Inheritance Ambiguity)",
        "question": "What is the Diamond Problem in OOP and how is it resolved in Java and C++?",
        "summary": "The Diamond Problem occurs in multiple inheritance when a class inherits from two parent classes that share a common base class, causing ambiguous method resolution.",
        "answer": """### The Diamond Problem:
Suppose Class B and Class C inherit from Class A. Class D inherits from both Class B and Class C. If Class A has a method `display()`, which version does Class D inherit?
This creates the famous **Diamond Inheritance Ambiguity**.

### How Languages Resolve It:
1. **Java:**
   - Disallows multiple inheritance of classes (`class D extends B, C` is illegal).
   - Allows implementing multiple **interfaces**. If two interfaces have default methods with the exact same signature, Java forces Class D to override the method and explicitly declare which one to invoke (`B.super.display()`).
2. **C++:**
   - Solves it using **Virtual Base Classes** (`class B : virtual public A`). This ensures only a single shared instance of Class A is inherited by Class D.""",
        "code_example": {
            "language": "cpp",
            "code": """// C++ Virtual Base Class Solution
class A {
public:
    void show() { cout << "Hello from A" << endl; }
};

class B : virtual public A {};
class C : virtual public A {};

class D : public B, public C {};

int main() {
    D obj;
    obj.show(); // Unambiguous! Only one instance of A exists.
    return 0;
}"""
        },
        "interviewer_tip": "Capgemini panels love asking why Java doesn't support multiple class inheritance: state 'To prevent the Diamond Problem and pointer memory complexity.'",
        "common_mistakes": "Saying Java has no solution to multiple inheritance (Java solves it cleanly via interfaces).",
        "follow_ups": [
            "How does Java 8 resolve default method conflicts in multiple interfaces?",
            "What is virtual inheritance in C++?"
        ]
    },

    # 56. What is XML and Applications?
    {
        "id": "pdf-xml-applications",
        "company": "Wipro",
        "company_tag": "Wipro / Core Tech",
        "round": "Technical Round",
        "category": "Core CS",
        "difficulty": "Easy",
        "frequency": "89% (Data Formats & Web Services)",
        "question": "What is XML, and what are its primary applications in software development?",
        "summary": "XML (Extensible Markup Language) is a human- and machine-readable markup language used to structure, store, and exchange data.",
        "answer": """**XML (Extensible Markup Language)** is a text-based markup language derived from SGML designed to store and transport structured data.

### Key Applications of XML:
1. **Application Configuration:** Java `pom.xml` (Maven), Android `AndroidManifest.xml` and UI layouts, Spring `applicationContext.xml`.
2. **Enterprise Web Services (SOAP):** Used as the payload envelope in SOAP-based banking and enterprise legacy APIs.
3. **Data Exchange:** B2B data exchange between heterogeneous platforms.
4. **Document Storage:** SVG vector images, Microsoft Office formats (`.docx`, `.xlsx` are zipped XML files).""",
        "code_example": {
            "language": "xml",
            "code": """<?xml version="1.0" encoding="UTF-8"?>
<employee id="101">
    <name>Moumi Dey</name>
    <role>Software Engineer</role>
    <salary>75000</salary>
</employee>"""
        },
        "interviewer_tip": "Compare XML with JSON: XML is heavier and verbosely tagged with attribute support and schema validation (XSD); JSON is lightweight, faster to parse, and native to JavaScript.",
        "common_mistakes": "Assuming XML has predefined tags like HTML (in XML, the author invents all tags).",
        "follow_ups": [
            "How does JSON compare with XML in modern REST APIs?",
            "What is an XML parser (DOM vs SAX parser)?"
        ]
    }
]

# Supported Companies with metadata & hiring patterns
COMPANIES_METADATA = [
    {
        "id": "tcs",
        "name": "TCS",
        "full_name": "Tata Consultancy Services",
        "tagline": "NQT, Digital & Ninja Tracks",
        "category": "Service-Based / Enterprise",
        "rounds": [
            {"name": "NQT Foundation", "desc": "Numerical Ability, Verbal & Reasoning (60m)"},
            {"name": "NQT Advanced", "desc": "Advanced Quantitative & 2 Coding Problems (40m)"},
            {"name": "Technical Interview", "desc": "OOPs, DBMS, Stack/Heap memory, DSA & Projects"},
            {"name": "Managerial & HR", "desc": "Relocation, shifts, Tata culture & behavioral STAR"}
        ],
        "key_topics": ["Stack vs Heap Memory", "Call by Value/Ref", "Method Overloading/Overriding", "ACID in DBMS", "SQL 2nd Highest Salary", "Linked List", "Arrays", "Balanced Parentheses", "DELETE vs TRUNCATE"],
        "total_questions": 18,
        "accent": "rose"
    },
    {
        "id": "capgemini",
        "name": "Capgemini",
        "full_name": "Capgemini Technology Services",
        "tagline": "Technical, Pseudo-code & HR Tracks",
        "category": "Service-Based / Global Consulting",
        "rounds": [
            {"name": "Pseudo-code Round", "desc": "Bitwise logic, loops, recursion & data structures (30 questions)"},
            {"name": "English & Spoken Comm", "desc": "Grammar, sentence completion & audio test"},
            {"name": "Technical Round", "desc": "4 Pillars of OOPs, Exception Handling, String immutability, SQL Joins"},
            {"name": "HR Interview", "desc": "Seven Values, team conflict resolution, work adaptability"}
        ],
        "key_topics": ["4 Pillars of OOPs", "Bitwise XOR & Shift Pseudocode", "Exception Handling (throw/throws/finally)", "String vs StringBuilder", "Floyd's Cycle Algorithm", "Capgemini Values", "Prime Check", "Abstract Class vs Interface"],
        "total_questions": 16,
        "accent": "cyan"
    },
    {
        "id": "infosys",
        "name": "Infosys",
        "full_name": "Infosys Limited",
        "tagline": "DSE, Specialist & System Engineer",
        "category": "Service-Based / Enterprise",
        "rounds": [
            {"name": "Online Test", "desc": "Reasoning, Technical Data Structures & Pseudocode"},
            {"name": "Technical Round", "desc": "Database Indexing, Binary Search, Normalization, Java/Python basics"},
            {"name": "HR Interview", "desc": "Willingness to train at Infosys Mysore campus & project discussion"}
        ],
        "key_topics": ["Binary Search (Overflow)", "B-Trees & Clustered Indexes", "Top-N Analysis", "Recursion", "3NF Normalization", "C vs Java Platform Independence"],
        "total_questions": 8,
        "accent": "sky"
    },
    {
        "id": "wipro",
        "name": "Wipro",
        "full_name": "Wipro Technologies",
        "tagline": "Elite National Talent Hunt & Turbo",
        "category": "Service-Based / Enterprise",
        "rounds": [
            {"name": "Aptitude & Coding", "desc": "Quantitative, logical, and 2 basic/intermediate coding questions"},
            {"name": "Technical Round", "desc": "Procedural vs OOP, SQL aggregates, Garbage Collection, Anagrams"},
            {"name": "HR Round", "desc": "Career aspirations, bond agreement discussion & soft skills"}
        ],
        "key_topics": ["Procedural vs OOP", "Anagram O(N) Algorithm", "SQL GROUP BY vs HAVING", "Memory Garbage Collection", "OSI 7 Layers", "Turnaround vs Response Time"],
        "total_questions": 8,
        "accent": "emerald"
    },
    {
        "id": "accenture",
        "name": "Accenture",
        "full_name": "Accenture Solutions",
        "tagline": "Cognitive & Technical Assessment",
        "category": "Global Consulting",
        "rounds": [
            {"name": "Cognitive Assessment", "desc": "Critical thinking, abstract reasoning & tech pseudocode"},
            {"name": "Technical Round", "desc": "Monolith vs Microservices, REST APIs, caching & Singleton pattern"},
            {"name": "HR Round", "desc": "Client handling, communication & career trajectory"}
        ],
        "key_topics": ["Monolith vs Microservices", "REST APIs", "SQL WHERE vs HAVING", "Slow Web Page Debugging", "No Global Variables in Java", "ETL DataType Change"],
        "total_questions": 8,
        "accent": "purple"
    },
    {
        "id": "cognizant",
        "name": "Cognizant",
        "full_name": "Cognizant Technology Solutions",
        "tagline": "GenC, GenC Next & Elevate",
        "category": "Service-Based / Digital",
        "rounds": [
            {"name": "Skill-based Assessment", "desc": "Java/Python coding, SQL & debugging"},
            {"name": "Technical Round", "desc": "Multithreading, race conditions, NoSQL vs SQL, Tree traversals"},
            {"name": "HR Round", "desc": "Domain preference, shift willingness & communication"}
        ],
        "key_topics": ["Multithreading & Synchronization", "Deadlocks (Coffman)", "Semaphores vs Monitors", "Thrashing", "SQL vs NoSQL"],
        "total_questions": 6,
        "accent": "blue"
    },
    {
        "id": "amazon",
        "name": "Amazon",
        "full_name": "Amazon Web Services / SDE",
        "tagline": "Leadership Principles & SDE",
        "category": "Product-Based / FAANG",
        "rounds": [
            {"name": "Online Assessment (OA)", "desc": "2 LeetCode Medium/Hard algorithmic challenges + work style simulation"},
            {"name": "Technical Rounds (3-4 rounds)", "desc": "DSA, Low-Level Design (LLD), High-Level Design (HLD)"},
            {"name": "Bar Raiser", "desc": "16 Leadership Principles & deep dive into technical decisions"}
        ],
        "key_topics": ["Idempotent API Design", "Distributed Systems", "Longest Palindrome", "LLD Principles", "Python Decorators", "Python GC"],
        "total_questions": 5,
        "accent": "amber"
    }
]
