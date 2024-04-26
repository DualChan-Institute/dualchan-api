// create a scheduler that goes through all relations checks if key and value still exist and deletes the relation if not

import {deleteRelations, getRelations} from './RelationService';
import {db} from './Service';

async function garbageCollector() {
  // give board, comment and thread collection a Snapshot Listener
  db.collection('boards').onSnapshot(async (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'removed') {
        await deleteRelations(await getRelations('boards', change.doc.id));
      }
    });
  });

  db.collection('comments').onSnapshot(async (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'removed') {
        await deleteRelations(await getRelations('comments', change.doc.id));
      }
    });
  });

  db.collection('threads').onSnapshot(async (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'removed') {
        await deleteRelations(await getRelations('threads', change.doc.id));
      }
    });
  });
}

export {garbageCollector};
