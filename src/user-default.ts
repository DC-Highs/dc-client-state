import { XMLParser, XMLBuilder } from "fast-xml-parser"

import fs from "node:fs"

type UserDefaultEntry = {
    "@_key": string
    "#text": string
}

export class UserDefault {
    readonly filePath: string
    private readonly parser = new XMLParser({ ignoreAttributes: false })
    private readonly builder = new XMLBuilder({
        ignoreAttributes: false,
        format: true,
        indentBy: "    ",
        suppressEmptyNode: true,
    })

    constructor(filePath: string) {
        this.filePath = filePath
    }

    async readRaw() {
        const xml = await fs.promises.readFile(this.filePath, "utf-8")
        return this.parser.parse(xml)
    }

    async writeRaw(data: any) {
        const xml = this.builder.build(data)
        await fs.promises.writeFile(this.filePath, xml)
    }

    normalizeEntries(data: any): UserDefaultEntry[] {
        const entries = data.userDefaultRoot.entry
        return Array.isArray(entries) ? entries : [entries]
    }

    async getNormalizedEntries() {
        const data = await this.readRaw()
        return this.normalizeEntries(data)
    }

    async get(key: string): Promise<string | undefined> {
        const entries = await this.getNormalizedEntries()
        return entries.find((e) => e["@_key"] === key)?.["#text"]
    }

    async set(key: string, value: string | number | boolean | object) {
        const data = await this.readRaw()
        const entries = this.normalizeEntries(data)

        const serialized = typeof value === "string" ? value : JSON.stringify(value)

        const existing = entries.find((e) => e["@_key"] === key)

        if (existing) {
            existing["#text"] = serialized
        } else {
            entries.push({ "@_key": key, "#text": serialized })
        }

        data.userDefaultRoot.entry = entries

        await this.writeRaw(data)
    }

    async delete(key: string) {
        const data = await this.readRaw()
        const entries = this.normalizeEntries(data)

        data.userDefaultRoot.entry = entries.filter((e) => e["@_key"] !== key)
        await this.writeRaw(data)
    }

    async listByPrefix(prefix: string) {
        const data = await this.readRaw()
        const entries = this.normalizeEntries(data)

        return entries.filter((e) => e["@_key"].startsWith(prefix))
    }

    async listByInclude(include: string) {
        const data = await this.readRaw()
        const entries = this.normalizeEntries(data)

        return entries.filter((e) => e["@_key"].includes(include))
    }
}
