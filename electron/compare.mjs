import fs from "fs";
import { createHash } from 'crypto';
import { readdir } from 'fs/promises';

export async function compareDirectories(dirA, dirB) {
    try {
        console.log("compareDirectories", dirA, dirB);

        if (!fs.existsSync(dirA) || !fs.existsSync(dirB)) {
            throw new Error('Both paths must be directories.');
        }

        // Read files in dirA and store in a set
        const filesInA = new Set(await readdir(dirA, {withFileTypes:false, recursive: true }));
        // Read files in dirB and store in a set
        const filesInB = new Set(await readdir(dirB, {withFileTypes:false, recursive: true }));

        // Filter only files for now, ignore directories
        const filesOnlyA = new Set([...filesInA].filter(file => !fs.lstatSync(`${dirA}/${file}`).isDirectory()&&!filesInB.has(file)));
        const filesOnlyB = new Set([...filesInB].filter(file => !fs.lstatSync(`${dirB}/${file}`).isDirectory()&&!filesInA.has(file)));

        const commonFiles = new Set([...filesInA].filter(file => !fs.lstatSync(`${dirA}/${file}`).isDirectory()&&filesInB.has(file)));

        const differentContent = await Promise.all(
            [...commonFiles].map(async file => {
                const filePathA = `${dirA}/${file}`;
                const filePathB = `${dirB}/${file}`;
                const hashA = await getMd5Hash(filePathA);
                const hashB = await getMd5Hash(filePathB);
                return hashA !== hashB ? file : null;
            })
        ).then(files => files.filter(Boolean));

        const result = [...filesOnlyA, ...filesOnlyB, ...differentContent];
        console.log(result);
        return result;
    } catch (err) {
        console.error('compareDirectories', err);
        throw err;
    }
}

// Fixed: Make getMd5Hash async
async function getMd5Hash(filePath) {
    const buffer = await fs.promises.readFile(filePath);
    return createHash('md5').update(buffer).digest('hex');
}



export async function assignDirectoryGroup(files, dirA, dirB) {
    try {
        // Read files in dirA and store in a set
        const filesInA = new Set(await readdir(dirA, { recursive: true }));
        // Read files in dirB and store in a set
        const filesInB = new Set(await readdir(dirB, { recursive: true }));

        // Prepare the result map
        const result = new Map();

        // Handle files only in filesInA
        files.forEach(file => {
            let value = 0;
            if (filesInA.has(file)) {
                value = 1;
            }
            if (filesInB.has(file)) {
                value += 2;
            }
            result.set(file, value);
        });

        // Convert result to array if needed
        const resultArray = Array.from(result);

        return resultArray;
    } catch (err) {
        console.error('Error assigning directory groups:', err);
        throw err;
    }
}
