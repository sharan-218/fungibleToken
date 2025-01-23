const algosdk = require("algosdk");
const fs = require("fs");
const readline = require("readline");

function keypress() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Press any key after funding your account...", () => {
      rl.close();
      resolve();
    });
  });
}

async function createAccountExport() {
  try {
    const generatedAccount = algosdk.generateAccount();
    const phrase = algosdk.secretKeyToMnemonic(generatedAccount.sk);

    const address = algosdk.generatedAccount.addr;

    console.log(`Address Generated: ${address}`);
    console.log(`Mnemonic Phrase: ${phrase}`);

    // Provide dispenser URL for funding the account
    const dispenserUrl = `https://dispenser.testnet.aws.algodev.network/?account=${address}`;
    console.log(`Fund Your Wallet here: ${dispenserUrl}`);

    // Wait for user to fund the account
    console.log("Please fund your wallet before proceeding.");
    await keypress();

    const privateKeyBase64 = Buffer.from(generatedAccount.sk).toString(
      "base64"
    );

    const accountData = {
      address,
      phrase,
      privateKey: privateKeyBase64,
    };

    fs.writeFileSync("account.json", JSON.stringify(accountData, null, 2));
    console.log("Account Data Saved to account.json");
  } catch (error) {
    console.error("Error creating or saving account:", error.message);
  } finally {
    process.exit();
  }
}

createAccountExport();
