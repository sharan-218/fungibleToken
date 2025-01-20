const algosdk = require("algosdk");
const fs = require("fs");

function keypress() {
  return new Promise((resolve) => {
    process.stdin.once("data", () => resolve());
  });
}

async function createAccountExport() {
  const generatedAccount = algosdk.generateAccount();
  const phrase = algosdk.secretKeyToMnemonic(generatedAccount.sk);

  console.log(`Address Generated: ${generatedAccount.addr}`);
  console.log(`Mnemonic Phrase: ${phrase}`);
  const dispenserUrl = `https://dispenser.testnet.aws.algodev.network/?account=${generatedAccount.addr}`;

  console.log(`Fund Your Wallet here: ${dispenserUrl}`);
  console.log("Press any key after funding...");
  await keypress();

  const privateKeyBase64 = Buffer.from(generatedAccount.sk).toString("base64");

  const address = generatedAccount.addr;

  const accountData = {
    address,
    phrase,
    privateKey: privateKeyBase64,
  };

  fs.writeFileSync("account.json", JSON.stringify(accountData, null, 2));
  console.log("Account Data Saved to account.json");

  process.exit();
}

createAccountExport();
