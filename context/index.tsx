'use client'

import { wagmiAdapter, projectId } from '@/config'
import { createAppKit } from '@reown/appkit/react'
import { scroll, scrollSepolia, sepolia } from '@reown/appkit/networks'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
    throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = { //this is optional
    name: "appkit-example-scroll",
    description: "AppKit Example - scroll",
    url: "https://scroll-app.com", // origin must match your domain & subdomain
    icons: ["https://avatars.githubusercontent.com/u/179229932"]
}

// Create the modal
const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [scroll, scrollSepolia, sepolia],
    metadata: metadata,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
    },
    themeMode: 'light'
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}

export default ContextProvider