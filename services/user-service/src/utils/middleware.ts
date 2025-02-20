import jwt from "jsonwebtoken";
import logger from "./logger";

const authenticateToken = (req: any, res: any, next: any) => {
   try {
        const token = req.headers['authorization'];
        const actualToken = token && token.split(' ')[1];
        if (actualToken == null) return res.status(401).json({ success: false, message: 'Unauthorized', data: null });
        jwt.verify(actualToken, process.env.JWT_SECRET as string, (err: any, user: any) => {
            if (err) return res.status(403).json({ success: false, message: 'Forbidden', data: null });
            req.user = user;
            next();
        });
   } catch (error) {
        logger(`\nError in authenticateToken  in middleware.ts : ${error}`);
       return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
   }
};

const authenticateAdmin = (req: any, res: any, next: any) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden', data: null });
        next();
    } catch (error) {
        logger(`\nError in authenticateAdmin  in middleware.ts : ${error}`);
        return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
    }
};



export { authenticateToken, authenticateAdmin };