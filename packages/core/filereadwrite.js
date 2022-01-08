import fs from 'fs';

export class FileReadWrite {
    static read(path) {
        return fs.readFileSync(path, 'utf8');
    }

    static async write(path, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, 'utf8', (err) => {
                if (err) reject(err);
                else resolve('');
            });
        });
    }
}