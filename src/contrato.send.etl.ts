import { instanceMongoSSH } from '../database/mongodb';
import fetch from 'node-fetch';
import { URL_BASE } from '../config/settings';

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

  try {
    const collectionContracts = db.collection('contracts');
    const collectionSensbox = db.collection('sendbox');

    const contracts = await collectionContracts
      .find({ status: { $exists: false }})
      .toArray();
    const process = sliceIntoChunks(contracts, 1);

    console.log('collectionContracts', contracts.length);
    console.log('process', process.length);

    console.log('############### START EXCUTE ##################\n');
    let loops = 0;
    for (let lote of process) {
      loops++;
      console.log(`\n################ process: ${loops} #################\n`);

      let idsContacts = lote.map((x) => x.contratoId);
      let payload = { constratos: idsContacts };

      const response = await fetch(`${URL_BASE}/api/tokenizeVivolifeCards2`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      }).then((res) => {
        let result;
        if (res.ok) result = res.json();
        else {
          result = res.status;
          console.log("respose no ok:",result);
        }
        return result;
      });

      await collectionSensbox.insertOne({
        request: payload,
        response: response,
      });

      console.log('request:process:contrart:', payload);
      console.log('response:process:contrart:', response);

      for (let contract of lote) {

        //await sleep(1000);
        //console.log('update:process:contrart:', contract.contratoId);
        await collectionContracts.updateOne(
          { _id: contract._id },
          { $set: { status: 'send' } }
        );
        //console.log('out:process:contrart:', contract.contratoId);
       
      }

      let time = 3000;
      console.log(`please wait ${time/1000} seconds ......`);
      await sleep(time);
    }

    console.log('############### END EXCUTE ##################\n');
  } catch (error) {
    console.log('error', error);
  } finally {
    console.log('closing');
    await client.close();
  }
})();
