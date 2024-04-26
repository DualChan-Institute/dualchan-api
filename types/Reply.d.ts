/**
 * Defines the Reply type.
 * @interface Reply
 * @param {string} id - The reply id.
 * @param {Board} board - The board the reply belongs to.
 * @param {string} subject - The reply subject.
 * @param {Date} created - The date the reply was created.
 * @param {File} file - The file attached to the reply.
 * @returns {void}
 * @example
 * const reply: Reply = {
 * id: '1',
 * board: board,
 * subject: 'Reply 1',
 * created: new Date(),
 * file: file
 * };
 * console.log(reply);
 * // Output: { id: '1', board: { id: '1', name: 'Board 1', description: 'This is the first board' }, subject: 'Reply 1', created: 2021-08-01T00:00:00.000Z, file: { id: '1', name: 'File 1', type: 'image/png' } }
 */

interface Reply {
  id: string;
  board: Board;
  subject: string;
  created: Date;
  file?: File;
}

export default Reply;
