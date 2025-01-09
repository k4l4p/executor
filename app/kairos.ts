import { defineChain } from "viem"

export const kairos = /*#__PURE__*/ defineChain({
	id: 1001,
	name: "Kairos",
	network: "kairos",
	nativeCurrency: { name: "KAIA", symbol: "KAIA", decimals: 18 },
	rpcUrls: {
		default: {
			http: ["https://public-en-kairos.node.kaia.io"],
			webSocket: ["wss://public-en-kairos.node.kaia.io/ws"],
		},
		public: {
			http: ["https://public-en-kairos.node.kaia.io"],
			webSocket: ["wss://public-en-kairos.node.kaia.io/ws"],
		},
	},
	blockExplorers: {
		default: {
			name: "Kaiascope",
			url: "https://kairos.kaiascope.com/",
			// apiUrl: "https://api-baobab.klaytnscope.com/api",
		},
	},
	contracts: {
		multicall3: {
			address: "0x2b8B020c627816058052E9274D8cCE1acf215b2D",
			blockCreated: 4299,
		},
	},
})
