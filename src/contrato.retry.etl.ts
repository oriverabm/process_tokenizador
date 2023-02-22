import { instanceMongoSSH } from '../database/mongodb';
import * as MySQLConnector from '../database/mysql';

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
                   WHERE vcm.card_migrations.status NOT LIKE '%Successful Tokenization%';`;

    const contractsRetry:any[] = await MySQLConnector.execute(query, []);

    console.log('contractsRetry', contractsRetry.length);

    console.log('############### START EXCUTE ##################\n');
    
    for (let contract of contractsRetry) {
      console.log(contract);
      await collectionContracts.updateOne(
        { contratoId: contract.contrato_id },
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
