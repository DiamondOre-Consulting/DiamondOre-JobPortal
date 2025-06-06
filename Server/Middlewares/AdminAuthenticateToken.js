import jwt from 'jsonwebtoken';
import {config} from 'dotenv'

config()


const AdminAuthenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
   
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not found' });
    }

   
  
    try {
      // Verify and decode the token
      
      const decoded =  jwt.verify(token, process.env.JWT_SECRET_ADMIN);
      
      // Attach the decoded token to the request object
      req.user = decoded;

    
     
      // Proceed to the next middleware or route handler
      console.log("done")
      next();

    } catch (error) {
      
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Invalid token',error: error });
    }
  };

  export default AdminAuthenticateToken;