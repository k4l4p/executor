import { Chain } from "wagmi"

export const mode_network = {
	id: 34443,
	name: "Mode Mainnet",
	network: "mode",
	nativeCurrency: {
		decimals: 18,
		name: "ETH",
		symbol: "ETH",
	},
	rpcUrls: {
		public: { http: ["https://mainnet.mode.network/"] },
		default: { http: ["https://mainnet.mode.network/"] },
	},
	blockExplorers: {
		etherscan: { name: "Mode explorer", url: "https://explorer.mode.network/" },
		default: { name: "Mode explorer", url: "https://explorer.mode.network/" },
	},
	contracts: {
		// multicall3: {
		//   address: '0xca11bde05977b3631167028862be2a173976ca11',
		//   blockCreated: 11_907_934,
		// },
	},
} as const satisfies Chain
