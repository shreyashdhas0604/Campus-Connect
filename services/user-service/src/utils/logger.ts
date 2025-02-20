import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, '../logs.txt');

const logger = (message: string) => {
  fs.appendFile(logDir, message, (err) => {
    if (err) {
      console.error("Error while Logging in logger.ts ",err);
    }
  });
};

export default logger;