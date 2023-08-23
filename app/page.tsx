"use client"
import "@rainbow-me/rainbowkit/styles.css"
import { WagmiConfig, configureChains, createConfig } from "wagmi"
import { Abi, createPublicClient, http } from "viem"
import { arbitrum } from "viem/chains"
import { publicProvider } from "wagmi/providers/public"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

import {
	ConnectButton,
	connectorsForWallets,
	darkTheme,
	getDefaultWallets,
	RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import { useState } from "react"
import {
	injectedWallet,
	metaMaskWallet,
	rainbowWallet,
	walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets"
import {
	AbiConstructor,
	AbiError,
	AbiEvent,
	AbiFallback,
	AbiFunction,
	AbiReceive,
} from "abitype"
import Cell from "./Cell"

type AbiItem =
	| AbiConstructor
	| AbiError
	| AbiEvent
	| AbiFallback
	| AbiFunction
	| AbiReceive

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[arbitrum],
	[
		alchemyProvider({ apiKey: "Oie23PxOOG_d1d7uT3FQGE6sgrLu7Dl9" }),
		publicProvider(),
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

export default function Home() {
	const [abi, setAbi] = useState<null | Abi>([])
	const [contractAddress, setContractAddress] = useState<`0x${string}`>('0x')

	const [viewFunctions, setViewFunctions] = useState<Array<AbiItem>>([])

  const [writeFunctions, setWriteFunctions] = useState<Array<AbiItem>>([])
	const handleformSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const target = event.currentTarget
    setContractAddress(target.contract.value)

		try {
			const parseData = JSON.parse(target.abi.value)
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
						(p.stateMutability === "payable" || p.stateMutability === "nonpayable")
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
							<button
								type="submit"
								className="rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
							>
								Load Contract
							</button>
						</form>
						<div className="grow px-4">
							<div className="px-4 py-5">
								<h3 className="text-lg font-semibold leading-6 text-white">
									Read Functions
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Pure functions and View functions.
								</p>
							</div>

							<ul role="list" className="px-4 divide-y divide-gray-800">
								{viewFunctions.map((f) => {
									if (f.type === "function") {
										return (
											<Cell key={f.name} info={f} address={contractAddress}/>
										)
									}
								})}
							</ul>

              <div className="px-4 py-5">
								<h3 className="text-lg font-semibold leading-6 text-white">
									Write Functions
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Payable functions.
								</p>
							</div>
              <ul role="list" className="px-4 divide-y divide-gray-800">
								{writeFunctions.map((f) => {
									if (f.type === "function") {
										return (
											<Cell key={f.name} info={f} address={contractAddress}/>
										)
									}
								})}
							</ul>

						</div>
					</div>
				</div>
			</RainbowKitProvider>
		</WagmiConfig>
	)
}
