# Sociality

A social media web app where people share photos, follow each other, and like, comment on, and save posts. Built as a frontend MVP on top of the Sociality REST API.

## Features

- **Auth**: register and login with validation; JWT stored in a cookie; protected routes via `proxy.ts`
- **Feed**: posts from people you follow, infinite scroll, "Show More" captions
- **Post actions**: optimistic like, save and follow; copy post link; list of people who liked a post
- **Post detail**: modal (and `/posts/[id]` page) with comments, emoji picker, and deleting your own comments or posts
- **Add Post**: image upload by click or drag and drop, preview, caption
- **My Profile**: stats, followers/following lists, Gallery and Saved tabs, Edit Profile with photo upload
- **User profile**: follow/unfollow, Gallery and Liked tabs
- **Search**: find users by name or username from the header

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query) for server state and optimistic updates
- React Hook Form + Zod for forms and validation
- Day.js for relative time, Sonner for toasts

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Name                  | Description                   |
| --------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the Sociality API |

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Build for production     |
| `npm run start` | Run the production build |
| `npm run lint`  | Lint with ESLint         |

## Project structure

```
src/
  app/          routes: (auth) login/register, (main) feed, posts, me, profile
  components/   shared UI (header, search, bottom menu, shadcn/ui)
  features/     feature modules: auth, feed, posts, comments, profile, users
  hooks/        reusable hooks (infinite scroll, debounce)
  lib/          API client, token, date, image and clipboard helpers
  types/        API response types
  proxy.ts      route protection
```
