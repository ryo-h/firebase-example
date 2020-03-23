/**
* Generic background Cloud Function to be triggered by Cloud Storage.
*
* @param {object} data The event payload.
* @param {object} context The event metadata.
*/
const admin = require('firebase-admin');
const fs = require('fs');
const readline = require("readline");

exports.readBucketFile = async (data, context) => {
  const file = data;
  console.log(`  Event ${context.eventId}`);
  console.log(`  Event Type: ${context.eventType}`);
  console.log(`  Bucket: ${file.bucket}`);
  console.log(`  File: ${file.name}`);
  console.log(`  Metageneration: ${file.metageneration}`);
  console.log(`  Created: ${file.timeCreated}`);
  console.log(`  Updated: ${file.updated}`);

  admin.initializeApp();
  console.log('app initialized.');
  const filePath = `/tmp/${file.name}`;
  await admin.storage()
    .bucket(file.bucket)
    .file(file.name)
    .download({
      'destination': filePath
    });
  console.log('file downloaded');
  const stream = fs.createReadStream(filePath, 'utf8');
  const reader = readline.createInterface({ input: stream });
  const fileRecords = [];
  reader.on('line', (data) => {
    fileRecords.push(data);
  });
  console.log(`file read ${fileRecords}`);
  const record = await admin.firestore().collection('example').doc(file.name).get();
  console.log(record);
  const newValue = {
    ...record.data(),
    data: fileRecords
  };
  console.log(newValue);
  admin.firestore().collection('example').doc(file.name).set(newValue);
};