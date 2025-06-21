import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

export function checkDir(path: string) {
    if (!existsSync(dirname(path))) {
        mkdirSync(dirname(path), {
            recursive: true
        });
    }
}

export function checkFile(path: string) {
    return existsSync(path);
}