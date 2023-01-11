// Core React
import Layout from "@components/layout/Layout/Layout"
import Nfts from "@components/partials/Nfts"
import React from "react"

// Render
const NftsPage = () => (
  <Layout
    title="Available NFTs - MasterBrews NFT 2.0"
    contentClassName="homePageContent px-0 max-w-full"
  >
    <Nfts />
  </Layout>
)
export default NftsPage
