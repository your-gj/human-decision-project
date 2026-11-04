// Run once: generates the admin keypair; private key is stored encrypted with the admin passcode.
import { webcrypto as c } from "node:crypto"; import fs from "node:fs";
const pass = process.argv[2]; if (!pass) throw new Error("usage: node genkeys.mjs <passcode>");
const b64 = b => Buffer.from(b).toString("base64");
const kp = await c.subtle.generateKey({ name: "RSA-OAEP", modulusLength: 3072, publicExponent: new Uint8Array([1,0,1]), hash: "SHA-256" }, true, ["encrypt","decrypt"]);
const spki = await c.subtle.exportKey("spki", kp.publicKey), pk8 = await c.subtle.exportKey("pkcs8", kp.privateKey);
const salt = c.getRandomValues(new Uint8Array(16)), iv = c.getRandomValues(new Uint8Array(12)), iter = 600000;
const base = await c.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
const k = await c.subtle.deriveKey({ name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const ct = await c.subtle.encrypt({ name: "AES-GCM", iv }, k, pk8);
fs.writeFileSync(new URL("./admin-keys.json", import.meta.url), JSON.stringify({ pub: b64(spki), vault: { salt: b64(salt), iv: b64(iv), iter, ct: b64(ct) } }, null, 1));
console.log("ok");
