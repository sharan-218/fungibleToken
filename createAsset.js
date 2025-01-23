const algosdk = require("algosdk");
require("dotenv").config();

const token = "";
const server = "https://testnet-api.algonode.cloud";
const port = 443;
const client = new algosdk.Algodv2(token, server, port);
console.log(process.env.ADDRESS);
async function deploy() {
  try {
    const address = process.env.ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;

    if (!algosdk.isValidAddress(address)) {
      throw new Error("Invalid Algorand Address in environment variables");
    }

    const privateKeyUint8 = Uint8Array.from(Buffer.from(privateKey, "base64"));

    const suggestedParams = await client.getTransactionParams().do();
    console.log("Creating Token Metadata...");

    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: address,
      suggestedParams,
      defaultFrozen: false,
      unitName: "Sharan",
      assetName: "SK",
      manager: address,
      reserve: address,
      freeze: address,
      clawback: address,
      total: 1000000,
      decimals: 0,
    });

    console.log("Transaction created successfully.");

    const signedTxn = txn.signTxn(privateKeyUint8);
    console.log("Transaction signed.");

    const { txId } = await client.sendRawTransaction(signedTxn).do();
    console.log(`Transaction sent. Transaction ID: ${txId}`);

    const confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4);
    console.log("Transaction confirmed.");

    const assetIndex = confirmedTxn["asset-index"];
    console.log(`Your Token has been deployed!`);
    console.log(`Asset ID: ${assetIndex}`);

    const assetUrl = `https://testnet.explorer.perawallet.app/asset/${assetIndex}`;
    console.log(`Asset URL: ${assetUrl}`);
  } catch (error) {
    console.error("Error deploying token:", error.message);
  }
}

deploy();
