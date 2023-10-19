import fs from 'node:fs/promises';

const CONFIG_PATH = new URL('../config.json', import.meta.url).pathname;

export const getConfig = async () => {
    const conf = await (fs.readFile(CONFIG_PATH, 'utf-8'));
    return JSON.parse(conf);
}

export const saveConfig = async (conf) => {
    await fs.writeFile(CONFIG_PATH, JSON.stringify(conf, null, 2));
    return conf;
}

export const shouldEncodeWhitespace = async () => {
    const { encodeWhitespace } = await getConfig();

    if (encodeWhitespace === undefined)
        return true;

    return encodeWhitespace;
}

export const shouldSaveToClipboard = async () => {
    const { saveToClipboard } = await getConfig();

    if (saveToClipboard === undefined)
        return true;

    return saveToClipboard;
}