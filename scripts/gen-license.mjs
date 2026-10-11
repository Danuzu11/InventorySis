#!/usr/bin/env node
import { randomBytes } from "node:crypto";

const part = () => randomBytes(3).toString("hex").toUpperCase().slice(0, 4);
const key = `INV-${part()}-${part()}`;
console.log(key);
console.log("\nAgregá esta clave a LICENSE_KEYS en tu .env (separada por coma).");
