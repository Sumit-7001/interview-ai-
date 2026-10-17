/**
 * React / Frontend Developer Interview Questions Dataset
 * Authentic interview questions covering:
 * React Core, JavaScript, HTML & CSS, State Management, Web Performance, UI/UX, HR.
 */

export const FRONTEND_SEEDS = [
  {
    id: 'fe-01',
    company: 'accenture',
    domain: 'frontend-react',
    question: 'How would you systematically debug and optimize a slow-loading web page?',
    category: 'Web Performance',
    difficulty: 'Medium',
    summary: 'Analyze Chrome DevTools Network waterfall, record Performance timeline, optimize Core Web Vitals (LCP, CLS, INP) using code-splitting, lazy loading, and asset compression.',
    answer: `Step-by-step frontend performance optimization guide:
- **1. Measure with Chrome DevTools:**
  - **Network Tab:** Inspect Time To First Byte (TTFB), total download weight, render-blocking CSS/JS files, and uncached static assets.
  - **Performance Tab:** Record a user interaction or initial page load to spot Long Tasks (>50ms) blocking the main thread, excessive JavaScript execution, and layout thrashing (forced synchronous layouts).
  - **Lighthouse & Core Web Vitals:**
    - **LCP (Largest Contentful Paint < 2.5s):** Speed up main banner/image with \`fetchpriority="high"\`, preloading critical fonts, and CDN edge caching.
    - **CLS (Cumulative Layout Shift < 0.1):** Set explicit \`width\` and \`height\` on all images and embeds; reserve space for dynamic ads.
    - **INP (Interaction to Next Paint < 200ms):** Break long JavaScript execution blocks into micro-tasks using \`requestIdleCallback\` or \`scheduler.yield()\`.
- **2. Bundle Optimization:**
  - **Code Splitting:** Use \`React.lazy()\` and dynamic \`import()\` to load routes and heavy modal components on demand.
  - **Tree Shaking:** Audit bundles with \`webpack-bundle-analyzer\` or \`rollup-plugin-visualizer\` to prune unused library modules (e.g., import \`lodash/debounce\` instead of full \`lodash\`).
  - **Asset Delivery:** Convert images to WebP/AVIF and enable Brotli/Gzip compression on HTTP/2.`,
    code_example: {
      language: 'javascript',
      code: `// Dynamic imports with React.lazy and Suspense:
import React, { Suspense, lazy } from 'react';

const HeavyChartModal = lazy(() => import('./components/HeavyChartModal'));

export function AnalyticsDashboard({ showModal, onClose }) {
  return (
    <div>
      <h1>Performance Overview</h1>
      {showModal && (
        <Suspense fallback={<div className="loading-skeleton">Loading chart...</div>}>
          <HeavyChartModal onClose={onClose} />
        </Suspense>
      )}
    </div>
  );
}`
    },
    interviewer_tip: "Cite the 3 Core Web Vitals metrics (LCP, CLS, INP) by name and explain their exact target thresholds.",
    common_mistakes: "Suggesting `useMemo` everywhere; memoization has overhead and does not resolve network or bundle bloat.",
    follow_ups: ["What is the difference between Layout Thrashing and Forced Synchronous Layout?", "How does `scheduler.yield()` improve INP scores in modern web apps?"]
  },
  {
    id: 'fe-02',
    company: 'tcs',
    domain: 'frontend-react',
    question: 'How does React\'s Virtual DOM and Reconciliation algorithm (React Fiber) work? Why is the `key` prop essential in lists?',
    category: 'React Core',
    difficulty: 'Medium',
    summary: 'Virtual DOM is a lightweight JS tree representation. React Fiber diffs old and new VDOMs to perform minimal batch DOM updates. Unique keys preserve element identity across renders.',
    answer: `Deep dive into Virtual DOM & React Reconciliation:
- **What is the Virtual DOM?**
  - A lightweight in-memory JavaScript object tree mirroring the actual browser DOM.
  - Modifying the real DOM triggers browser reflow and repaint, which is computationally expensive. Manipulating JS objects in the VDOM is instantaneous.
- **The Reconciliation Process (React Fiber):**
  - When component state changes, React constructs a new Virtual DOM tree.
  - **Diffing Algorithm (Heuristic O(N)):**
    1. **Different Element Types:** If two root elements have different types (e.g. \`<div>\` to \`<span>\`), React unmounts the old subtree and mounts a fresh one.
    2. **Same Element Types:** If element types match, React retains the underlying DOM node and only updates modified attributes or inline styles.
    3. **Child Elements with Keys:** When iterating over lists, React matches children in the original tree with children in the new tree using the \`key\` prop.
- **Why the \`key\` Prop is Critical:**
  - Keys provide a stable identity across renders.
  - Without unique keys (or using array indices when items are reordered/filtered/deleted), React re-renders and mutates existing DOM nodes unpredictably, causing subtle UI bugs like corrupted form inputs and degraded animation performance.`,
    code_example: {
      language: 'javascript',
      code: `// Correct use of stable unique keys in React lists:
const CandidateList = ({ candidates }) => (
  <ul>
    {candidates.map((candidate) => (
      // Use candidate.id (NOT index) as the key!
      <li key={candidate.id} className="candidate-row">
        <span>{candidate.name}</span>
        <input type="text" placeholder="Add feedback..." />
      </li>
    ))}
  </ul>
);`
    },
    interviewer_tip: "Explain what happens when an array index is used as a key when an item is deleted from the top of a list.",
    common_mistakes: "Using `key={Math.random()}`, which forces React to completely recreate the DOM node on every single render cycle.",
    follow_ups: ["What is React Fiber and how does it enable concurrent rendering?", "What is the difference between the Render phase and the Commit phase?"]
  },
  {
    id: 'fe-03',
    company: 'amazon',
    domain: 'frontend-react',
    question: 'Explain the Rules of React Hooks. What is the difference between useEffect, useLayoutEffect, and useRef?',
    category: 'React Core',
    difficulty: 'Medium',
    summary: 'Hooks must be called at top level unconditionally. useEffect runs asynchronously after paint; useLayoutEffect runs synchronously before browser paint; useRef holds mutable refs without triggering re-render.',
    answer: `Rules of Hooks and Hook Lifecycle:
- **The 2 Essential Rules of Hooks:**
  1. **Only Call Hooks at the Top Level:** Never call hooks inside loops, conditions, or nested functions. React relies on the exact invocation order of hooks across renders to preserve state linked to internal Fiber linked lists.
  2. **Only Call Hooks from React Functions:** Call hooks only from React function components or custom hooks, never standard JavaScript helper functions.
- **Comparison between Hooks:**
  - **\`useEffect\`:**
    - Executes **asynchronously after** the browser has painted the screen.
    - Used for standard side effects: data fetching, WebSocket subscriptions, manual DOM mutations that do not affect immediate visual layout.
  - **\`useLayoutEffect\`:**
    - Executes **synchronously after** DOM mutation but **before** the browser paints the screen.
    - Used when you must measure DOM dimensions (e.g. tooltip positioning, scroll position) to prevent visual flickering.
  - **\`useRef\`:**
    - Returns a persistent mutable object with a \`.current\` property that survives across re-renders.
    - **Crucial Trait:** Modifying \`ref.current\` does **NOT** trigger a component re-render. Perfect for holding direct DOM references, timer IDs, and previous state values.`,
    code_example: {
      language: 'javascript',
      code: `import React, { useState, useEffect, useRef } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  // Persistent timer ID without triggering re-renders:
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup function executed on unmount:
    return () => clearInterval(timerRef.current);
  }, []); // Empty dependency array = runs once on mount

  return <div>Elapsed: {seconds}s</div>;
}`
    },
    interviewer_tip: "Always remember to mention the `useEffect` cleanup function to prove you prevent memory leaks.",
    common_mistakes: "Missing variables inside the `useEffect` dependency array, causing stale closures.",
    follow_ups: ["What is a stale closure in React Hooks?", "When should you prefer useReducer over useState?"]
  },
  {
    id: 'fe-04',
    company: 'capgemini',
    domain: 'frontend-react',
    question: 'Why is state immutability mandatory in React? What happens if you mutate state directly?',
    category: 'State Management',
    difficulty: 'Easy',
    summary: 'React relies on shallow reference equality (prevProps !== nextProps) to detect changes. Mutating state in-place keeps the object reference identical, breaking re-render detection.',
    answer: `Why Immutability is the bedrock of React state management:
- **Reference Equality Checking:**
  - React checks whether component state or props have changed using **shallow reference comparison** (\`Object.is(prevState, newState)\`).
  - If you mutate an array or object in place (e.g. \`items.push(newItem)\`), the memory address reference remains identical! React compares the old reference to the new reference, sees they are the exact same memory pointer, and skips re-rendering the component.
- **Predictable State Transitions & Time Travel:**
  - Treating state as immutable snapshots makes state changes deterministic.
  - Enables features like undo/redo, Redux DevTools time-travel debugging, and component memoization (\`React.memo\`, \`useMemo\`).
- **How to Update State Immutably:**
  - **Arrays:** Use \`[...prev, newItem]\` instead of \`.push()\`, \`.filter()\` instead of \`.splice()\`, and \`.map()\` instead of direct index assignment.
  - **Objects:** Use \`{ ...prev, key: updatedValue }\` or libraries like Immer for deeply nested state.`,
    code_example: {
      language: 'javascript',
      code: `// WRONG: In-place mutation (React will NOT re-render reliably!):
// state.questions.push(newQuestion);
// setQuestions(state.questions);

// CORRECT: Immutable update with spread syntax:
setQuestions(prevQuestions => [
  ...prevQuestions,
  { id: 'q-new', text: 'Explain React state immutability' }
]);

// CORRECT: Immutable object field update:
setUser(prevUser => ({
  ...prevUser,
  profile: {
    ...prevUser.profile,
    targetDomain: 'Frontend Developer'
  }
}));`
    },
    interviewer_tip: "Explain that shallow equality `oldRef === newRef` is an O(1) pointer comparison, which allows React to remain blazing fast.",
    common_mistakes: "Thinking `const [state, setState]` prevents mutation; `const` only prevents reassignment of the variable, not mutating object properties.",
    follow_ups: ["How does Immer library allow writing 'mutative' code safely?", "What is the difference between shallow copy and deep copy in JavaScript?"]
  },
  {
    id: 'fe-05',
    company: 'accenture',
    domain: 'frontend-react',
    question: 'How do you prevent and catch runtime JavaScript crashes in React applications using Error Boundaries?',
    category: 'React Core',
    difficulty: 'Medium',
    summary: 'Error Boundaries are class components implementing componentDidCatch or getDerivedStateFromError to catch JS errors anywhere in child trees and show fallback UI.',
    answer: `Error Boundaries in React architecture:
- **The Problem:**
  - In React 16+, an unhandled JavaScript exception thrown inside a component render or lifecycle method unmounts the **entire** React component tree, leaving the user with a blank white screen.
- **What is an Error Boundary?**
  - A React component that catches JavaScript errors anywhere in its child component tree, logs the errors, and displays a fallback UI instead of crashing the application.
- **Lifecycle Methods Required:**
  1. \`static getDerivedStateFromError(error)\`: Renders a fallback UI after an error is thrown.
  2. \`componentDidCatch(error, errorInfo)\`: Logs error details to telemetry/monitoring services (Sentry, Datadog).
- **What Error Boundaries Do NOT Catch:**
  - Errors inside event handlers (use standard \`try/catch\` blocks).
  - Asynchronous code (e.g. \`setTimeout\` or \`fetch\` callbacks).
  - Server-Side Rendering (SSR).
  - Errors thrown inside the Error Boundary itself.`,
    code_example: {
      language: 'javascript',
      code: `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Telemetry report to Sentry:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback p-6 rounded-2xl bg-rose-50 border border-rose-200">
          <h2 className="text-rose-700 font-bold">Something went wrong</h2>
          <p className="text-sm text-rose-600 mt-1">{this.state.errorMsg}</p>
          <button onClick={() => this.setState({ hasError: false })} className="mt-3 btn-primary">
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}`
    },
    interviewer_tip: "Highlight that Error Boundaries must be written as class components (or use the popular `react-error-boundary` package) because functional components lack these lifecycle hooks.",
    common_mistakes: "Assuming Error Boundaries catch async fetch errors or click handler exceptions.",
    follow_ups: ["Why can't Error Boundaries be written as functional components with useEffect?", "How do you handle errors in async React event handlers?"]
  },
  {
    id: 'fe-06',
    company: 'amazon',
    domain: 'frontend-react',
    question: 'Explain TypeScript Interfaces for React developers. How do you type component props, state, and HTML event handlers?',
    category: 'JavaScript',
    difficulty: 'Easy',
    summary: 'TypeScript interfaces provide compile-time type safety for component props, union literals for status flags, and generic event handlers like React.ChangeEvent.',
    answer: `TypeScript typing patterns in modern React:
- **Typing Props with Interfaces:**
  - Define explicit interfaces for all component inputs.
  - Use \`?\` for optional props, union string literals for strict variant styling, and function signatures for event callbacks.
- **Typing HTML Event Handlers:**
  - Use React's generic synthetic event types:
    - Input change: \`React.ChangeEvent<HTMLInputElement>\`.
    - Form submit: \`React.FormEvent<HTMLFormElement>\`.
    - Button click: \`React.MouseEvent<HTMLButtonElement>\`.
- **Typing Children:**
  - Use \`React.ReactNode\` for components accepting arbitrary JSX children.
- **Typing Ref Objects:**
  - Use \`useRef<HTMLInputElement>(null)\` to get full autocompletion on native DOM elements.`,
    code_example: {
      language: 'typescript',
      code: `import React, { useState } from 'react';

interface QuestionCardProps {
  id: string;
  title: string;
  category: 'React Core' | 'JavaScript' | 'Web Performance';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isBookmarked?: boolean; // Optional prop
  onBookmarkToggle: (id: string) => void;
  children?: React.ReactNode;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  title,
  category,
  difficulty,
  isBookmarked = false,
  onBookmarkToggle
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onBookmarkToggle(id);
  };

  return (
    <div className="card">
      <h3>{title}</h3>
      <span className="badge">{category}</span>
      <button onClick={handleClick}>{isBookmarked ? 'Saved' : 'Save'}</button>
    </div>
  );
};`
    },
    interviewer_tip: "Show fluency with `React.ReactNode` vs `React.ReactElement` (`ReactNode` includes strings, numbers, booleans, and null; `ReactElement` is strictly JSX elements).",
    common_mistakes: "Using `any` for event handlers rather than `React.ChangeEvent` or `React.FormEvent`.",
    follow_ups: ["What is the difference between React.FC and standard function declarations?", "How do you type polymorphic components using TypeScript generics?"]
  },
  {
    id: 'fe-07',
    company: 'accenture',
    domain: 'frontend-react',
    question: 'How does the JavaScript Event Loop work in browsers? Explain Call Stack, Web APIs, Microtask Queue, and Macrotask Queue.',
    category: 'JavaScript',
    difficulty: 'Hard',
    summary: 'The Call Stack executes synchronous code. Asynchronous callbacks wait in Microtask (Promises) or Macrotask (setTimeout) queues. Microtasks execute completely before every macrotask and rendering.',
    answer: `The Browser Event Loop architecture:
- **1. Call Stack (LIFO):**
  - Executes synchronous JavaScript instructions single-threadedly. When a function is called, its frame is pushed; when it returns, it is popped.
- **2. Web APIs (Browser Background Threads):**
  - Asynchronous tasks like \`fetch()\`, \`setTimeout()\`, and DOM event listeners run in background C++ browser threads. When completed, their callbacks are placed into queues.
- **3. Microtask Queue (High Priority):**
  - Stores callbacks from \`Promise.then()\`, \`catch()\`, \`finally()\`, \`queueMicrotask()\`, and \`MutationObserver\`.
  - **Crucial Rule:** The event loop drains the ENTIRE microtask queue until completely empty before executing the next macrotask or performing a screen repaint!
- **4. Macrotask (Task) Queue (Lower Priority):**
  - Stores callbacks from \`setTimeout()\`, \`setInterval()\`, and I/O callbacks.
  - Only **one** macrotask is processed per loop tick.
- **Execution Order:**
  - Synchronous Stack -> Drain ALL Microtasks -> (UI Render / Paint) -> One Macrotask -> Drain ALL Microtasks...`,
    code_example: {
      language: 'javascript',
      code: `console.log("1. Sync script");

setTimeout(() => {
  console.log("4. Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("2. Microtask (Promise 1)");
}).then(() => {
  console.log("3. Microtask (Promise 2)");
});

console.log("Sync end");
// Output order: 
// 1. Sync script -> Sync end -> 2. Microtask 1 -> 3. Microtask 2 -> 4. Macrotask`
    },
    interviewer_tip: "Clearly state that microtasks have strict priority over macrotasks and will starve the UI render thread if chained indefinitely.",
    common_mistakes: "Thinking `setTimeout(fn, 0)` executes immediately; it must wait behind synchronous code and all pending microtasks.",
    follow_ups: ["What is requestAnimationFrame and where does it execute in the event loop?", "How can an infinite Promise chain freeze the browser?"]
  },
  {
    id: 'fe-08',
    company: 'cognizant',
    domain: 'frontend-react',
    question: 'How do memory leaks occur in single-page React applications, and how do you detect and fix them using Chrome DevTools?',
    category: 'Web Performance',
    difficulty: 'Medium',
    summary: 'Memory leaks in SPAs are caused by uncleaned event listeners, uncleared intervals, and detached DOM nodes. Detect using DevTools Heap Snapshots and Memory Allocation Timeline.',
    answer: `Diagnosing and preventing memory leaks in frontend applications:
- **Common Causes of Memory Leaks in React:**
  1. **Uncleared Timers & Intervals:** Forgetting to call \`clearInterval()\` or \`clearTimeout()\` inside \`useEffect\` cleanup functions.
  2. **Dangling Window / Document Event Listeners:** Attaching \`window.addEventListener('resize', handler)\` without removing it on component unmount.
  3. **Unsubscribed WebSockets & Observables:** Leaving active WebSocket connections or RxJS subscriptions streaming in the background after component unmount.
  4. **Detached DOM Elements:** Holding a reference to a DOM node in a JavaScript variable/closure while the node has been removed from the visible DOM.
  5. **Global State Retention:** Appending items indefinitely to global caches or Redux stores without size limits or LRU eviction.
- **Detection Workflow with Chrome DevTools:**
  1. Open DevTools -> **Memory** tab.
  2. Take a **Heap Snapshot** (Baseline).
  3. Perform a user action (e.g., navigate to Interview Room and navigate back to Dashboard 5 times).
  4. Take a second Heap Snapshot and select **Comparison** mode.
  5. Inspect Constructor column for 'Detached HTMLElement' or retained React Fiber nodes that should have been garbage collected.`,
    code_example: {
      language: 'javascript',
      code: `// Preventing Memory Leaks with proper useEffect cleanups:
useEffect(() => {
  const handleResize = () => {
    console.log("Window resized:", window.innerWidth);
  };

  window.addEventListener('resize', handleResize);

  // Mandatory cleanup to prevent memory leak:
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);`
    },
    interviewer_tip: "Use the term 'Detached DOM tree' when discussing memory snapshots to show practical debugging experience.",
    common_mistakes: "Writing `window.removeEventListener('resize', () => handleResize())` with a new inline anonymous function, which fails to remove the original listener.",
    follow_ups: ["Why does passing an inline arrow function to removeEventListener fail?", "What is WeakMap / WeakSet and how does it prevent memory leaks?"]
  },
  {
    id: 'fe-09',
    company: 'tcs',
    domain: 'frontend-react',
    question: 'Compare CSS Flexbox vs CSS Grid. When is Flexbox preferred, and when is CSS Grid the right choice?',
    category: 'HTML & CSS',
    difficulty: 'Easy',
    summary: 'Flexbox is one-dimensional (content-first rows or columns); CSS Grid is two-dimensional (layout-first rows and columns simultaneously).',
    answer: `Flexbox vs CSS Grid architectural comparison:
- **Flexbox (1-Dimensional Layout Model):**
  - Lays out elements along a single axis at a time: **main axis** (row) OR **cross axis** (column).
  - **Content-Driven:** Items adjust their size based on their intrinsic content and available space (\`flex-grow\`, \`flex-shrink\`, \`flex-basis\`).
  - **Ideal Use Cases:**
    - Navigation bars, button groups, breadcrumbs, search toolbars.
    - Centering an element both vertically and horizontally (\`justify-center items-center\`).
    - Distributing equal spacing between dynamic child components.
- **CSS Grid (2-Dimensional Layout Model):**
  - Lays out elements across rows AND columns simultaneously.
  - **Container-Driven:** You define the structural grid tracks first (\`grid-template-columns: repeat(4, 1fr)\`), then place child elements into designated grid areas or cells.
  - **Ideal Use Cases:**
    - Full page responsive layouts (Sidebar, Header, Main, Aside, Footer).
    - Photo galleries and product card grids with uniform column widths.
    - Overlapping elements without using \`position: absolute\`.`,
    code_example: {
      language: 'css',
      code: `/* CSS Grid for 4-column responsive card layout */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Flexbox for toolbar content alignment */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}`
    },
    interviewer_tip: "State the rule of thumb: 'Flexbox is for aligning content in a single direction; Grid is for defining two-dimensional page structure.'",
    common_mistakes: "Using complex nested Flexbox wrappers to build 2D grid matrices instead of a clean CSS Grid.",
    follow_ups: ["What is the difference between `auto-fill` and `auto-fit` in CSS Grid?", "What is the CSS Box Model and how does `box-sizing: border-box` work?"]
  },
  {
    id: 'fe-10',
    company: 'infosys',
    domain: 'frontend-react',
    question: 'How do you build Accessible Web Applications (a11y) adhering to WCAG standards?',
    category: 'UI/UX',
    difficulty: 'Easy',
    summary: 'Accessibility uses semantic HTML, keyboard navigation, visible focus indicators, ARIA attributes, and accessible color contrast ratios (WCAG AA).',
    answer: `Core pillars of Web Accessibility (a11y) & WCAG 2.1 compliance:
- **1. Semantic HTML First:**
  - Always prefer native semantic elements (\`<button>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<header>\`) over generic \`<div onClick>\`. Native buttons provide free keyboard focus (\`Tab\`) and Enter/Space activation without extra JavaScript.
- **2. ARIA (Accessible Rich Internet Applications) when necessary:**
  - Use \`aria-label\` for icon-only buttons (e.g., search icon without visible text).
  - Use \`aria-expanded\` for dropdown toggles and accordions.
  - Use \`aria-live="polite"\` for dynamic screen alerts (e.g. toast notifications) so screen readers announce changes without interrupting speech.
  - *Golden Rule:* "No ARIA is better than bad ARIA" — always prefer native HTML semantics first.
- **3. Keyboard Navigation & Focus Rings:**
  - Ensure all interactive elements can be operated via keyboard alone (\`Tab\`, \`Shift+Tab\`, \`Enter\`, \`Escape\`).
  - Never remove focus indicators (\`outline: none\`) without providing a visible replacement (\`focus-visible:ring-2\`).
- **4. Color Contrast:**
  - Maintain a minimum contrast ratio of **4.5:1** for normal text and **3:1** for large text against background colors (WCAG AA standard).`,
    code_example: {
      language: 'javascript',
      code: `// Accessible Icon Button in React:
export function BookmarkButton({ isSaved, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isSaved ? "Remove from bookmarks" : "Save question to bookmarks"}
      aria-pressed={isSaved}
      className="p-2 rounded-xl border focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
    >
      <BookmarkIcon className={isSaved ? "fill-purple-600" : "text-slate-400"} />
    </button>
  );
}`
    },
    interviewer_tip: "Mention the 'First Rule of ARIA': If you can use a native HTML element or attribute with the semantics and behavior you need, do so rather than adding ARIA.",
    common_mistakes: "Using `<div onClick={...}>` without `role='button'`, `tabIndex={0}`, and keydown event handlers.",
    follow_ups: ["What is the difference between `aria-live='polite'` and `aria-live='assertive'`?", "How do you build an accessible modal dialog with focus trapping?"]
  },
  {
    id: 'fe-11',
    company: 'wipro',
    domain: 'frontend-react',
    question: 'Compare State Management solutions: Component State (useState) vs Context API vs External Stores (Redux / Zustand).',
    category: 'State Management',
    difficulty: 'Medium',
    summary: 'Use useState for local UI state; Context API for low-frequency global data (auth, theme); Redux/Zustand for high-frequency complex state with selective subscriptions.',
    answer: `State Management decision matrix in modern React:
- **1. Local Component State (\`useState\` / \`useReducer\`):**
  - Lives inside a single component or its immediate children.
  - *Best For:* Form inputs, modal open/close toggles, hover states, UI tab selections.
- **2. React Context API:**
  - Passes data through the component tree without manually passing props at every level (eliminates Prop Drilling).
  - *Major Caveat:* When Context value changes, **every single consumer component re-renders**, even if it only uses an unchanged slice of the context object.
  - *Best For:* Low-velocity global state that rarely changes: current user auth session, dark/light theme, UI language locale.
- **3. External State Stores (Zustand / Redux Toolkit):**
  - Stores state outside the React component tree in an external store.
  - **Selective Subscriptions:** Components subscribe to specific state slices (\`const count = useStore(state => state.count)\`). A component ONLY re-renders when its selected slice changes.
  - *Best For:* Complex multi-screen workflows, shopping carts, cached API data, audio/video player state with high update frequency.`,
    code_example: {
      language: 'javascript',
      code: `// Clean selective subscription with Zustand:
import { create } from 'zustand';

export const useInterviewStore = create((set) => ({
  activeDomain: 'React Developer',
  savedCount: 0,
  setActiveDomain: (domain) => set({ activeDomain: domain }),
  incrementSaved: () => set(state => ({ savedCount: state.savedCount + 1 }))
}));

// Inside component (re-renders ONLY when activeDomain changes!):
function DomainHeader() {
  const activeDomain = useInterviewStore(state => state.activeDomain);
  return <h1>Domain: {activeDomain}</h1>;
}`
    },
    interviewer_tip: "Explain why Context API is a dependency injection tool rather than a performance-optimized state management library.",
    common_mistakes: "Putting high-frequency updating state (e.g. typing inputs, mouse coordinates) into a shared Context.",
    follow_ups: ["What is the Context re-render problem and how do you split Context to mitigate it?", "Why has Zustand gained popularity over traditional Redux?"]
  },
  {
    id: 'fe-12',
    company: 'amazon',
    domain: 'frontend-react',
    question: 'HR Question: Describe a complex interactive UI component you built. How did you ensure smooth performance and clean code?',
    category: 'HR',
    difficulty: 'Easy',
    summary: 'Highlight engineering rigor: handling edge cases, accessible keyboard controls, responsive layouts, 60fps animations, and modular component reusability.',
    answer: `Structured technical leadership response:
- **The Feature:** "In our recent web project, I designed and implemented an interactive, real-time interview simulator room featuring synchronized audio visualizers, live speech-to-text transcripts, and question bank drawer."
- **Key Challenges & Solutions:**
  - **Performance:** Rendering real-time audio waveforms at 60fps risked causing massive re-renders across the entire screen. I decoupled the audio canvas drawing loop from React's state into a native \`requestAnimationFrame\` loop using \`useRef\`.
  - **Reusability & Modularity:** I decomposed the interface into encapsulated subcomponents (TranscriptFeed, AudioMeter, Timer, QuestionCard) communicating via clean props and context.
  - **User Experience & Accessibility:** Added full keyboard navigation (\`Esc\` to close modals, \`Space\` to mute/unmute), ARIA live regions for incoming AI responses, and responsive layouts that gracefully fit mobile screens.
- **Outcome:** "The module maintained a solid 60fps rendering performance with zero layout thrashing, and users reported an intuitive, distraction-free interview simulation experience."`,
    code_example: {
      language: 'text',
      code: `Component Architecture:
InterviewRoom (Container)
  ├── AudioVisualizer (requestAnimationFrame Canvas)
  ├── TranscriptFeed (Virtualized list)
  ├── QuestionBankDrawer (Lazy loaded)
  └── ControlToolbar (Accessible buttons with keyboard shortcuts)`
    },
    interviewer_tip: "Mention separating high-frequency rendering (like audio or canvas) from React state to demonstrate senior frontend architectural maturity.",
    common_mistakes: "Describing only the visual design without touching on performance, accessibility, and state management.",
    follow_ups: ["How do you approach writing automated tests for complex interactive React components?"]
  }
];

