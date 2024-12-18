import { handle } from "@hono/node-server/vercel"
// @ts-expect-error - we need to import the app from the dist folder
import app from "../dist/index.js"

export default handle(app)