/**
 * Defines the Board interface.
 * @interface Board
 * @param {string} id - The board id.
 * @param {string} name - The board name.
 * @param {string} description - The board description (optional).
 * @returns {void}
 * @example
 * const board: Board = {
 *  id: '1',
 * name: 'Board 1',
 * description: 'This is the first board'
 * };
 * console.log(board);
 * // Output: { id: '1', name: 'Board 1', description: 'This is the first board' }
 */
interface Board {
  id: string;
  name: string;
  description?: string;
}

export default Board;
