import jwt from "jsonwebtoken";
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/'));  
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});


const authenticateToken = async (req: any, res: any, next: any) => {
    try {
        const token = req.headers['authorization'];
        let actualToken = token && token.split(' ')[1];
        actualToken = actualToken || req.cookies.accessToken;
        if (actualToken == null) return res.status(401).json({ success: false, message: 'Unauthorized', data: null });
        const user = jwt.verify(actualToken, process.env.JWT_SECRET as string);
        req.user = user;
        next();
        // jwt.verify(actualToken, process.env.JWT_SECRET as string, (err: any, user: any) => {
        //     if (err) return res.status(403).json({ success: false, message: 'Forbidden', data: null });
        //     req.user = user;
        //     next();
        // });
    } catch (error) {
        console.log(`\nError in authenticateToken  in middleware.ts : ${error}`);
        return res.status(400).json({ success: false, message: 'Invalid Request', data: null });
    }
};

const authenticateAdmin = (req: any, res: any, next: any) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden', data: null });
        next();
    } catch (error) {
        console.log(`\nError in authenticateAdmin  in middleware.ts : ${error}`);
        return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
    }
};



export { authenticateToken, authenticateAdmin };
export const uploadImage = upload.single('profilePic');