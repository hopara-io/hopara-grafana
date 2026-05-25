## Project knowledge

This repository contains a **Grafana plugin**. You must Read @./.config/AGENTS/instructions.md before doing changes.

## Verification Requirements

Before declaring any feature or code changes complete and ready to commit/push, you **MUST** run the validation command:
```bash
npm run pre-commit
```
This script runs all static analysis, typechecking, unit tests, and production build checks. The feature is only considered ready once this script passes with exit code `0`.
