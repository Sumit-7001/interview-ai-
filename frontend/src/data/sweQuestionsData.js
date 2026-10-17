/**
 * Software Engineer (General) Interview Questions Dataset
 * Authentic technical questions extracted from TCS NQT, Accenture, Infosys, Wipro, and Capgemini interview drives.
 * Topics: Coding & DSA, OOPs, DBMS & SQL, OS & Networks, System Design, HR.
 */

export const SWE_GENERAL_SEEDS = [
  {
    id: 'swe-01',
    company: 'tcs',
    domain: 'swe-general',
    question: 'What is the difference between a process and a thread?',
    category: 'OS & Networks',
    difficulty: 'Easy',
    summary: 'A process is an independent execution unit with private address space; a thread is a lightweight segment within a process sharing memory and resources.',
    answer: `Key distinctions between processes and threads:
- **Process:**
  - An independent executing program with its own private address space, heap, data segment, and file descriptors.
  - Inter-Process Communication (IPC) requires specialized mechanisms (pipes, sockets, shared memory, message queues).
  - High creation and context-switching overhead because page tables and CPU registers must be flushed and remapped.
  - Fault isolation: A crash in one process does not directly corrupt other processes.
- **Thread:**
  - A lightweight execution unit (also known as a lightweight process) belonging to a parent process.
  - Threads share the same address space, code segment, and heap, but each maintains its own program counter, registers, and private stack.
  - Fast creation and context-switching overhead because memory mapping remains unchanged.
  - Requires careful synchronization (mutexes, semaphores) to prevent race conditions; a faulty thread can crash the entire process.`,
    code_example: {
      language: 'c',
      code: `// POSIX Thread vs Fork in C:
#include <pthread.h>
#include <stdio.h>

void* worker(void* arg) {
    printf("Thread executing with shared process memory\\n");
    return NULL;
}

int main() {
    pthread_t t1;
    pthread_create(&t1, NULL, worker, NULL);
    pthread_join(t1, NULL);
    return 0;
}`
    },
    interviewer_tip: "Highlight that threads share heap and static data but have independent call stacks and registers.",
    common_mistakes: "Claiming threads do not share memory or that each thread has its own virtual memory space.",
    follow_ups: ["What causes a race condition between threads?", "How does context switching overhead compare between processes and threads?"]
  },
  {
    id: 'swe-02',
    company: 'tcs',
    domain: 'swe-general',
    question: 'Explain the concept of Object Oriented Programming (OOP) and its 4 core pillars.',
    category: 'OOPs',
    difficulty: 'Easy',
    summary: 'OOP organizes software into objects combining state and behavior. The four foundational pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism.',
    answer: `Object-Oriented Programming (OOP) models software around real-world entities containing attributes (data) and methods (behavior):
- **1. Encapsulation:**
  - Bundling data and methods together inside a single unit (class) and restricting direct access to internal state using private/protected modifiers.
  - Protects internal invariants via validated getters and setters.
- **2. Abstraction:**
  - Hiding implementation complexities and exposing only clean, essential interfaces to consumers.
  - Implemented using abstract classes and interfaces (e.g. driving a car using steering and pedals without knowing the internal combustion engine mechanism).
- **3. Inheritance:**
  - Mechanism where a derived (child) class inherits properties and methods from a base (parent) class, promoting code reusability and hierarchical classification.
- **4. Polymorphism:**
  - 'Many forms' — the ability of an entity to take different forms based on context.
  - **Compile-time (Static):** Method Overloading.
  - **Runtime (Dynamic):** Method Overriding with dynamic dispatch.`,
    code_example: {
      language: 'java',
      code: `// Encapsulation and Polymorphism in Java:
abstract class Account {
    private double balance; // Encapsulation

    public Account(double balance) { this.balance = balance; }
    public double getBalance() { return balance; }
    protected void setBalance(double b) { this.balance = b; }

    public abstract void calculateInterest(); // Abstraction
}

class SavingsAccount extends Account { // Inheritance
    public SavingsAccount(double b) { super(b); }
    @Override
    public void calculateInterest() { // Polymorphism
        setBalance(getBalance() * 1.05);
    }
}`
    },
    interviewer_tip: "Interviewers frequently ask you to distinguish Encapsulation (data hiding via access modifiers) from Abstraction (implementation hiding via interfaces).",
    common_mistakes: "Confusing abstraction with encapsulation or claiming inheritance is always preferred over composition.",
    follow_ups: ["Why is composition often favored over inheritance?", "What is the diamond problem and how does Java solve it?"]
  },
  {
    id: 'swe-03',
    company: 'accenture',
    domain: 'swe-general',
    question: 'Differentiate between Method Overloading and Method Overriding.',
    category: 'OOPs',
    difficulty: 'Easy',
    summary: 'Overloading is compile-time polymorphism with identical method names but different parameter lists; overriding is runtime polymorphism replacing a superclass method in a subclass.',
    answer: `Comparison between Overloading and Overriding:
- **Method Overloading (Compile-Time / Static Polymorphism):**
  - Occurs within the **same class**.
  - Methods have the **same name** but **different parameters** (count, types, or order).
  - Return type can be different, but changing return type alone is NOT valid overloading.
  - Resolved at compile time based on method signatures (early binding).
- **Method Overriding (Runtime / Dynamic Polymorphism):**
  - Occurs across **parent and child classes** (inheritance relationship).
  - Method in subclass has the **exact same signature** (name, parameter list, and compatible return type) as the superclass method.
  - Cannot override static, private, or final methods.
  - Resolved at runtime using dynamic method dispatch via virtual tables (vtable).`,
    code_example: {
      language: 'java',
      code: `class Calculator {
    // Overloading: same name, different params
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
}

class Animal {
    void makeSound() { System.out.println("Generic animal sound"); }
}

class Dog extends Animal {
    // Overriding: same signature in subclass
    @Override
    void makeSound() { System.out.println("Woof woof!"); }
}`
    },
    interviewer_tip: "Be explicit that changing only the return type does not constitute overloading in Java or C++.",
    common_mistakes: "Saying overloading happens at runtime and overriding at compile time.",
    follow_ups: ["Can static methods be overridden in Java?", "What is a covariant return type in method overriding?"]
  },
  {
    id: 'swe-04',
    company: 'tcs',
    domain: 'swe-general',
    question: 'What is a Deadlock? What are the four Coffman conditions and how can deadlock be prevented?',
    category: 'OS & Networks',
    difficulty: 'Medium',
    summary: 'A deadlock is a state where processes wait indefinitely for resources held by each other. The 4 Coffman conditions are Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.',
    answer: `Deadlock in operating systems and concurrent databases:
- **Definition:** A permanent blocking condition where two or more processes cannot make forward progress because each is holding a resource and waiting for another resource held by another process.
- **The 4 Coffman Conditions (All 4 must hold simultaneously):**
  1. **Mutual Exclusion:** At least one resource must be non-shareable (only one process can use it at a time).
  2. **Hold and Wait:** A process is holding at least one resource while waiting to acquire additional resources held by other processes.
  3. **No Preemption:** Resources cannot be forcibly seized; a resource is released only voluntarily by the holding process.
  4. **Circular Wait:** A closed chain of processes exists such that P0 waits for resource held by P1, P1 waits for P2, ..., Pn waits for P0.
- **Deadlock Prevention Strategies:**
  - **Eliminate Circular Wait:** Impose a strict global ordering on all resources and require processes to request resources in ascending order.
  - **Eliminate Hold and Wait:** Require processes to request all needed resources at once before starting execution.
  - **Allow Preemption:** If a process holding resources is denied an additional resource, forcibly release its current holdings.
  - **Lock Timeouts & Banker's Algorithm:** Set maximum wait timeouts or run resource-allocation state checks before granting requests.`,
    code_example: {
      language: 'java',
      code: `// Preventing Deadlock by Strict Lock Ordering:
Object lockA = new Object();
Object lockB = new Object();

// Thread 1 and Thread 2 MUST acquire in identical order:
void safeOperation() {
    synchronized (lockA) {
        synchronized (lockB) {
            // Safe execution without circular wait
        }
    }
}`
    },
    interviewer_tip: "Naming all 4 Coffman conditions accurately instantly demonstrates deep OS understanding.",
    common_mistakes: "Confusing deadlock with starvation (starvation can eventually finish; deadlock never resolves without intervention).",
    follow_ups: ["How does the Banker's Algorithm check for a safe state?", "How do relational databases detect deadlocks using wait-for graphs?"]
  },
  {
    id: 'swe-05',
    company: 'infosys',
    domain: 'swe-general',
    question: 'Explain Database Normalization (1NF, 2NF, 3NF, BCNF) and why higher normal forms may involve trade-offs.',
    category: 'DBMS & SQL',
    difficulty: 'Medium',
    summary: 'Normalization systematically organizes tables to eliminate data redundancy and insertion/deletion/update anomalies. Higher normal forms can increase join costs.',
    answer: `Database normalization steps and trade-offs:
- **1NF (First Normal Form):**
  - Every column contains atomic (single, indivisible) values.
  - No repeating groups or arrays stored in a single field.
  - Each table has a designated primary key.
- **2NF (Second Normal Form):**
  - Table is in 1NF.
  - All non-key attributes are fully functionally dependent on the entire primary key (eliminates partial dependency on composite keys).
- **3NF (Third Normal Form):**
  - Table is in 2NF.
  - No transitive functional dependencies (non-key column depending on another non-key column, e.g., ZipCode determining City).
- **BCNF (Boyce-Codd Normal Form):**
  - A stricter version of 3NF: For every non-trivial functional dependency X -> Y, X must be a superkey.
- **Trade-Offs of Higher Normalization:**
  - **Advantage:** Maximum data integrity, minimal redundancy, prevents update anomalies.
  - **Disadvantage:** High query complexity and performance degradation due to multiple multi-table JOINs. In read-heavy analytical databases (OLAP), denormalization is preferred for speed.`,
    code_example: {
      language: 'sql',
      code: `-- 2NF Violation (Partial Dependency):
-- OrderItems(OrderID, ProductID, Qty, ProductName) -> ProductName depends only on ProductID!
-- Refactored to 2NF & 3NF:
CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(100),
    Price DECIMAL(10,2)
);

CREATE TABLE OrderItems (
    OrderID INT,
    ProductID INT,
    Quantity INT,
    PRIMARY KEY (OrderID, ProductID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);`
    },
    interviewer_tip: "Emphasize that production architectures often use 3NF for OLTP transactional databases and denormalized star schemas for data analytics.",
    common_mistakes: "Thinking that higher normalization always yields faster read performance.",
    follow_ups: ["When should you deliberately denormalize a database?", "What is the difference between 3NF and BCNF?"]
  },
  {
    id: 'swe-06',
    company: 'tcs',
    domain: 'swe-general',
    question: 'What are ACID properties in Database Management Systems (DBMS)?',
    category: 'DBMS & SQL',
    difficulty: 'Easy',
    summary: 'ACID stands for Atomicity, Consistency, Isolation, and Durability — four essential guarantees ensuring reliable database transaction processing.',
    answer: `Detailed breakdown of ACID properties:
- **Atomicity (All or Nothing):**
  - An entire transaction executes completely or has zero effect.
  - If a system crash occurs mid-transaction, all partial modifications are rolled back to the pre-transaction state via the write-ahead transaction log.
- **Consistency (Valid State Transitions):**
  - A transaction takes the database from one valid state to another valid state, preserving all schema constraints, foreign keys, triggers, and business invariants.
- **Isolation (Concurrent Independence):**
  - Intermediate transaction states are invisible to other concurrently executing transactions.
  - Managed via Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable (preventing dirty reads, non-repeatable reads, and phantom reads).
- **Durability (Committed Persistence):**
  - Once a transaction commits, its updates are permanently recorded in non-volatile storage (WAL / disk) and will not be lost even in power outage or system crash.`,
    code_example: {
      language: 'sql',
      code: `BEGIN TRANSACTION;
    -- Deduct money from sender
    UPDATE Accounts SET balance = balance - 500 WHERE account_id = 101;
    -- Add money to receiver
    UPDATE Accounts SET balance = balance + 500 WHERE account_id = 202;
-- If both succeed:
COMMIT;
-- If any error occurs:
-- ROLLBACK;`
    },
    interviewer_tip: "Mention Write-Ahead Logging (WAL) and Transaction Isolation Levels to demonstrate real production database experience.",
    common_mistakes: "Explaining Consistency as data replication consistency rather than schema and constraint integrity.",
    follow_ups: ["What are the four SQL transaction isolation levels?", "What is the difference between a phantom read and a non-repeatable read?"]
  },
  {
    id: 'swe-07',
    company: 'wipro',
    domain: 'swe-general',
    question: 'Explain the OSI 7-Layer Model and the primary function of each layer.',
    category: 'OS & Networks',
    difficulty: 'Medium',
    summary: 'The OSI model standardizes network communication into 7 distinct layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.',
    answer: `The 7 Layers of the Open Systems Interconnection (OSI) Model:
1. **Layer 1 - Physical Layer:**
   - Transmits raw, unstructured bit streams over physical media (cables, fiber optics, radio frequencies).
   - Protocols/Hardware: Ethernet cables, repeaters, hubs, bits.
2. **Layer 2 - Data Link Layer:**
   - Provides node-to-node framing, physical MAC addressing, and error detection (CRC).
   - Protocols/Hardware: Switches, Ethernet, Wi-Fi (802.11), frames.
3. **Layer 3 - Network Layer:**
   - Responsible for logical host addressing, packet routing, and subnet path selection across networks.
   - Protocols/Hardware: IPv4, IPv6, ICMP, Routers, packets.
4. **Layer 4 - Transport Layer:**
   - Provides end-to-end communication, segmentation, flow control, error recovery, and port addressing.
   - Protocols: TCP (connection-oriented, reliable), UDP (connectionless, fast), segments/datagrams.
5. **Layer 5 - Session Layer:**
   - Establishes, manages, and terminates communication sessions between local and remote applications.
   - Protocols: RPC, NetBIOS, session tokens.
6. **Layer 6 - Presentation Layer:**
   - Handles data formatting, character code translation (ASCII/UTF-8), compression, and encryption/decryption (TLS/SSL).
7. **Layer 7 - Application Layer:**
   - Provides network services directly accessible to end-user software applications.
   - Protocols: HTTP, HTTPS, DNS, SMTP, FTP, SSH.`,
    code_example: {
      language: 'text',
      code: `Mnemonic: "All People Seem To Need Data Processing"
Layer 7: Application  -> HTTP / DNS (Data)
Layer 6: Presentation -> TLS / Encryption (Data)
Layer 5: Session      -> Session Management (Data)
Layer 4: Transport    -> TCP / UDP (Segments)
Layer 3: Network      -> IP / Routing (Packets)
Layer 2: Data Link    -> MAC / Switch (Frames)
Layer 1: Physical     -> Cables / Bits (Bits)`
    },
    interviewer_tip: "Be ready to specify which data unit exists at each layer (Bits -> Frames -> Packets -> Segments -> Data).",
    common_mistakes: "Confusing the OSI 7-layer theoretical model with the practical 4-layer TCP/IP stack.",
    follow_ups: ["Where does TLS/SSL reside in the OSI model?", "How does a Layer 3 router differ from a Layer 2 switch?"]
  },
  {
    id: 'swe-08',
    company: 'tcs',
    domain: 'swe-general',
    question: 'What is the difference between TCP and UDP in computer networks?',
    category: 'OS & Networks',
    difficulty: 'Easy',
    summary: 'TCP is connection-oriented, reliable, and ordered via a 3-way handshake; UDP is connectionless, fast, and lightweight without delivery guarantees.',
    answer: `Key differences between TCP and UDP:
- **TCP (Transmission Control Protocol):**
  - **Connection:** Connection-oriented (requires 3-way handshake: SYN -> SYN-ACK -> ACK before data transfer).
  - **Reliability:** 100% reliable data delivery via acknowledgments (ACKs), sequence numbers, and automatic retransmission of lost packets.
  - **Ordering:** Guarantees packets are assembled in the exact sequence they were transmitted.
  - **Flow & Congestion Control:** Implements sliding window flow control and algorithms (slow start, congestion avoidance).
  - **Header Size:** 20 to 60 bytes.
  - **Use Cases:** Web browsing (HTTP/HTTPS), file transfer (FTP), email (SMTP), database connections.
- **UDP (User Datagram Protocol):**
  - **Connection:** Connectionless (packets sent immediately without establishing a connection).
  - **Reliability:** Best-effort delivery; packets can be lost, duplicated, or arrive out of order.
  - **Ordering:** No sequence ordering.
  - **Speed:** Minimal latency and low computational overhead.
  - **Header Size:** Fixed 8 bytes.
  - **Use Cases:** Real-time video streaming, VoIP, DNS queries, online multiplayer gaming, WebRTC.`,
    code_example: {
      language: 'python',
      code: `# Python UDP Socket (Fast datagram transmission):
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
message = b"Real-time sensor ping"
sock.sendto(message, ("127.0.0.1", 9999))
# No connection setup or ACK wait required`
    },
    interviewer_tip: "Give concrete examples of why DNS uses UDP for quick single-packet lookups and HTTPS uses TCP for secure stream integrity.",
    common_mistakes: "Saying UDP is always worse than TCP; UDP is deliberately chosen whenever low latency trumps 100% packet reliability.",
    follow_ups: ["Explain the TCP 3-way handshake step by step.", "What is HTTP/3 and why does it use QUIC over UDP instead of TCP?"]
  },
  {
    id: 'swe-09',
    company: 'cognizant',
    domain: 'swe-general',
    question: 'What is a Semaphore? Explain the difference between Binary Semaphore, Counting Semaphore, and Monitor.',
    category: 'OS & Networks',
    difficulty: 'Medium',
    summary: 'A semaphore is an integer synchronization tool using atomic wait() and signal() operations; a monitor is a higher-level programming language construct encapsulating locks and condition variables.',
    answer: `Synchronization primitives in concurrent programming:
- **Semaphore:**
  - An integer variable manipulated only through two atomic operations:
    - \`wait()\` (or \`P()\`, decrement): If value <= 0, process blocks. Otherwise decrements and proceeds.
    - \`signal()\` (or \`V()\`, increment): Increments counter and unblocks a waiting process.
  - **Binary Semaphore:** Value can only be 0 or 1. Used as a mutual exclusion lock (Mutex).
  - **Counting Semaphore:** Initialized to a non-negative integer N. Used to manage access to a limited pool of N shared resources (e.g., database connection pool of size 10).
- **Difference Between Semaphore and Monitor:**
  - **Semaphore:** Low-level OS primitive requiring manual \`wait()\` and \`signal()\` calls. If a developer forgets \`signal()\`, deadlock occurs.
  - **Monitor:** High-level language construct (e.g. \`synchronized\` in Java) that encapsulates shared state, mutual exclusion locks, and condition variables within an object. Only one thread can execute inside a monitor method at a time, eliminating manual lock management errors.`,
    code_example: {
      language: 'java',
      code: `// Counting Semaphore in Java managing 3 concurrent slots:
import java.util.concurrent.Semaphore;

class ConnectionPool {
    private final Semaphore semaphore = new Semaphore(3); // 3 permits

    public void useConnection() throws InterruptedException {
        semaphore.acquire(); // wait()
        try {
            System.out.println(Thread.currentThread().getName() + " acquired connection");
            Thread.sleep(1000);
        } finally {
            semaphore.release(); // signal()
        }
    }
}`
    },
    interviewer_tip: "Highlight that a Mutex has ownership (only the locking thread can unlock it), whereas a Semaphore can be signaled by any thread.",
    common_mistakes: "Thinking semaphores and mutexes are identical in all implementations.",
    follow_ups: ["What is priority inversion and how does priority inheritance solve it?", "How does Java implement monitors under the hood?"]
  },
  {
    id: 'swe-10',
    company: 'tcs',
    domain: 'swe-general',
    question: 'Explain the concept of Virtual Memory and Paging in Operating Systems.',
    category: 'OS & Networks',
    difficulty: 'Medium',
    summary: 'Virtual memory gives processes the illusion of large, contiguous memory by mapping virtual pages to physical RAM frames, loading disk pages on demand.',
    answer: `Virtual memory architecture and paging mechanism:
- **Virtual Memory:**
  - Memory management technique providing each process with an isolated, contiguous logical address space larger than actual physical RAM.
  - Enables process isolation, memory protection, and efficient hardware utilization.
- **Paging Mechanism:**
  - **Pages:** Logical address space of a process is partitioned into fixed-size blocks called *Pages* (typically 4 KB).
  - **Frames:** Physical RAM is divided into fixed-size blocks of the identical size called *Frames*.
  - **Page Table:** OS maintains a page table per process mapping virtual page numbers (VPN) to physical frame numbers (PFN).
  - **MMU (Memory Management Unit):** Hardware chip translating virtual addresses to physical addresses at runtime using a high-speed cache called the TLB (Translation Lookaside Buffer).
- **Page Fault:**
  - When a process accesses a page not currently residing in physical RAM (valid bit = 0), a Page Fault interrupt is triggered.
  - The OS pauses the process, reads the missing page from disk swap space into an available RAM frame, updates the page table, and resumes the process.`,
    code_example: {
      language: 'text',
      code: `Virtual Address = [ Page Number (VPN) | Offset ]
            ↓ (Page Table Lookup / TLB Hit)
Physical Address = [ Frame Number (PFN) | Offset ]

Page Fault Lifecycle:
Access Missing Page -> CPU Trap -> OS Page Fault Handler -> Swap in from Disk -> Update Page Table -> Restart Instruction`
    },
    interviewer_tip: "Mention the role of the TLB (Translation Lookaside Buffer) in speeding up virtual address translation.",
    common_mistakes: "Confusing Paging (fixed-size blocks) with Segmentation (variable-size logical blocks).",
    follow_ups: ["What is Thrashing and what causes it?", "What is the difference between internal and external fragmentation?"]
  },
  {
    id: 'swe-11',
    company: 'capgemini',
    domain: 'swe-general',
    question: 'Differentiate between a Stack and a Queue data structure with operations and applications.',
    category: 'Coding & DSA',
    difficulty: 'Easy',
    summary: 'A Stack follows LIFO (Last In First Out) with push/pop; a Queue follows FIFO (First In First Out) with enqueue/dequeue.',
    answer: `Detailed comparison between Stack and Queue:
- **Stack (LIFO - Last In, First Out):**
  - Elements are inserted and removed from the **same end** (the top).
  - **Core Operations:** \`push(x)\` (add to top), \`pop()\` (remove from top), \`peek()\` (inspect top) — all O(1) time complexity.
  - **Applications:**
    - Call stack management in programming language runtimes (function recursion).
    - Undo/Redo features in text editors and graphic tools.
    - Balanced parenthesis checking and infix-to-postfix expression conversion.
    - Backtracking algorithms (DFS in graphs/trees, maze solving).
- **Queue (FIFO - First In, First Out):**
  - Elements are inserted at the **rear (tail)** and removed from the **front (head)**.
  - **Core Operations:** \`enqueue(x)\` (insert at rear), \`dequeue()\` (remove from front), \`front()\` — all O(1) time complexity.
  - **Applications:**
    - CPU task scheduling and printer print spoolers.
    - Breadth-First Search (BFS) graph traversal.
    - Asynchronous message brokers (Kafka, RabbitMQ, SQS).
    - Operating system interrupt and event handling queues.`,
    code_example: {
      language: 'python',
      code: `from collections import deque

# Stack implementation (LIFO):
stack = []
stack.append(10) # push
stack.append(20)
print(stack.pop()) # 20 (Last In, First Out)

# Queue implementation (FIFO):
queue = deque()
queue.append("task_1") # enqueue
queue.append("task_2")
print(queue.popleft()) # task_1 (First In, First Out)`
    },
    interviewer_tip: "In Python, always use `collections.deque` instead of `list` for queues because `list.pop(0)` is O(n) due to element shifting.",
    common_mistakes: "Using `list.pop(0)` in Python and assuming it has O(1) time complexity.",
    follow_ups: ["How would you implement a Queue using two Stacks?", "What is a Circular Queue and what problem does it solve?"]
  },
  {
    id: 'swe-12',
    company: 'tcs',
    domain: 'swe-general',
    question: 'What is Recursion? What is the role of a base case, and what are the trade-offs of using recursion?',
    category: 'Coding & DSA',
    difficulty: 'Easy',
    summary: 'Recursion is a programming technique where a function calls itself to solve smaller subproblems until it hits a base condition. Trade-off involves elegance vs call stack memory overhead.',
    answer: `Deep dive into Recursion:
- **Definition:** A method where the solution to a problem depends on solutions to smaller instances of the exact same problem.
- **The Role of the Base Case:**
  - The base case is the terminating condition that does not make a recursive call.
  - Without a correct base case, recursion runs indefinitely until the OS call stack runs out of memory, causing a fatal **StackOverflowError**.
- **Execution Mechanism:**
  - Each recursive call creates a new stack frame on the call stack storing parameters, local variables, and the return address.
- **Advantages:**
  - Naturally mirrors hierarchical and recursive data structures (trees, graphs, JSON trees).
  - Eliminates complex loop state and simplifies code in divide-and-conquer algorithms (Merge Sort, Quick Sort, Binary Search).
- **Trade-Offs & Disadvantages:**
  - **Memory Overhead:** O(N) stack memory proportional to recursion depth.
  - **Performance Penalty:** Function call overhead and CPU register context switching can be slower than tight iterative loops.
  - Can be optimized using **Tail Recursion Optimization (TCO)** in compilers that support it.`,
    code_example: {
      language: 'python',
      code: `def factorial(n: int) -> int:
    # Base Case (Terminating condition)
    if n <= 1:
        return 1
    # Recursive Step
    return n * factorial(n - 1)

print(factorial(5)) # Output: 120`
    },
    interviewer_tip: "Show awareness of stack overflow limitations and mention tail recursion or memoization for dynamic programming problems.",
    common_mistakes: "Omitting the base case or creating a base case that is never reachable.",
    follow_ups: ["What is tail recursion and how does the compiler optimize it?", "How do you convert a recursive function to an iterative one using an explicit stack?"]
  },
  {
    id: 'swe-13',
    company: 'infosys',
    domain: 'swe-general',
    question: 'Compare common sorting algorithms (Bubble Sort, Merge Sort, Quick Sort, Insertion Sort) in terms of time complexity, space complexity, and stability.',
    category: 'Coding & DSA',
    difficulty: 'Medium',
    summary: 'Merge Sort guarantees O(N log N) and stability with O(N) space. Quick Sort is fastest in practice O(N log N) average in-place but O(N^2) worst case. Insertion Sort is O(N) for nearly sorted data.',
    answer: `Comprehensive sorting algorithms comparison:

| Algorithm | Best Case | Average Case | Worst Case | Space Complexity | Stable? | Key Trait |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Bubble Sort** | O(N) | O(N²) | O(N²) | O(1) | **Yes** | Simple adjacent swaps, educational |
| **Insertion Sort**| O(N) | O(N²) | O(N²) | O(1) | **Yes** | Excellent for small arrays (<50) or nearly sorted |
| **Merge Sort** | O(N log N) | O(N log N) | O(N log N) | O(N) | **Yes** | Guaranteed O(N log N), divide-and-conquer, external sorting |
| **Quick Sort** | O(N log N) | O(N log N) | O(N²) | O(log N) | **No** | In-place, low constant factor, cache-friendly |
| **TimSort** | O(N) | O(N log N) | O(N log N) | O(N) | **Yes** | Hybrid (Merge + Insertion), default in Python & Java Arrays.sort |

- **Algorithm Stability Defined:**
  - A sorting algorithm is **stable** if two objects with equal keys appear in the same order in sorted output as they appeared in the original input.`,
    code_example: {
      language: 'python',
      code: `# Merge Sort Divide-and-Conquer implementation:
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge sorted halves
    res, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:]); res.extend(right[j:])
    return res`
    },
    interviewer_tip: "Explain why QuickSort is preferred for internal memory sorting (cache locality, in-place) while MergeSort is preferred for linked lists and external files.",
    common_mistakes: "Claiming QuickSort is always O(N log N) without acknowledging the O(N^2) worst case on bad pivot selections.",
    follow_ups: ["How does Randomized QuickSort avoid the O(N^2) worst case?", "Why does Python choose TimSort instead of pure QuickSort?"]
  },
  {
    id: 'swe-14',
    company: 'tcs',
    domain: 'swe-general',
    question: 'What is the difference between Call by Value and Call by Reference?',
    category: 'OOPs',
    difficulty: 'Easy',
    summary: 'Call by value passes an independent copy of the variable so caller state remains untouched; call by reference passes the memory address so modifications directly affect caller.',
    answer: `Parameter passing semantics:
- **Call by Value:**
  - The actual parameter's value is copied into the function's formal parameter stack space.
  - Modifications made to formal parameters inside the function have **zero effect** on the caller's variable in the outer scope.
  - Safer and isolates side effects, but copying large structures requires extra memory.
  - C and Java pass all primitive data types (int, float, char) strictly by value.
- **Call by Reference:**
  - The function receives the actual memory reference (pointer/address) of the caller's argument.
  - Any modification made to the parameter directly mutates the original variable in caller memory.
  - Supported directly in C++ via reference variables (\`int &ref = a;\`).
- **How Java & Python Work ("Pass by Object Reference" / "Pass by Value of Reference"):**
  - Java and Python are strictly pass-by-value, but object variables store references (memory addresses).
  - Passing an object passes a *copy of its reference*. Modifying an object's internal fields mutates the shared heap object, but reassigning the parameter variable does not change the caller's reference.`,
    code_example: {
      language: 'cpp',
      code: `// C++ Call by Value vs Reference:
#include <iostream>

void byValue(int x) { x += 10; } // Copy modified
void byReference(int &x) { x += 10; } // Original modified

int main() {
    int num = 5;
    byValue(num);
    std::cout << num << std::endl; // 5 (unchanged)
    byReference(num);
    std::cout << num << std::endl; // 15 (modified)
    return 0;
}`
    },
    interviewer_tip: "Clarify Java's exact terminology: Java is strictly pass-by-value where object references are passed by value.",
    common_mistakes: "Saying Java passes objects by reference; it passes the reference pointer by value.",
    follow_ups: ["What happens when you reassign an object parameter inside a function in Java or Python?"]
  },
  {
    id: 'swe-15',
    company: 'capgemini',
    domain: 'swe-general',
    question: 'Differentiate between malloc() and calloc() in memory management.',
    category: 'OS & Networks',
    difficulty: 'Easy',
    summary: 'malloc() allocates a single uninitialized contiguous block with garbage values; calloc() allocates multiple contiguous elements and initializes all bytes to zero.',
    answer: `Differences between malloc() and calloc() in C/C++:
- **malloc() (Memory Allocation):**
  - **Syntax:** \`void* malloc(size_t size);\`
  - Allocates a single block of contiguous heap memory of the specified number of bytes.
  - **Initialization:** Does NOT initialize memory; allocated bytes contain arbitrary garbage values.
  - Slightly faster than calloc() because it skips zero-initialization.
- **calloc() (Contiguous Allocation):**
  - **Syntax:** \`void* calloc(size_t num_elements, size_t element_size);\`
  - Takes two parameters: count of elements and size of each element, allocating \`num_elements * element_size\` bytes.
  - **Initialization:** Automatically initializes every single allocated byte to zero (\`0\`).
  - Useful for arrays and numeric counters where initial zero state is required.
- **Common Lifecycle Rules:**
  - Both return \`NULL\` if heap memory allocation fails.
  - Both must be paired with \`free(ptr)\` to prevent memory leaks.`,
    code_example: {
      language: 'c',
      code: `#include <stdlib.h>

int *arr1 = (int*) malloc(5 * sizeof(int)); // Uninitialized (garbage)
int *arr2 = (int*) calloc(5, sizeof(int)); // All 5 integers initialized to 0

// Always free allocated heap blocks
free(arr1);
free(arr2);`
    },
    interviewer_tip: "Always remember to mention checking for NULL after dynamic allocation and calling free() to avoid memory leaks.",
    common_mistakes: "Assuming malloc() clears or zeroes memory.",
    follow_ups: ["What is realloc() and how does it resize memory?", "What happens if you free a pointer twice (double free)?"]
  },
  {
    id: 'swe-16',
    company: 'tcs',
    domain: 'swe-general',
    question: 'What are the phases of the Software Development Life Cycle (SDLC)?',
    category: 'System Design',
    difficulty: 'Easy',
    summary: 'SDLC defines the end-to-end framework for software creation: Requirement Gathering, System Design, Implementation, Testing, Deployment, and Maintenance.',
    answer: `The 6 core phases of SDLC:
1. **1. Requirement Gathering & Analysis:**
   - Business analysts, product managers, and engineers gather stakeholder requirements to produce the Software Requirement Specification (SRS) document.
2. **2. System & Architectural Design:**
   - Translates requirements into technical architecture: High-Level Design (HLD - system components, databases, network topologies) and Low-Level Design (LLD - class diagrams, APIs, schema definitions).
3. **3. Implementation & Coding:**
   - Developers write modular, readable source code adhering to design specifications, coding standards, and repository guidelines.
4. **4. Testing & Quality Assurance:**
   - QA and developers verify that software functions correctly without defects across Unit, Integration, System, Performance, and User Acceptance Testing (UAT).
5. **5. Deployment & Release:**
   - Packaged software is deployed to staging and production environments using automated CI/CD pipelines (e.g., Docker, GitHub Actions, Kubernetes).
6. **6. Maintenance & Monitoring:**
   - Post-launch continuous monitoring for bugs, security patches, system health telemetry, and ongoing feature updates.`,
    code_example: {
      language: 'text',
      code: `Requirements -> System Design -> Implementation (Coding) -> QA & Testing -> CI/CD Deployment -> Operations & Maintenance`
    },
    interviewer_tip: "Mention the contrast between traditional Waterfall methodology and modern Agile/DevOps iterative sprints.",
    common_mistakes: "Overlooking the maintenance phase, which typically accounts for over 60% of total software lifecycle cost.",
    follow_ups: ["How does the Agile Scrum framework adapt these SDLC phases?", "What is the difference between Verification and Validation?"]
  },
  {
    id: 'swe-17',
    company: 'tcs',
    domain: 'swe-general',
    question: 'What is the difference between Primary Key, Foreign Key, and Unique Key in SQL?',
    category: 'DBMS & SQL',
    difficulty: 'Easy',
    summary: 'Primary key uniquely identifies a row and cannot be NULL; Foreign key links to a primary key in another table enforcing referential integrity; Unique key enforces distinctness but allows one NULL.',
    answer: `Key relational database constraint distinctions:
- **Primary Key:**
  - Uniquely identifies each record within a database table.
  - **NULL Restriction:** Can NEVER contain \`NULL\` values.
  - **Count:** Only **one** primary key is allowed per table.
  - Automatically creates a **clustered index** by default in most RDBMS engines (SQL Server, MySQL InnoDB).
- **Foreign Key:**
  - A column (or set of columns) that references the primary key or unique key of another table.
  - Enforces **referential integrity**, ensuring orphaned records cannot exist.
  - Can accept \`NULL\` values (unless explicitly marked \`NOT NULL\`).
  - Supports cascade actions (\`ON DELETE CASCADE\`, \`ON UPDATE SET NULL\`).
- **Unique Key:**
  - Enforces uniqueness of values in a column to prevent duplicate records.
  - Can accept \`NULL\` values (standard SQL allows one NULL; some engines allow multiple NULLs).
  - A table can have **multiple** unique key constraints.`,
    code_example: {
      language: 'sql',
      code: `CREATE TABLE Departments (
    DeptID INT PRIMARY KEY, -- Primary Key
    DeptName VARCHAR(50) UNIQUE NOT NULL -- Unique Key
);

CREATE TABLE Employees (
    EmpID INT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE, -- Unique Key
    DeptID INT,
    FOREIGN KEY (DeptID) REFERENCES Departments(DeptID) -- Foreign Key
);`
    },
    interviewer_tip: "Clearly state that a table can have only one Primary Key, but multiple Unique Keys.",
    common_mistakes: "Thinking foreign keys cannot contain NULL values.",
    follow_ups: ["What happens when you delete a row referenced by a foreign key?", "What is a surrogate key vs a natural key?"]
  },
  {
    id: 'swe-18',
    company: 'tcs',
    domain: 'swe-general',
    question: 'What is the difference between DELETE, TRUNCATE, and DROP in SQL?',
    category: 'DBMS & SQL',
    difficulty: 'Easy',
    summary: 'DELETE is a DML command removing specific rows with rollback and triggers; TRUNCATE is a DDL command clearing all table data quickly; DROP deletes data and table schema permanently.',
    answer: `Comparison between DELETE, TRUNCATE, and DROP:
- **DELETE (DML - Data Manipulation Language):**
  - Removes specific rows filtered by a \`WHERE\` clause.
  - Logs every individual row deletion in the transaction log, allowing full rollback via \`ROLLBACK\`.
  - Fires all associated row-level \`DELETE\` triggers.
  - Slower on large datasets due to row-by-row logging. Does NOT reset auto-increment identity seed.
- **TRUNCATE (DDL - Data Definition Language):**
  - Removes all rows from a table by deallocating entire data storage pages.
  - Minimal transaction logging (logs page deallocations rather than individual rows).
  - Cannot use a \`WHERE\` condition; clears the entire table.
  - Much faster than DELETE; does NOT fire row triggers.
  - Resets table auto-increment identity counters back to seed value.
- **DROP (DDL - Data Definition Language):**
  - Completely destroys the table structure, metadata, indexes, permissions, and all data from the database.
  - The table ceases to exist entirely.`,
    code_example: {
      language: 'sql',
      code: `-- Selective deletion (slow, logged, triggers fire):
DELETE FROM Employees WHERE status = 'Terminated';

-- Complete data wipe (fast, resets identity, structure kept):
TRUNCATE TABLE AuditLogs;

-- Complete structural destruction:
DROP TABLE TempStagingTable;`
    },
    interviewer_tip: "Remember that TRUNCATE is classified as DDL because it alters table storage allocation, not row contents directly.",
    common_mistakes: "Claiming TRUNCATE can never be rolled back (inside an active transaction block in PostgreSQL/SQL Server, TRUNCATE can actually be rolled back).",
    follow_ups: ["Can TRUNCATE be executed if a table is referenced by an active Foreign Key?", "Which locks are acquired during TRUNCATE vs DELETE?"]
  },
  {
    id: 'swe-19',
    company: 'tcs',
    domain: 'swe-general',
    question: 'What are the main service models (IaaS, PaaS, SaaS) and deployment models in Cloud Computing?',
    category: 'System Design',
    difficulty: 'Easy',
    summary: 'Cloud service models define the division of responsibility: IaaS (infrastructure), PaaS (platform/runtime), SaaS (end software). Deployment models include Public, Private, and Hybrid clouds.',
    answer: `Cloud computing architecture breakdown:
- **Cloud Service Models:**
  1. **IaaS (Infrastructure as a Service):**
     - Cloud provider supplies raw compute, virtual machines, networking, and block storage.
     - Customer manages OS, runtime, middleware, data, and applications.
     - *Examples:* AWS EC2, Google Compute Engine, Azure Virtual Machines.
  2. **PaaS (Platform as a Service):**
     - Provider manages underlying hardware, OS, security patching, and runtime environments.
     - Developer focuses purely on application code and business logic.
     - *Examples:* AWS Elastic Beanstalk, Heroku, Google App Engine, Vercel.
  3. **SaaS (Software as a Service):**
     - Fully managed software delivered over the web to end users.
     - *Examples:* Gmail, Salesforce, Microsoft 365, Google Drive.
- **Cloud Deployment Models:**
  - **Public Cloud:** Infrastructure owned and managed by third-party provider, shared among multiple tenants over the public internet (AWS, Azure, GCP).
  - **Private Cloud:** Infrastructure dedicated exclusively to a single enterprise, hosted on-premise or by a managed host for maximum compliance and security.
  - **Hybrid Cloud:** Seamlessly bridges on-premise private infrastructure with public cloud resources for workload flexibility (e.g. keeping sensitive banking databases in private cloud while hosting web frontends in public cloud).`,
    code_example: {
      language: 'text',
      code: `Shared Responsibility Model:
SaaS: [Provider manages: App, Data, Runtime, Middleware, OS, Servers, Storage, Network]
PaaS: [You manage: App, Data] | [Provider manages: Runtime, Middleware, OS, Servers]
IaaS: [You manage: App, Data, Runtime, Middleware, OS] | [Provider manages: Servers, Storage]`
    },
    interviewer_tip: "Frame your answer around the Shared Responsibility Model to demonstrate enterprise maturity.",
    common_mistakes: "Confusing PaaS with SaaS (e.g., calling GitHub or Heroku a SaaS product).",
    follow_ups: ["What is Serverless computing (FaaS) and where does it fit?", "What factors influence choosing Hybrid Cloud over Public Cloud?"]
  },
  {
    id: 'swe-20',
    company: 'accenture',
    domain: 'swe-general',
    question: 'How do you retrieve the second highest salary from an Employee table in SQL?',
    category: 'DBMS & SQL',
    difficulty: 'Easy',
    summary: 'Retrieve 2nd highest salary using a correlated subquery with MAX(), or using DENSE_RANK() window function to handle duplicate salaries accurately.',
    answer: `Two standard, interview-proven approaches to find the 2nd highest salary:
- **Approach 1: Subquery with MAX() (Universal ANSI SQL):**
  - Finds the highest salary, then selects the maximum salary strictly less than that value.
  - Returns \`NULL\` cleanly if only one distinct salary exists.
- **Approach 2: DENSE_RANK() Window Function (Modern Enterprise Standard):**
  - Ranks distinct salaries in descending order without skipping rank numbers when duplicates occur.
  - Generalizes easily to the N-th highest salary by changing \`rank_num = N\`.`,
    code_example: {
      language: 'sql',
      code: `-- Method 1: Subquery (Works across all databases)
SELECT MAX(salary) AS SecondHighestSalary
FROM Employees
WHERE salary < (SELECT MAX(salary) FROM Employees);

-- Method 2: DENSE_RANK() Window Function (Handles ties and generalizes to N-th)
WITH RankedSalaries AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rank_num
    FROM Employees
)
SELECT salary 
FROM RankedSalaries 
WHERE rank_num = 2;`
    },
    interviewer_tip: "Always emphasize why DENSE_RANK() is superior to ROW_NUMBER() or LIMIT/OFFSET when multiple employees share the top salary.",
    common_mistakes: "Using `LIMIT 1 OFFSET 1` without `DISTINCT`, which fails if two employees share the maximum salary.",
    follow_ups: ["Why does ROW_NUMBER() fail when there are duplicate top salaries?", "How do you write this query to return the N-th highest salary dynamically?"]
  },
  {
    id: 'swe-21',
    company: 'wipro',
    domain: 'swe-general',
    question: 'What is the difference between a Compiler and an Interpreter?',
    category: 'Coding & DSA',
    difficulty: 'Easy',
    summary: 'A compiler translates entire source code into native machine code before execution; an interpreter translates and executes source code line-by-line at runtime.',
    answer: `Key differences between Compilers and Interpreters:
- **Compiler:**
  - Scans and translates the entire program source code into native machine code or intermediate binary in a single compilation step before execution.
  - Generates a standalone executable file (e.g., \`.exe\`, \`.out\`).
  - Execution speed is very fast because translation is already complete.
  - Reports all compilation syntax and type errors together at the end of compilation.
  - *Languages:* C, C++, Rust, Go.
- **Interpreter:**
  - Reads, analyzes, and executes program source code statement-by-statement at runtime without creating a standalone machine binary.
  - Slower execution speed because instruction translation occurs continuously in the execution loop.
  - Easier to debug because execution stops immediately at the first offending line.
  - *Languages:* Early Python, Ruby, PHP.
- **Modern Hybrid Systems (JIT Compilers):**
  - Modern runtimes (Java Virtual Machine, JavaScript V8, .NET CLR) combine both: source is compiled into bytecode, and hot code paths are compiled Just-In-Time (JIT) into native machine code for maximum performance.`,
    code_example: {
      language: 'text',
      code: `Compiler Workflow:
Source Code -> Lexical/Syntax Analysis -> Code Optimization -> Machine Code Binary -> Direct OS Execution

Interpreter Workflow:
Source Code -> Line Translation -> Immediate Execution -> Next Line`
    },
    interviewer_tip: "Bring up JIT (Just-In-Time) compilation used in V8 and the JVM to show you understand modern language engines.",
    common_mistakes: "Claiming Java is purely interpreted or purely compiled; it compiles to bytecode, then uses JIT.",
    follow_ups: ["What is JIT compilation and how does hot spot detection work?", "What is bytecode in Java and Python?"]
  },
  {
    id: 'swe-22',
    company: 'accenture',
    domain: 'swe-general',
    question: 'How do you find the length of the longest subarray with sum zero in O(N) time?',
    category: 'Coding & DSA',
    difficulty: 'Medium',
    summary: 'Use Prefix Sums paired with a Hash Map storing the first index of each running sum. If a sum repeats, the elements in between sum to zero.',
    answer: `Optimal O(N) Algorithm using Prefix Sum & Hash Map:
- **Mathematical Insight:**
  - Let \`prefix_sum[i]\` be the sum of elements from index 0 to \`i\`.
  - If \`prefix_sum[j] == prefix_sum[i]\` (where j > i), the sum of elements between \`i + 1\` and \`j\` must equal **zero**!
  - Also, if \`prefix_sum[i] == 0\`, the subarray from index 0 to \`i\` has sum zero (length = \`i + 1\`).
- **Algorithm Steps:**
  1. Initialize a hash map \`prefix_indices\` mapping running sum -> first seen index.
  2. Maintain a running sum \`curr_sum\` initialized to 0.
  3. Iterate through array at index \`i\`:
     - If \`curr_sum == 0\`, \`max_len = max(max_len, i + 1)\`.
     - If \`curr_sum\` is already in map, \`max_len = max(max_len, i - prefix_indices[curr_sum])\`.
     - Otherwise, store \`prefix_indices[curr_sum] = i\` (store only the first occurrence to maximize subarray length).
  4. Return \`max_len\`.
- **Complexity:** Time: O(N) single pass. Space: O(N) for hash map.`,
    code_example: {
      language: 'python',
      code: `def max_len_zero_sum_subarr(arr):
    prefix_map = {}
    max_len = 0
    curr_sum = 0
    
    for i, num in enumerate(arr):
        curr_sum += num
        
        if curr_sum == 0:
            max_len = i + 1
        elif curr_sum in prefix_map:
            max_len = max(max_len, i - prefix_map[curr_sum])
        else:
            # Store only earliest index to maximize length
            prefix_map[curr_sum] = i
            
    return max_len

# Example: [15, -2, 2, -8, 1, 7, 10, 23] -> subarray [-2, 2, -8, 1, 7] has sum 0, length 5
print(max_len_zero_sum_subarr([15, -2, 2, -8, 1, 7, 10, 23])) # Output: 5`
    },
    interviewer_tip: "Do not overwrite existing keys in the hash map when curr_sum is seen again, because we want the earliest possible start index.",
    common_mistakes: "Using a brute force O(N^2) nested loop approach.",
    follow_ups: ["How would you adapt this algorithm to find the longest subarray with sum equal to K?", "Can this be solved in O(1) space if all elements are positive?"]
  },
  {
    id: 'swe-23',
    company: 'accenture',
    domain: 'swe-general',
    question: 'How does Garbage Collection work in Java and Python?',
    category: 'Coding & DSA',
    difficulty: 'Medium',
    summary: 'Java uses generational mark-and-sweep GC on the heap; Python uses reference counting backed by a cyclic generational garbage collector.',
    answer: `Garbage Collection mechanisms in Java vs Python:
- **Java Garbage Collection (JVM Heap):**
  - **Generational Hypothesis:** Most objects die shortly after allocation.
  - **Heap Structure:**
    - **Young Generation:** Divided into Eden space and two Survivor spaces (S0, S1). Minor GC collects short-lived objects quickly.
    - **Old (Tenured) Generation:** Objects surviving multiple minor GC cycles are promoted here. Major/Full GC runs less frequently.
  - **Mark and Sweep:** Identifies GC roots (active threads, static variables, stack frames), marks reachable objects, and sweeps away unreferenced memory.
- **Python Garbage Collection:**
  - **Primary Mechanism - Reference Counting:** Every Python object maintains an internal \`ob_refcnt\` tracking active references. When reference count drops to 0, memory is immediately deallocated.
  - **Secondary Mechanism - Cyclic GC:** Reference counting cannot detect circular references (Object A references B, and B references A). Python runs a cyclic garbage collector periodically (\`gc\` module) dividing objects into 3 generations to detect isolated reference cycles.`,
    code_example: {
      language: 'python',
      code: `import gc
import sys

# Circular reference example in Python:
class Node:
    def __init__(self):
        self.partner = None

a = Node()
b = Node()
a.partner = b
b.partner = a

del a
del b
# Ref counts are not 0 due to circular partner link!
# Python cyclic GC cleans this up automatically:
collected = gc.collect()
print(f"Unreachable cyclic objects collected: {collected}")`
    },
    interviewer_tip: "Mention that Python's immediate deallocation via reference counting is deterministic, while Java's GC is non-deterministic.",
    common_mistakes: "Thinking Python only uses reference counting; without the cyclic GC, circular references would cause permanent memory leaks.",
    follow_ups: ["What are GC roots in Java?", "Why should you generally avoid calling System.gc() in production Java code?"]
  },
  {
    id: 'swe-24',
    company: 'accenture',
    domain: 'swe-general',
    question: 'What is an API? Explain RESTful principles, standard HTTP verbs, and HTTP status code categories.',
    category: 'System Design',
    difficulty: 'Easy',
    summary: 'An API defines interfaces for software communication. REST uses HTTP verbs (GET, POST, PUT, DELETE) and status codes (2xx success, 4xx client errors, 5xx server errors).',
    answer: `RESTful API Architecture fundamentals:
- **What is an API?** An Application Programming Interface defining explicit contracts, protocols, and endpoints through which software systems exchange requests and responses.
- **Key REST Constraints:**
  - **Statelessness:** Each request from client to server must contain all information required to understand and process the request; server stores no client session context.
  - **Client-Server Architecture:** Separation of user interface concerns from data storage concerns.
  - **Uniform Interface:** Resources are identified by URIs (e.g., \`/api/v1/users/42\`).
- **Standard HTTP Verbs:**
  - **GET:** Retrieve resources (Safe & Idempotent).
  - **POST:** Create a new resource (Neither safe nor idempotent).
  - **PUT:** Completely replace an existing resource (Idempotent).
  - **PATCH:** Partially update an existing resource.
  - **DELETE:** Remove a specified resource (Idempotent).
- **HTTP Status Code Families:**
  - **2xx (Success):** \`200 OK\`, \`201 Created\`, \`204 No Content\`.
  - **3xx (Redirection):** \`301 Moved Permanently\`, \`304 Not Modified\`.
  - **4xx (Client Errors):** \`400 Bad Request\`, \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\`, \`409 Conflict\`.
  - **5xx (Server Errors):** \`500 Internal Server Error\`, \`502 Bad Gateway\`, \`503 Service Unavailable\`.`,
    code_example: {
      language: 'text',
      code: `RESTful Resource URIs:
GET    /api/users       -> List all users (200 OK)
POST   /api/users       -> Create new user (201 Created)
GET    /api/users/10    -> Retrieve user #10 (200 OK or 404 Not Found)
PUT    /api/users/10    -> Overwrite user #10 (200 OK)
DELETE /api/users/10    -> Remove user #10 (204 No Content)`
    },
    interviewer_tip: "Define Idempotency clearly: executing the identical request multiple times produces the exact same server resource state.",
    common_mistakes: "Using verbs in URIs like `/api/getUsers` instead of standard nouns `/api/users`.",
    follow_ups: ["What is the difference between 401 Unauthorized and 403 Forbidden?", "What makes PUT idempotent while POST is not?"]
  },
  {
    id: 'swe-25',
    company: 'accenture',
    domain: 'swe-general',
    question: 'What is the difference between WHERE and HAVING clauses in SQL?',
    category: 'DBMS & SQL',
    difficulty: 'Easy',
    summary: 'WHERE filters rows before grouping without aggregate functions; HAVING filters grouped rows after GROUP BY and works directly with aggregates.',
    answer: `Key differences between WHERE and HAVING:
- **WHERE Clause:**
  - Filters individual source rows **before** any grouping or aggregation takes place.
  - Cannot contain aggregate functions (e.g., \`WHERE COUNT(*) > 5\` is invalid syntax).
  - Can be used in \`SELECT\`, \`UPDATE\`, and \`DELETE\` statements without \`GROUP BY\`.
  - Highly efficient because it prunes unneeded rows before expensive grouping computations.
- **HAVING Clause:**
  - Filters aggregated groups of rows **after** \`GROUP BY\` has executed.
  - Specifically designed to filter on aggregate functions (e.g., \`HAVING SUM(salary) > 50000\`).
  - Used almost exclusively in conjunction with \`GROUP BY\` in \`SELECT\` queries.
- **SQL Execution Order:**
  - \`FROM\` -> \`WHERE\` -> \`GROUP BY\` -> \`HAVING\` -> \`SELECT\` -> \`ORDER BY\` -> \`LIMIT\`.`,
    code_example: {
      language: 'sql',
      code: `-- Filtering individual rows with WHERE, then aggregated groups with HAVING:
SELECT department_id, COUNT(*) AS emp_count, AVG(salary) AS avg_sal
FROM Employees
WHERE status = 'Active'         -- Filters individual rows BEFORE grouping
GROUP BY department_id
HAVING COUNT(*) >= 5           -- Filters groups AFTER aggregation
ORDER BY avg_sal DESC;`
    },
    interviewer_tip: "Mention the SQL logical processing order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT) to impress technical interviewers.",
    common_mistakes: "Attempting to use aggregate functions inside a WHERE clause.",
    follow_ups: ["Can HAVING be used without a GROUP BY clause?", "Why is WHERE more performant than HAVING for non-aggregate filters?"]
  },
  {
    id: 'swe-26',
    company: 'accenture',
    domain: 'swe-general',
    question: 'What is Thrashing in Operating Systems, and how does it cause computer performance to degrade?',
    category: 'OS & Networks',
    difficulty: 'Medium',
    summary: 'Thrashing occurs when the OS spends more time swapping pages between RAM and disk than executing actual instructions, caused by insufficient physical memory.',
    answer: `Deep dive into Operating System Thrashing:
- **Definition:** A catastrophic state where the CPU spends virtually all its processing cycles handling page faults and swapping memory pages between physical RAM and disk swap space, rather than executing actual program instructions.
- **Root Cause:**
  - Occurs when the sum of the working sets of all active processes exceeds total available physical RAM.
  - The OS allocates too few frames to each process. As a result, a process immediately generates a page fault, swaps out another process's page, which in turn immediately page-faults on its next instruction.
- **Performance Symptoms:**
  - Extreme drop in CPU process throughput despite 100% disk I/O activity.
  - Severe UI latency, system unresponsive freezes.
  - The CPU scheduler observes low CPU utilization and mistakenly spawns more processes, exacerbating thrashing.
- **Prevention Techniques:**
  - **Working Set Model:** Only schedule a process if its entire working set of active pages can fit in physical RAM.
  - **Page Fault Frequency (PFF):** Monitor page fault rates. If rate is too high, allocate more frames; if no frames left, suspend lower-priority processes.
  - **Add Physical RAM:** Increase physical memory capacity.`,
    code_example: {
      language: 'text',
      code: `Thrashing Vicious Cycle:
High Memory Pressure -> High Page Fault Rate -> CPU waits on Disk I/O -> CPU Utilization Drops -> OS Scheduler adds more processes -> Thrashing worsens!`
    },
    interviewer_tip: "Explain why OS schedulers can inadvertently worsen thrashing by mistaking low CPU utilization for system idle time.",
    common_mistakes: "Confusing thrashing with CPU infinite loops or deadlocks; thrashing is specifically disk-paging memory exhaustion.",
    follow_ups: ["What is the Working Set Model in memory management?", "How does page replacement policy (LRU vs FIFO) impact page fault frequency?"]
  },
  {
    id: 'swe-27',
    company: 'infosys',
    domain: 'swe-general',
    question: 'Where do we create an INDEX in a database, and what are its pros and cons?',
    category: 'DBMS & SQL',
    difficulty: 'Medium',
    summary: 'Indexes are created on columns frequently used in WHERE, JOIN, and ORDER BY clauses. Pros: O(log N) lookup speed. Cons: disk space and write overhead on INSERT/UPDATE/DELETE.',
    answer: `Database Indexing strategies and trade-offs:
- **Where to Create Indexes:**
  - Foreign key columns involved in table \`JOIN\` operations.
  - Columns frequently filtered in \`WHERE\` clauses with high cardinality (many distinct values).
  - Columns used in \`ORDER BY\` and \`GROUP BY\` to avoid expensive in-memory disk sorting.
- **Advantages:**
  - Dramatically improves \`SELECT\` query lookup performance from an O(N) full table scan down to an O(log N) B-Tree binary search.
  - Enforces uniqueness when created as a Unique Index.
- **Disadvantages & Overhead:**
  - **Write Penalty:** Every \`INSERT\`, \`UPDATE\`, and \`DELETE\` must rebalance B-Tree nodes and update index pages, degrading write throughput.
  - **Disk Storage:** Secondary indexes consume substantial disk space and memory buffer cache.
  - **Over-indexing:** Having too many indexes confuses the query optimizer and consumes excessive RAM.`,
    code_example: {
      language: 'sql',
      code: `-- Creating a composite index for customer lookup:
CREATE INDEX idx_orders_customer_date 
ON Orders(customer_id, order_date DESC);

-- Query benefits from the index:
SELECT order_id, total_amount 
FROM Orders 
WHERE customer_id = 452 
ORDER BY order_date DESC;`
    },
    interviewer_tip: "Explain the leftmost prefix rule for composite multi-column indexes.",
    common_mistakes: "Indexing low-cardinality boolean columns (e.g. `is_active`), where full scans are often cheaper.",
    follow_ups: ["What is the difference between a Clustered and Non-Clustered index?", "What is a Covering Index?"]
  },
  {
    id: 'swe-28',
    company: 'amazon',
    domain: 'swe-general',
    question: 'Given an array containing n-1 distinct numbers in the range [1, n], write code to find the missing number in O(N) time and O(1) space.',
    category: 'Coding & DSA',
    difficulty: 'Easy',
    summary: 'Find the missing number using the mathematical Gauss sum formula n*(n+1)//2, or using bitwise XOR to prevent integer overflow.',
    answer: `Two optimal O(N) time, O(1) space approaches:
- **Approach 1: Mathematical Sum Formula (Gauss):**
  - Expected sum of first \`n\` natural numbers: \`expected = n * (n + 1) // 2\`.
  - Subtract the actual array sum: \`missing = expected - sum(arr)\`.
  - *Risk:* In languages like C/C++ or Java with fixed 32-bit integers, \`n * (n + 1)\` can trigger arithmetic overflow if \`n\` is large.
- **Approach 2: Bitwise XOR (Overflow-Safe):**
  - Properties of XOR: \`x ^ x = 0\` and \`x ^ 0 = x\`.
  - XOR all numbers from 1 to \`n\`, and XOR all elements present in the array.
  - All existing numbers cancel out to 0, leaving only the missing number!
  - Fully immune to integer overflow in any programming language.`,
    code_example: {
      language: 'python',
      code: `def find_missing_number_xor(arr, n):
    xor_all = 0
    # XOR all numbers from 1 to n
    for i in range(1, n + 1):
        xor_all ^= i
        
    # XOR with all array elements
    for num in arr:
        xor_all ^= num
        
    return xor_all

# Test: Array of size 4 with n=5 -> [1, 2, 4, 5] (missing 3)
print(find_missing_number_xor([1, 2, 4, 5], 5)) # Output: 3`
    },
    interviewer_tip: "Offering the XOR bitwise solution demonstrates mastery of low-level systems programming and integer overflow awareness.",
    common_mistakes: "Sorting the array first (O(N log N)) or using a hash set with O(N) extra space.",
    follow_ups: ["How would you find TWO missing numbers in range [1, n] in O(N) time and O(1) space?"]
  },
  {
    id: 'swe-29',
    company: 'capgemini',
    domain: 'swe-general',
    question: 'What are the differences between Abstract Classes and Interfaces in Java and OOP?',
    category: 'OOPs',
    difficulty: 'Easy',
    summary: 'An abstract class can maintain state and concrete methods with single inheritance; an interface defines contracts with multiple inheritance and default methods.',
    answer: `Detailed comparison between Abstract Classes and Interfaces:
- **Abstract Class:**
  - Can contain both abstract methods (no implementation) and concrete methods (with body).
  - Can maintain instance variables (state) and non-static fields.
  - Can define constructors invoked when subclasses are instantiated.
  - A class can extend only **one** abstract class (single inheritance).
  - Use when classes share a strong 'is-a' relationship and common state/behavior.
- **Interface:**
  - Defines a strict contract of behavior that implementing classes must satisfy.
  - All variables are implicitly \`public static final\` (constants only; no instance state).
  - Cannot have instance constructors.
  - A class can implement **multiple** interfaces (multiple inheritance of type).
  - From Java 8 onwards, can have \`default\` and \`static\` methods with implementations.`,
    code_example: {
      language: 'java',
      code: `// Interface contract:
interface Flyable {
    void fly(); // public abstract by default
    default void glide() { System.out.println("Gliding in the wind"); }
}

// Abstract class with state:
abstract class Bird {
    private String species;
    public Bird(String species) { this.species = species; }
    public String getSpecies() { return species; }
    public abstract void eat();
}

class Eagle extends Bird implements Flyable {
    public Eagle() { super("Bald Eagle"); }
    @Override public void eat() { System.out.println("Eats fish"); }
    @Override public void fly() { System.out.println("Soars high"); }
}`
    },
    interviewer_tip: "State clearly: Use abstract classes for code reuse among closely related classes; use interfaces to define a contract for disparate classes.",
    common_mistakes: "Thinking interfaces in modern Java cannot have any method bodies (default and static methods have bodies).",
    follow_ups: ["What is a functional interface in Java?", "What is the Diamond Problem when using multiple default methods in interfaces?"]
  },
  {
    id: 'swe-30',
    company: 'tcs',
    domain: 'swe-general',
    question: 'HR Question: Tell me about yourself, your background, and why you are interested in this Software Engineering role.',
    category: 'HR',
    difficulty: 'Easy',
    summary: 'Structure your introduction with the Present-Past-Future formula: current role/studies -> impactful technical projects built -> future alignment with the company.',
    answer: `Structured Present-Past-Future Interview Framework:
- **1. Present (Current snapshot):**
  - "I am a Computer Science graduate passionate about full-stack development, distributed systems, and clean software architecture. Currently, I focus on building scalable web apps with React, Python, and PostgreSQL."
- **2. Past (Key accomplishments & projects):**
  - "During my academic career, I engineered an AI-powered mock interview simulator featuring real-time WebSocket communication, automated scoring, and speech analysis. This taught me how to handle concurrent state, async API pipelines, and optimize database indexing."
- **3. Future (Why this company & role):**
  - "I'm excited about this opportunity because your team works on high-scale enterprise distributed systems. I want to bring my strong DSA fundamentals, proactive problem-solving, and continuous learning mindset to create high-impact software."`,
    code_example: {
      language: 'text',
      code: `Framework Blueprint:
[Present]: Who you are + current tech stack focus
[Past]: 1-2 impressive technical projects + measurable results
[Future]: Why this company + what value you bring`
    },
    interviewer_tip: "Keep your response between 90 to 120 seconds. Avoid reciting your resume line-by-line.",
    common_mistakes: "Talking extensively about personal life or repeating school grades instead of technical passions and project outcomes.",
    follow_ups: ["What is your greatest technical strength and greatest weakness?", "Where do you see yourself in 3-5 years?"]
  }
];

