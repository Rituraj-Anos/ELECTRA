cat > CLAUDE.md << 'EOF'
# ELECTRA Build Instructions

Read ELECTRA_PRD.md for the full project spec.

## Rules:
- Build autonomously without stopping or asking questions
- Fix errors automatically and continue
- Never use placeholder content
- Commit after each major step
- Apply all 4 skill repo patterns to every component

## Build Order:
1. Read ELECTRA_PRD.md fully first
2. Create monorepo structure
3. Initialize backend (Node.js + Express + TypeScript)
4. Initialize frontend (Next.js 14)
5. Install all dependencies
6. Build backend services + routes
7. Build frontend pages + components
8. Write tests
9. Create Dockerfile
10. Write README.md
EOF