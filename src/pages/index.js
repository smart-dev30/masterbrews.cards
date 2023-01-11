// Core React
import Layout from "@components/layout/Layout/Layout"
import HomePage from "@partials/HomePage/HomePage"
import React from "react"

//import { graphql, useStaticQuery } from 'gatsby'
//import { GatsbyImage, getImage } from "gatsby-plugin-image"

// Metadata

// Render
const IndexPage = () => (
  <Layout
    title="Sale is Live! - MasterBrews NFT 2.0"
    contentClassName="homePageContent px-0 max-w-full"
  >
    <HomePage />
  </Layout>
)
export default IndexPage
