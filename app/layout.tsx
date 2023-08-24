import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Executor",
	description: "Smart Contract Interactor",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className + ' scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100'}>{children}</body>
		</html>
	)
}
