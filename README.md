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

## Tasks

### Task 1: Fix the bugs

Run `npm test` - you'll see failing tests. There are **2 bugs** in `src/lib/metrics.ts`. Fix them so all tests pass.

### Task 2: Add a feature

Add the ability to **star/bookmark campaigns**:

- Add a `starred` boolean field to the Campaign model (default `false`)
- Create a `PATCH /api/campaigns/[id]` endpoint that toggles the starred status
- Add a star icon/button to each row in the campaigns table that toggles on click
- Starred campaigns should appear at the top of the list

### Notes

- Use whatever AI tools you normally use
- Talk through your thinking as you go
- Ask questions if anything is unclear
