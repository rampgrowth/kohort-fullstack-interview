# Fullstack Interview Exercise

A simplified campaign analytics dashboard built with Next.js, Prisma, and SQLite.

## Setup

```bash
npm run setup
```

This installs dependencies, creates the SQLite database, and seeds it with sample data.

## Run

```bash
npm run dev       # Start the app at http://localhost:3000
npm test          # Run the test suite
```

## The App

A dashboard showing mobile game campaigns with week-over-week metric comparisons (spend, installs, CPI, revenue). Data covers the last 14 days: the current period (last 7 days) is compared against the baseline (prior 7 days).

## Notes

- Use whatever AI tools you normally use
- Talk through your thinking as you go
- Ask questions if anything is unclear

## Tasks

### Task 1: Fix the bugs

Run `npm test` — there are failing tests. Find and fix the bugs so all tests pass.

### Task 2: Add a feature

Users want the ability to **star/bookmark campaigns** so their most important ones are easy to find. Starred campaigns should appear at the top of the list.

### Task 3: Improve the codebase

If you have time, identify and make any improvements you think would make the codebase better.

