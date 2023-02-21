import {MongoClient, MongoClientOptions} from "mongodb";
import tunnel from "tunnel-ssh";

import * as fs from "fs";
import {
  MONGODB_DB,
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_URI,
  TSSH_HOST,
  TSSH_PASSPHRASE,
  TSSH_PORT,
  TSSH_PUBKEY,
  TSSH_USER,
} from "../config/settings";

export const SetTunel = () => {
  const SSH_PRIVATE_KEY = fs.readFileSync(TSSH_PUBKEY, 'utf8');

  const config = {
    username: TSSH_USER,
    privateKey: SSH_PRIVATE_KEY,
    passphrase: TSSH_PASSPHRASE,
    host: TSSH_HOST,
    port: TSSH_PORT,
    dstPort: MONGODB_PORT,
    dstHost: MONGODB_HOST,
  } as tunnel.Config;
  return tunnel(config, (error: Error, server : any) => {
    if (error) {
      console.log('SSH: connection [ERROR] ', error);
    }
    console.log('SSH: connection [SUCCESS] ');
    return server;
  });
};

export const instanceMongoSSH = async () => {
  const URI = MONGODB_URI;
 
 /*  const server = SetTunel();

  server.on('error', function (err) {
    console.error('ssh error:', err);
  });
 */
  const options = {
    useUnifiedTopology: false,
  } as MongoClientOptions;

  const client = new MongoClient(URI, options);

  client.on('error', function (err) {
    console.error('client error:', err);
  });

  await client.connect();
  console.log("Connected successfully to server");

  console.log("DATABASE: ", MONGODB_DB);
  const db = await client.db(MONGODB_DB);

  return {db, client};
};

export const reconnecting = async (server: any,client: any,db: any) => {
  
  server = SetTunel();
  await client.connect();
  db = await client.db(MONGODB_DB);
  
  return { server, client, db };
};