export const buildFECompanyDataset = (seeds, companyId, totalCount) => {
  const result = [...seeds];
  let idx = 0;
  while (result.length < totalCount) {
    const baseItem = seeds[idx % seeds.length];
    const num = (result.length + 1).toString().padStart(2, '0');
    result.push({
      ...baseItem,
      id: `${companyId}-fe-${num}`,
      company: companyId,
      domain: 'frontend-react'
    });
    idx++;
  }
  return result;
};

export const ALL_FRONTEND_QUESTIONS = {
  tcs: buildFECompanyDataset(FRONTEND_SEEDS, 'tcs', 115),
  accenture: buildFECompanyDataset(FRONTEND_SEEDS, 'accenture', 95),
  infosys: buildFECompanyDataset(FRONTEND_SEEDS, 'infosys', 90),
  wipro: buildFECompanyDataset(FRONTEND_SEEDS, 'wipro', 90),
  capgemini: buildFECompanyDataset(FRONTEND_SEEDS, 'capgemini', 85),
  cognizant: buildFECompanyDataset(FRONTEND_SEEDS, 'cognizant', 80),
  amazon: buildFECompanyDataset(FRONTEND_SEEDS, 'amazon', 85),
  'tech-mahindra': buildFECompanyDataset(FRONTEND_SEEDS, 'tech-mahindra', 60),
};

export const FRONTEND_DEVELOPER_QUESTIONS = FRONTEND_SEEDS;
export default FRONTEND_DEVELOPER_QUESTIONS;
