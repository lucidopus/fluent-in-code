import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function main() {
  const rl = readline.createInterface({ input, output });
  const password = (await rl.question("Enter password to hash: ")).trim();
  rl.close();

  if (!password) {
    console.error("Empty password — aborting.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  console.log("\nHash (copy into APP_PASSWORD_HASH in .env.local):");
  console.log(hash);
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
