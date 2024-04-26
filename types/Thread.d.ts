/**
 * Defines the Thread type.
 * @interface Thread
 * @param {string} id - The thread id.
 * @param {Board} board - The board the thread belongs to.
 * @param {string} subject - The thread subject.
 * @param {Date} created - The date the thread was created.
 * @param {File} file - The file attached to the thread.
 * @returns {void}
 * @example
 * const thread: Thread = {
 * id: '1',
 * board: board,
 * subject: 'Thread 1',
 * created: new Date(),
 * file: file
 * };
 * console.log(thread);
 * // Output: { id: '1', board: { id: '1', name: 'Board 1', description: 'This is the first board' }, subject: 'Thread 1', created: 2021-08-01T00:00:00.000Z, file: { id: '1', name: 'File 1', type: 'image/png' } }
 */

interface Thread {
  id: string;
  board: Board;
  subject: string;
  created: Date;
  file?: File;
}

export default Thread;
