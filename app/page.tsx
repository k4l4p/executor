"use client"
import "@rainbow-me/rainbowkit/styles.css"
import { Abi } from "viem"
import { arbitrum } from "viem/chains"
import { WagmiConfig, configureChains, createConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

import useCtrlKFocus from "@/hooks/useCtrlKFocus"
import {
	ConnectButton,
	RainbowKitProvider,
	connectorsForWallets,
	darkTheme,
} from "@rainbow-me/rainbowkit"
import { injectedWallet, metaMaskWallet } from "@rainbow-me/rainbowkit/wallets"
import {
	AbiConstructor,
	AbiError,
	AbiEvent,
	AbiFallback,
	AbiFunction,
	AbiReceive,
} from "abitype"
import { useRef, useState } from "react"
import Cell from "./Cell"
import { mode_network } from "./mode_network"

type AbiItem =
	| AbiConstructor
	| AbiError
	| AbiEvent
	| AbiFallback
	| AbiFunction
	| AbiReceive

// const alchelmyKey = process.env?.NEXT_PUBLIC_ALCHEMY_KEY ?? ''

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[arbitrum, mode_network],
	[
		publicProvider(),
		alchemyProvider({ apiKey: "Oie23PxOOG_d1d7uT3FQGE6sgrLu7Dl9" }),
	]
)

const connectors = connectorsForWallets([
	{
		groupName: "Recommended",
		wallets: [
			metaMaskWallet({ projectId: "Executor", chains }),
			injectedWallet({ chains }),
		],
	},
])

const config = createConfig({
	autoConnect: true,
	publicClient,
	connectors,
})

const search = (abi: Array<AbiItem>, searchWordings: string) => {
	if (searchWordings === "") return abi
	return abi.filter(
		(item) =>
			item.type === "function" &&
			item.name.toLowerCase().includes(searchWordings.toLowerCase())
	)
}

export default function Home() {
	const [abi, setAbi] = useState<null | Abi>([])
	const searchRef = useRef<HTMLInputElement>(null)
	useCtrlKFocus(searchRef)
	const [isOpenRead, setIsOpenRead] = useState(true)
	const [isOpenWrite, setIsOpenWrite] = useState(true)
	const [contractAddress, setContractAddress] = useState<`0x${string}`>("0x")
	const [viewFunctions, setViewFunctions] = useState<Array<AbiItem>>([])
	const [writeFunctions, setWriteFunctions] = useState<Array<AbiItem>>([])

	const [searchInput, setSearchInput] = useState("")

	const handleformSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const target = event.currentTarget
		setContractAddress(target.contract.value)

		try {
			const parseData = target.abiURL.value
				? await fetch(target.abiURL.value).then((res) => res.json())
				: JSON.parse(target.abi.value)
			const parsedAbi: Abi = parseData.abi
			setViewFunctions(
				parsedAbi.filter(
					(p) =>
						p.type === "function" &&
						(p.stateMutability === "pure" || p.stateMutability === "view")
				)
			)
			setWriteFunctions(
				parsedAbi.filter(
					(p) =>
						p.type === "function" &&
						(p.stateMutability === "payable" ||
							p.stateMutability === "nonpayable")
				)
			)
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<WagmiConfig config={config}>
			<RainbowKitProvider chains={chains} theme={darkTheme()}>
				<div className="max-w-5xl mx-auto">
					<nav className="flex justify-between py-4">
						<h1 className="text-3xl font-bold italic">Executor</h1>
						<ConnectButton />
					</nav>
					<div className="flex">
						<form
							onSubmit={handleformSubmit}
							className="flex flex-col gap-5 w-1/4"
						>
							<div>
								<label className="block text-sm font-medium leading-6">
									Contract Address
								</label>
								<div className="mt-2">
									<input
										type="text"
										name="contract"
										id="contract"
										className="bg-transparent block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										placeholder="e.g. 0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
									/>
								</div>
							</div>
							<div>
								<h3 className="block text-sm font-medium leading-6">
									Paste the ABI here
								</h3>
								<textarea
									rows={4}
									name="abi"
									id="abi"
									className="block px-2 w-full rounded-md border-0 py-1.5 bg-transparent shadow-sm ring-1 ring-insetfocus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
									defaultValue={""}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium leading-6">
									OR ABI URL address:
								</label>
								<div className="mt-2">
									<input
										type="text"
										name="abiURL"
										id="abiURL"
										className="bg-transparent block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										placeholder="e.g. https://raw.githubusercontent.com/....abi.json"
									/>
								</div>
							</div>
							<button
								type="submit"
								className="rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
							>
								Load Contract
							</button>
						</form>
						<div className="grow px-4 w-3/4">
							<div>
								<label
									htmlFor="search"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Quick search
								</label>
								<div className="relative mt-2 flex items-center">
									<input
										ref={searchRef}
										onChange={(e) => {
											setSearchInput(e.target.value)
										}}
										type="text"
										name="search"
										id="search"
										placeholder="e.g. balanceOf"
										className="bg-transparent block w-full rounded-md border-0 py-1.5 pr-14 pl-2 text-gray-50 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
									<div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
										<kbd className="inline-flex items-center rounded border border-gray-800 px-1 font-sans text-xs text-gray-400">
											⌘K
										</kbd>
									</div>
								</div>
							</div>
							<div
								className="hover:bg-white/10 transition-colors px-4 py-5 cursor-pointer"
								onClick={() => {
									setIsOpenRead(!isOpenRead)
								}}
							>
								<h3 className="text-lg font-semibold leading-6 text-white">
									Read Functions
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Pure functions and View functions.
								</p>
							</div>

							{isOpenRead && (
								<ul role="list" className="divide-y divide-gray-800">
									{search(viewFunctions, searchInput).map((f) => {
										if (f.type === "function") {
											return (
												<Cell key={f.name} info={f} address={contractAddress} />
											)
										}
									})}
								</ul>
							)}

							<div
								className="hover:bg-white/10 transition-colors px-4 py-5 cursor-pointer"
								onClick={() => {
									setIsOpenWrite(!isOpenWrite)
								}}
							>
								<h3 className="text-lg font-semibold leading-6 text-white">
									Write Functions
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Payable and Nonpayable functions.
								</p>
							</div>
							{isOpenWrite && (
								<ul role="list" className=" divide-y divide-gray-800">
									{search(writeFunctions, searchInput).map((f) => {
										if (f.type === "function") {
											return (
												<Cell key={f.name} info={f} address={contractAddress} />
											)
										}
									})}
								</ul>
							)}
						</div>
					</div>
				</div>
			</RainbowKitProvider>
		</WagmiConfig>
	)
}
