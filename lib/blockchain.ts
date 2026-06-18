import crypto from "crypto";
import { ethers } from "ethers";

export function sha256(content: string): string {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

export async function stampOnSyscoin(
  hash: string
): Promise<{ txHash: string; blockNumber: number } | { error: string }> {
  const privateKey = process.env.SYSCOIN_PRIVATE_KEY;
  if (!privateKey) return { error: "SYSCOIN_PRIVATE_KEY no configurada" };

  try {
    const provider = new ethers.JsonRpcProvider("https://rpc.syscoin.org");
    const wallet = new ethers.Wallet(privateKey, provider);

    const data = ethers.hexlify(ethers.toUtf8Bytes(`govwatch:sha256:${hash}`));

    const tx = await wallet.sendTransaction({
      to: wallet.address,
      value: BigInt(0),
      data,
    });

    console.log("[Blockchain] Tx enviada:", tx.hash);
    // Retornamos inmediatamente con el hash — no esperamos confirmación
    // El explorador mostrará "Pending" hasta que se mine
    return { txHash: tx.hash, blockNumber: 0 };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Blockchain] Error:", msg);
    return { error: msg };
  }
}

export const SYSCOIN_EXPLORER = "https://explorer.syscoin.org/tx";
