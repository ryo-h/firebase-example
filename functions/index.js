/**
     * Generic background Cloud Function to be triggered by Cloud Storage.
     *
     * @param {object} data The event payload.
     * @param {object} context The event metadata.
     */
exports.helloGCSGeneric = (data, context) => {
  const file = data;
  console.log(`  Event ${context.eventId}`);
  console.log(`  Event Type: ${context.eventType}`);
  console.log(`  Bucket: ${file.bucket}`);
  console.log(`  File: ${file.name}`);
  console.log(`  Metageneration: ${file.metageneration}`);
  console.log(`  Created: ${file.timeCreated}`);
  console.log(`  Updated: ${file.updated}`);
};