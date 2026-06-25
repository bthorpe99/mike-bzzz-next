import { redirect } from 'next/navigation'

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const qs = new URLSearchParams(params).toString()
  redirect('/app.html' + (qs ? '?' + qs : ''))
}
