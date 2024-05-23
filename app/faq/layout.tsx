import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Allbooks FAQ Search",
  description: "NLP Search for Allbooks FAQs",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
