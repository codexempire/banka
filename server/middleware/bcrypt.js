import bcrypt from 'bcrypt';

class Bcrypt {
 static hashPassword(password, completion) {
  bcrypt.hash(password, 10, (_, result) => {
   completion(result);
   return;
  });
  return;
 }
 static comparePassword(password, body, completion) {
  bcrypt.compare(password, body.password, (_, result) => {
   completion(result);
   return;
  });
  return;
 }
}
export default Bcrypt;
