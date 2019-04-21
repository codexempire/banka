// import dependencies
import jwt from 'jsonwebtoken';

// create authentication class
class authentication{
  // create user authentication
  static isUser(req, res, next) {
    // get the token from the header
    const token = req.headers['x-access-token'];

    // check if there is a token
    if (!token) {
      return res.status(401).json({ status: 401, error: 'Unauthorized Access' });
    }

    // check if token is valid token
    jwt.verify(token, process.env.TOKEN_KEY, (err, _) => {
      if (err) {
        return res.status(401).json({ status: 401, error: 'Token expired' });
      }

      // token is valid
      next();
      return null;
    });
    return null;
  }

  // check if the user is a staff
  static isStaff( req, res, next){
    // get the token from the header
    const token = req.headers['x-access-token'];

    // check if there is a token
    if (!token) {
      return res.status(401).json({ status: 401, error: 'Unauthorized Access' });
    }

    // check if token is valid token
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 401, error: 'Token expired' });
      }

      // token is valid
      if(decoded.data.type === 'staff' || decoded.data.isadmin){
        next();
        return null;
      }
      
      return res.status(401).json({ status: 401, error: 'Restricted Access' });
    });
    return null;
  }

  // check if user is admin
  static isAdmin(req, res, next) {
    // get the token from the header
    const token = req.headers['x-access-token'];

    // check if there is a token
    if (!token) {
      return res.status(401).json({ status: 401, error: 'Unauthorized Access' });
    }

    // check if token is valid token
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 401, error: 'Token expired' });
      }

      // token is valid
      if (decoded.data.isadmin) {
        next();
        return null;
      }

      return res.status(401).json({ status: 401, error: 'Restricted Access' });
    });
    return null;
  }
}

// export authentication class
export default authentication;
