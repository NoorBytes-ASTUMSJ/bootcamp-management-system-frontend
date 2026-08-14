# Team Development & Git Workflow Guidelines

Welcome to the team! Please strictly adhere to the following workflow rules when contributing code.

## 1. Branching Strategy
Direct pushes to `main` are strictly disabled. Always create a dedicated branch from `main`:
- **New Feature:** `feature/short-description` (e.g., `feature/user-auth`)
- **Bug Fix:** `fix/short-description` (e.g., `fix/cors-header`)
- **Refactoring:** `refactor/short-description` (e.g., `refactor/api-routes`)

## 2. Commit Message Rules
Follow standard semantic commit messages:
- `feat: add JWT authentication middleware`
- `fix: resolve broken responsive layout on landing page`
- `docs: update setup commands in README`

## 3. Pull Request Requirements
- Fill out the PR template completely.
- Ensure at least 2 team members review and approve your PR before merging.
- Ensure there are no merge conflicts with the `main` branch.
