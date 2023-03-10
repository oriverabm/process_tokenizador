
import { instanceMongoSSH } from '../database/mongodb';

(async () => {
  const { db, client } = await instanceMongoSSH();

  try {

    const collectionContracts = db.collection('contracts');
    const result = await collectionContracts.deleteMany({});

    console.log('etl:clear:db', result);

  } catch (error) {
    console.log('error',error);
  } finally {
    console.log('closing');
    await client.close();
  }
})();
