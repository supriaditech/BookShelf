// app/home/page.js

import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page using App Router.</p>
    </div>
  );
}
