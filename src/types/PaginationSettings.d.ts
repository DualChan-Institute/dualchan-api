/**
 * Defines the pagination settings for a paginated list.
 * @interface PaginationSettings
 * @param {number} page - The page number.
 * @param {number} pageSize - The number of items per page.
 * @returns {void}
 * @example
 * const paginationSettings: PaginationSettings = {
 * page: 1,
 * pageSize: 10
 * };
 * console.log(paginationSettings);
 * // Output: { page: 1, pageSize: 10 }
 */
interface PaginationSettings {
  page: number;
  pageSize: number;
}

export default PaginationSettings;
