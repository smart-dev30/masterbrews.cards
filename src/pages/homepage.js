// Core React
import NewLayout from "@components/layout/Layout/NewLayout"
import NewHomepage from "@partials/NewHomepage"
import React from "react"

// Render
const WhelpsHomePage = () => (
  <NewLayout
    title="Sale is Live! - MasterBrews NFT 2.0"
    contentClassName="homePageContent px-0 max-w-full bg-secondary-whelps"
  >
    <NewHomepage />
  </NewLayout>
)
export default WhelpsHomePage
