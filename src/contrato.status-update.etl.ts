import { URL_BASE } from '../config/settings';
import { instanceMongoSSH } from '../database/mongodb';
import * as MySQLConnector from '../database/mysql';
import fetch from 'node-fetch';

(async () => {
  const { db, client } = await instanceMongoSSH();

  const sliceIntoChunks = (arr: any, chunkSize: any) => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  MySQLConnector.init();

  try {
    const collectionContracts = db.collection('contracts');

    const query = `SELECT contrato_id,status 
                   FROM vcm.card_migrations
                   WHERE 1 = 1
                   AND vcm.card_migrations.status LIKE '%Card type not found%';`;

    const contractsTokenizados:any[] = await MySQLConnector.execute(query, []);
    const sendContracts = await collectionContracts.find({ status: 'send' }).toArray();

    let tokenizados = contractsTokenizados.map((x) => x.contrato_id);
    //let sends = sendContracts.map((y) => y.contratoId);

    //let payload = {
    //  contracts_pool: sends,
    //  tokenized_contracts: tokenizados,
    //};

    // const response = await fetch(`${URL_BASE}/api/get-contracts-not-tokenized`,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     method: 'POST',
    //     body: JSON.stringify(payload),
    //   }
    // ).then((res) => {
    //   let result;
    //   if (res.ok) result = res.text();
    //   else {
    //     result = res.status;
    //     console.log('respose no ok:', result);
    //   }
    //   return result;
    // });

    let contractsRetry = tokenizados;

    console.log('contractsRetry', contractsRetry.length);

    console.log('############### START EXCUTE ##################\n');
    
    for (let contract of contractsRetry) {
      console.log(contract);
      await collectionContracts.updateOne(
        { contratoId: Number(contract) },
        { $set: { status: 'active' } }
      );
    }

    console.log('############### END EXCUTE ##################\n');
  } catch (error) {
    console.log('error', error);
  } finally {
    console.log('closing');
    await client.close();
  }
})();
