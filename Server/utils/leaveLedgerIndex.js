import LeaveLedger from "../Models/LeaveLedger.js";

const TARGET_INDEX_NAME = "transactionKey_1";
const TARGET_PARTIAL_FILTER = { transactionKey: { $type: "string" } };

const isTargetIndex = (index) =>
  Boolean(index) &&
  index.name === TARGET_INDEX_NAME &&
  index.unique === true &&
  JSON.stringify(index.partialFilterExpression || {}) ===
    JSON.stringify(TARGET_PARTIAL_FILTER);

export const ensureLeaveLedgerTransactionKeyIndex = async () => {
  await LeaveLedger.updateMany(
    { transactionKey: { $in: [null, ""] } },
    { $unset: { transactionKey: "" } }
  );

  const indexes = await LeaveLedger.collection.indexes();
  const currentIndex = indexes.find((index) => index.name === TARGET_INDEX_NAME);

  if (currentIndex && !isTargetIndex(currentIndex)) {
    await LeaveLedger.collection.dropIndex(TARGET_INDEX_NAME);
  }

  const refreshedIndexes = await LeaveLedger.collection.indexes();
  const hasTarget = refreshedIndexes.some((index) => isTargetIndex(index));

  if (!hasTarget) {
    await LeaveLedger.collection.createIndex(
      { transactionKey: 1 },
      {
        name: TARGET_INDEX_NAME,
        unique: true,
        partialFilterExpression: TARGET_PARTIAL_FILTER,
      }
    );
  }
};
