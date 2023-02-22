
import { instanceMongoSSH } from '../database/mongodb';

import contrats from '../Esaud.json'

(async () => {
  const { db, client } = await instanceMongoSSH();

  try {

    const collectionContracts = db.collection('contracts');

    const result =  await collectionContracts.insertMany(contrats);

    console.log('etl:contrats', contrats.length);

    console.log('mongo:db:out', {
      insertedCount: result.insertedCount,
      acknowledged: result.acknowledged,
    });

  } catch (error) {
    console.log('error',error);
  } finally {
    console.log('closing');
    await client.close();
  }
})();
