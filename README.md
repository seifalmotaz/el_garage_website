This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Dokploy (Docker)

This project contains a production-ready `Dockerfile` and `.dockerignore` configured for deploying to Dokploy or any other Docker-based PaaS.

### Steps to Deploy on Dokploy:

1. **Create a new Application** in your Dokploy Dashboard.
2. **Configure Git Provider**: Point it to your repository.
3. **Build Settings**:
   - **Build Type**: `Dockerfile`
   - **Context Path**: `website`
   - **Dockerfile Path**: `Dockerfile` (relative to the context path, i.e., `website/Dockerfile`)
4. **Environment Variables**: Add any runtime environment variables if needed.
5. **Port Configuration**: Ensure the application port is set to `3000` (the default port exposed by the Dockerfile).
6. Click **Deploy**.
