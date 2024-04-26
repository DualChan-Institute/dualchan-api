// create a Relation Firestore collection for saving a key value pair with the generated ids of two documents

import {db} from './Service';

// function to add a new relation
async function addRelation(
  key_collection: string,
  key_id: string,
  value_collection: string,
  value_id: string,
): Promise<boolean> {
  // add a new relation to the database
  await db.collection('relations').add({
    key_collection,
    key_id,
    value_collection,
    value_id,
  });
  return true;
}

// check if key or value is in any kind of relation and give back a list of relation ids
async function getRelations(collection: string, id: string): Promise<string[]> {
  const snapshot = await db.collection('relations').get();
  const relations: string[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (
      (data.key_collection === collection && data.key_id === id) ||
      (data.value_collection === collection && data.value_id === id)
    ) {
      relations.push(doc.id);
    }
  });
  return relations;
}

// function to delete a relation
async function deleteRelation(id: string): Promise<boolean> {
  const doc = await db.collection('relations').doc(id).get();
  if (doc.exists) {
    // if key is board and value is thread, delete the thread
    if (
      doc.data()?.key_collection === 'boards' &&
      doc.data()?.value_collection === 'threads'
    ) {
      await db.collection('threads').doc(doc.data()?.value_id).delete();

      deleteRelations(await getRelations('threads', doc.data()?.value_id));
    }

    // if key is thread and value is comment, delete the comment
    if (
      doc.data()?.key_collection === 'threads' &&
      doc.data()?.value_collection === 'comments'
    ) {
      await db.collection('comments').doc(doc.data()?.value_id).delete();
    }

    await db.collection('relations').doc(id).delete();
    return true;
  }
  return false;
}

// function to delete a list of relations
async function deleteRelations(ids: string[]): Promise<boolean> {
  for (const id of ids) {
    await deleteRelation(id);
  }
  return true;
}

export {addRelation, getRelations, deleteRelation, deleteRelations};
