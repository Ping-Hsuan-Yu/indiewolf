import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Layout from "../layouts/LayoutDefault.js";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  title: "Lin ChaoYu",
  description: "插畫修行。",

  extends: vikeReact,
  redirects:{
    "/manga":"/manga/2023",
    "/illustration":"/illustration/2025"
  }
} satisfies Config;
