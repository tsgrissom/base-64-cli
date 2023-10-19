import fs from 'node:fs/promises'
const HISTORY_PATH = new URL('../history.json', import.meta.url).pathname

export const getHistory = async () => {
    const h = await fs.readFile(HISTORY_PATH, 'utf-8')
    return JSON.parse(h)
}

export const saveHistory = async history => {
    await fs.writeFile(HISTORY_PATH, JSON.stringify(history, null, 2))
    return history
}

export const insertHistory = async entry => {
    const h = await getHistory()
    h.history.push(entry)
    await saveHistory(h)
    return entry
}