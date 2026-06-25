import { redirect } from 'next/navigation'

export default function Home({ searchParams }: { searchParams: Record<string, string> }) {
  const qs = new URLSearchParams(searchParams as Record<string, string>).toString()
  redirect('/app.html' + (qs ? '?' + qs : ''))
}
