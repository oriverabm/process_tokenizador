
import { instanceMongoSSH } from '../database/mongodb';

(async () => {
  const { db, client } = await instanceMongoSSH();

  try {

    const collectionContracts = db.collection('contracts');
    const resultContracts = await collectionContracts.deleteMany({});

    const collectionSensbox = db.collection('sendbox');
    const resultSendBox = await collectionSensbox.deleteMany({});

    console.log('etl:clear:db', [
      { contracts: resultContracts },
      { sendbox: resultSendBox },
    ]);

  } catch (error) {
    console.log('error',error);
  } finally {
    console.log('closing');
    await client.close();
  }
})();
