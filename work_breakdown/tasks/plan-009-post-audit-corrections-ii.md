# Plan 009: Post-Audit Corrections II

## Objective
Address all remaining gaps identified in the latest audit to achieve 100% compliance with the project specification. This plan will resolve the critical issues preventing the system from passing the final audit.

---

### 1. Resolve Testing Infrastructure Issues

- [x] **(TESTING)** Add pytest-cov dependency to requirements.txt
- [x] **(TESTING)** Verify pytest runs successfully with coverage reporting
- [x] **(TESTING)** Ensure all tests pass in the CI/CD pipeline

---

### 2. Fix Docker Build Failures

- [x] **(DEVOPS)** Resolve missing module errors in admin panel build
  - Fixed '@/bot-monitor/service' import issue
  - Corrected invalid 'import'/'export' syntax in API routes
- [x] **(DEVOPS)** Update Dockerfiles to include all necessary dependencies
- [x] **(DEVOPS)** Verify successful Docker build for both bot service and admin panel
- [x] **(DEVOPS)** Implement Docker health checks
- [x] **(DEVOPS)** Add environment validation to Docker entrypoints

---

### 3. Correct Next.js Component Issues

- [x] **(UI)** Add 'use client' directive to all components using React hooks
- [x] **(UI)** Verify proper client/server component separation
- [ ] **(UI)** Test all admin panel functionality after corrections

---

### 4. Final Verification

- [x] **(TESTING)** Run full end-to-end test suite in Docker environment
- [ ] **(TESTING)** Verify all features work as specified in canonical_spec.md
- [ ] **(DOCS)** Update deployment guide with Docker fixes
- [ ] **(DOCS)** Document environment variable requirements