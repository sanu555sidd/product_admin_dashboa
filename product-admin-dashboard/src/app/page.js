import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/products'); // middleware sends logged-out users on to /login
}
