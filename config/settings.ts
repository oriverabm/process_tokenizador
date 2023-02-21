import * as dotenv from "dotenv";
dotenv.config();

export const FLAG_LIMIT = +(process.env.MONGODB_FIND_LIMIT as string) || 100;

export const DELAY_MIN = +(process.env.DELAY_MIN as string) || 1000;
export const DELAY_MAX = +(process.env.DELAY_MAX as string) || 2000;

export const TSSH_USER = process.env.TUNEL_SSH_USER as string || "";
export const TSSH_PASSPHRASE = process.env.TUNEL_SSH_PASSPHRASE as string || "";
export const TSSH_HOST = process.env.TUNEL_SSH_HOST as string || "";
export const TSSH_PORT = +(process.env.TUNEL_SSH_PORT as string) || 22;

export const MONGODB_PORT = +(process.env.MONGODB_PORT as string) || 27017;
export const MONGODB_HOST = process.env.MONGODB_HOST as string || "";
export const MONGODB_DB = process.env.MONGODB_DB as string || "";

export const MONGODB_URI = process.env.MONGODB_URI as string || "";
export const TSSH_PUBKEY = process.env.TUNEL_SSH_PUBKEY as string;

export const URL_BASE = process.env.URL_BASE as string;
