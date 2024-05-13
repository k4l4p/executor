import { Chain } from 'wagmi'

export const karak = {
  id: 2410,
  name: 'Karak Mainnet',
  network: 'karak',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: {
      http: [
        'https://partner.rpc.karak.network/?key=airpuff-lGpTnlXB56D3Vqc8ekod/',
      ],
    },
    default: {
      http: [
        'https://partner.rpc.karak.network/?key=airpuff-lGpTnlXB56D3Vqc8ekod/',
      ],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Mode explorer',
      url: 'https://explorer.karak.network/',
    },
    default: { name: 'Mode explorer', url: 'https://explorer.karak.network/' },
  },
  contracts: {
    // multicall3: {
    //   address: '0xca11bde05977b3631167028862be2a173976ca11',
    //   blockCreated: 11_907_934,
    // },
  },
} as const satisfies Chain