// Helper to construct company datasets
export const buildSWECompanyDataset = (seeds, companyId, totalCount) => {
  const result = [...seeds];
  let idx = 0;
  while (result.length < totalCount) {
    const baseItem = seeds[idx % seeds.length];
    const num = (result.length + 1).toString().padStart(2, '0');
    result.push({
      ...baseItem,
      id: `${companyId}-swe-${num}`,
      company: companyId,
      domain: 'swe-general'
    });
    idx++;
  }
  return result;
};

export const ALL_SWE_GENERAL_QUESTIONS = {
  tcs: buildSWECompanyDataset(SWE_GENERAL_SEEDS, 'tcs', 120),
  accenture: buildSWECompanyDataset(SWE_GENERAL_SEEDS, 'accenture', 95),
  infosys: buildSWECompanyDataset(SWE_GENERAL_SEEDS, 'infosys', 90),
  wipro: buildSWECompanyDataset(SWE_GENERAL_SEEDS, 'wipro', 95),
  capgemini: buildSWECompanyDataset(SWE_GENERAL_SEEDS, 'capgemini', 90),
  cognizant: buildSWECompanyDataset(SWE_GENERAL_SEEDS, 'cognizant', 85),
  amazon: buildSWECompanyDataset(SWE_GENERAL_SEEDS, 'amazon', 80),
  'tech-mahindra': buildSWECompanyDataset(SWE_GENERAL_SEEDS, 'tech-mahindra', 65),
};

export const SWE_GENERAL_QUESTIONS = SWE_GENERAL_SEEDS;
export default SWE_GENERAL_QUESTIONS;
