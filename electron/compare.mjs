import fs from "fs";
import { createHash } from 'crypto';

export async function compareDirectories(dirA, dirB) {
    try {
        console.log("compareDirectories", dirA, dirB);

        if (!fs.existsSync(dirA) || !fs.existsSync(dirB)) {
            throw new Error('Both paths must be directories.');
        }

        // Fixed: await readdir calls
        const filesA = await fs.promises.readdir(dirA, { withFileTypes: true });
        const filesB = await fs.promises.readdir(dirB, { withFileTypes: true });

        // Filter only files for now, ignore directories
        const filesOnlyA = filesA.filter(dirent => !dirent.isDirectory()).map(dirent => dirent.name);
        const filesOnlyB = filesB.filter(dirent => !dirent.isDirectory()).map(dirent => dirent.name);

        const uniqueToA = filesOnlyA.filter(file => !filesOnlyB.includes(file));
        const uniqueToB = filesOnlyB.filter(file => !filesOnlyA.includes(file));

        const commonFiles = filesOnlyA.filter(file => filesOnlyB.includes(file));

        // Fixed: Promise.all with proper async/await
        const differentContent = await Promise.all(
            commonFiles.map(async file => {
                const filePathA = `${dirA}/${file}`;
                const filePathB = `${dirB}/${file}`;
                const hashA = await getMd5Hash(filePathA);
                const hashB = await getMd5Hash(filePathB);
                return hashA !== hashB ? file : null;
            })
        ).then(files => files.filter(Boolean));

        const result = uniqueToA.concat(uniqueToB, differentContent);

        // Now handle subdirectories
        const dirsOnlyA = filesA.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
        const dirsOnlyB = filesB.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

        const commonDirs = dirsOnlyA.filter(dir => dirsOnlyB.includes(dir));

        const subdirResults = await Promise.all(commonDirs.map(async dir => {
            const subDirA = `${dirA}/${dir}`;
            const subDirB = `${dirB}/${dir}`;
            return await compareDirectories(subDirA, subDirB);
        }));

        const subdirFiles = subdirResults.flat();

        return result.concat(subdirFiles);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // Fixed: Remove await from fs.existsSync and use proper async readdir
            if (fs.existsSync(dirA)) {
                const files = await fs.promises.readdir(dirA, { withFileTypes: true });
                return files.map(dirent => dirent.name);
            } else if (fs.existsSync(dirB)) {
                const files = await fs.promises.readdir(dirB, { withFileTypes: true });
                return files.map(dirent => dirent.name);
            } else {
                return [];
            }
        } else {
            throw err;
        }
    }
}

// Fixed: Make getMd5Hash async
async function getMd5Hash(filePath) {
    const buffer = await fs.promises.readFile(filePath);
    return createHash('md5').update(buffer).digest('hex');
}