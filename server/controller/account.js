// import dependencies
import jwt from 'jsonwebtoken';

// import files
import model from '../model/account';
import middleware from '../middleware/account';

// account controller
class account {
  // account creation controller handle
  static createUserAccount(req, res){
    // middleware to verify input fields
    middleware.verifyAccountCreation(req, (error) => {
      // check for error
      if (error) {
        return res.status(400).json({ status:400, error:error.details[0].context.label });
      }

      // get body
      const { type, owner } = req.body;

      // verify type
      if (type !== 'savings' && type !== 'current') {
        return res.status(400).json({ status:400, error:error.details[0].context.label });
      }

      const date = new Date;
      const day = date.getDate();
      const arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = arr[date.getMonth()];      
      const year = date.getFullYear();
      let hour = date.getHours();
      if(hour.length < 2){
        hour = '0'+ hour;
      }
      let minute = date.getMinutes();
      if(minute.length < 2){
        minute = '0'+ minute;
      }
      const accountNumber = Math.floor(Math.random()*8999999999+1000000000);
      const createdOn = day+' '+month+' '+year+' '+hour+':'+minute;
      const status = 'active';
      const value = 0;
      const balance = parseFloat(value);
      
      model.createUserAccount(type, owner, createdOn, status, balance, accountNumber,({ success, data }) => {
        if (!success) {
          // account already exists
          return res.status(500).json({ status: 500, error: data.message });
        }

        if (success && data.message) {
          // account number exists
          return res.status(409).json({ status: 409, error: data.message });
        }
        // return the user data
        return res.status(200).json({ status: 200, data: data });
      });
      return null;
    });
    return null;
  }
}
// export controller
export default account;
