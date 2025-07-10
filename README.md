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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# CarList

## Local Development: Using SQLite

This project uses SQLite for local development. All data (listings, admins, audit logs) is stored in `database.sqlite` in the project root.

### Setup
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```

### Troubleshooting (Windows)
If you see errors about `better-sqlite3` bindings:
- Delete `node_modules` and `package-lock.json`.
- Reinstall dependencies:
  ```sh
  npm install
  ```
- If issues persist, rebuild the module:
  ```sh
  npm rebuild better-sqlite3
  ```

> SQLite is only used for local development. In production, listings are stored in localStorage on the client.

## Screenshots

| Screenshot | Screenshot |
|------------|------------|
| ![Screenshot 1](https://github.com/user-attachments/assets/5fe2f9bf-7dc9-4e77-8945-27ad2404ba3d) | ![Screenshot 2](https://github.com/user-attachments/assets/c48fa608-a7c4-4c2d-854c-728bf5b76d2f) |
| ![Screenshot 3](https://github.com/user-attachments/assets/d7ff4402-f12e-4674-9067-dde087a79c4d) | ![Screenshot 4](https://github.com/user-attachments/assets/ffcacd52-4e88-468b-83fb-2d719be4aedf) |
| ![Screenshot 5](https://github.com/user-attachments/assets/0a92328a-92b1-412c-b451-f7b0fa412903) | ![Screenshot 6](https://github.com/user-attachments/assets/06ab731f-059b-4ad1-bc1f-2ed9e107c210) |


