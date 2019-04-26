import pool from './db';
const Query = (sql, callback) => {
 pool
  .query(sql)
  .then(res => callback({ success: true, data: res.rows }))
  .catch(err => callback({ success: false, data: err }));
 return;
}
export default Query;
