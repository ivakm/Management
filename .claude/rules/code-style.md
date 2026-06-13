# Angular 19 & TypeScript Code Style

## Strict TypeScript

- Enable `strict: true` in TypeScript configuration
- Enable `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`
- Full type annotations required for public APIs, function parameters, and return types
- Prefer `readonly` whenever mutation is not required
- Use `===` and `!==` only
- Use modern TypeScript 5.x features (`satisfies`, template literal types, const assertions, discriminated unions)
- Avoid `any` (use `unknown` when type is not known)
- Prefer `const` over `let`
- Trailing commas in multiline objects, arrays, interfaces, and function parameters

## Angular Architecture

- Use standalone components by default
- Prefer Signals over RxJS state where appropriate
- Use `inject()` instead of constructor injection for services
- Keep components focused on presentation and UI logic
- Move business logic into services or dedicated domain classes
- Avoid logic inside templates
- Use OnPush change detection strategy for all components
- Prefer Reactive Forms over Template-driven Forms
- Avoid direct DOM manipulation (`document.querySelector`, `ElementRef.nativeElement`) unless absolutely necessary

## Class Organization

Specific order for class elements:

1. Constants
2. Signals
3. Inputs / Outputs / Models
4. Injected dependencies
5. Public properties
6. Protected properties
7. Private properties
8. Constructor (if needed)
9. Lifecycle hooks
10. Public methods
11. Protected methods
12. Private methods

## Angular Conventions

- Use strongly typed forms
- Prefer Signals for component state
- Prefer `computed()` over duplicated state
- Prefer `effect()` only when side effects are required
- Avoid nested subscriptions
- Prefer `async` pipe or `toSignal()`
- Unsubscribe automatically using `takeUntilDestroyed()`
- Avoid manual subscription management when possible
- Use route resolvers or services for data loading
- Use feature-based folder structure

## RxJS Conventions

- Avoid nested `subscribe()`
- Prefer operators (`switchMap`, `combineLatest`, `forkJoin`, `mergeMap`) over imperative chains
- Keep streams declarative
- Use `tap()` only for side effects
- Handle errors with `catchError()`
- Use `shareReplay()` when caching is required

## State Management

- Prefer Signals for local component state
- Use NgRx only for complex global state
- Avoid storing derived state
- Keep state normalized
- Prefer immutable updates

## Code Quality Tools

| Tool | Purpose | Config |
|--------|----------|----------|
| ESLint | Code quality | Angular ESLint strict preset |
| Prettier | Code formatting | Angular + TypeScript conventions |
| TypeScript | Static analysis | Strict mode enabled |
| SonarJS | Complexity analysis | ESLint integration |
| Cognitive Complexity | Complexity limits | class: 85, function: 8 |

## Performance Rules

- Always use `track` in `@for`
- Avoid calling methods directly from templates
- Use lazy-loaded routes
- Prefer Signals over unnecessary Observables
- Minimize change detection triggers
- Avoid large shared modules
- Optimize bundle size and tree-shaking

## Testing

- Unit test services, pipes, and business logic
- Prefer Angular Testing Library over implementation-focused tests
- Mock external dependencies
- Test behavior, not implementation details
- Maintain high coverage for critical business logic

## AI Assistant Rules

- Never generate code using `any`
- Never disable TypeScript checks
- Never use `// @ts-ignore` unless explicitly requested
- Never use constructor injection when `inject()` is available
- Always generate standalone components
- Always generate strongly typed Reactive Forms
- Always use Signals for local state unless RxJS is required
- Prefer composition over inheritance
- Prefer pure functions when possible
- Keep methods under 20 lines when practical
- Extract complex logic into services or utility functions
- Follow Angular Style Guide conventions