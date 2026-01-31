import path from "node:path"
import fs from "node:fs"

import { AssetType } from "./enums/asset-type.enum"

const extensionMap = {
    [AssetType.Image]: [".png", ".jpg"],
    [AssetType.Audio]: [".mp3", ".ogg"],
    [AssetType.Texture]: [".dds"],
    [AssetType.Mask]: [".mask"],
    [AssetType.Binary]: [".bin"],
}

export class Assets {
    readonly assetsDirPath: string

    constructor(assetsDirPath: string) {
        this.assetsDirPath = assetsDirPath
    }

    async set(currentAssetFileName: string, substituteAssetFilePath: string) {
        const currentAssetFilePath = path.join(this.assetsDirPath, currentAssetFileName)
        await fs.promises.copyFile(substituteAssetFilePath, currentAssetFilePath)
    }

    async delete(assetFileName: string) {
        const assetFilePath = path.join(this.assetsDirPath, assetFileName)
        await fs.promises.unlink(assetFilePath)
    }

    getFilePath(assetFileName: string) {
        const assetFilePath = path.join(this.assetsDirPath, assetFileName)
        return assetFilePath
    }

    async listAssets(assetTypes?: AssetType[]) {
        const fileNames = await fs.promises.readdir(this.assetsDirPath)
        let filePaths = fileNames.map((fileName) => path.join(this.assetsDirPath, fileName))

        if (assetTypes) {
            filePaths = filePaths.filter((filePath) =>
                assetTypes.some((type) => extensionMap[type]?.some((ext) => filePath.endsWith(ext))),
            )
        }

        return filePaths
    }

    async clearAssets() {
        const fileNames = await fs.promises.readdir(this.assetsDirPath)

        for (const fileName of fileNames) {
            const filePath = path.join(this.assetsDirPath, fileName)
            await fs.promises.unlink(filePath)
        }
    }
}
