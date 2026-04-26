import { createWhopClient, loadLocalEnv } from "../lib/whop-client.mjs";

loadLocalEnv();

const checkPath = process.env.WHOP_CHECK_PATH || "/api/v5/me";
const whop = createWhopClient();

try {
  const account = await whop.fetch(checkPath);

  console.log("Connected to Whop.");
  console.log(JSON.stringify(account, null, 2));
} catch (error) {
  console.error(error.message);
  console.error("");
  console.error("If you used a company API key, /api/v5/me may not be the right check endpoint.");
  console.error("Set WHOP_CHECK_PATH in .env to an endpoint your key can access.");
  process.exitCode = 1;
}
