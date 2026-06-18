import { ethers } from "ethers";

const wallet = ethers.Wallet.createRandom();

console.log("\n=== WALLET SYSCOIN TESTNET (Tanenbaum) ===");
console.log("Dirección:   ", wallet.address);
console.log("Private Key: ", wallet.privateKey);
console.log("Mnemonic:    ", wallet.mnemonic?.phrase);
console.log("\n=== PASOS SIGUIENTES ===");
console.log("1. Guarda estos datos en un lugar seguro");
console.log("2. Agrega al .env.local:");
console.log(`   SYSCOIN_PRIVATE_KEY=${wallet.privateKey}`);
console.log(`   SYSCOIN_ADDRESS=${wallet.address}`);
console.log("3. Ve al faucet y carga SYS testnet gratis:");
console.log("   https://faucet.tanenbaum.io");
console.log("   Pega tu dirección:", wallet.address);
console.log("==========================================\n");
