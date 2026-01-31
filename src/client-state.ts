import path from "node:path"
import fs from "node:fs"

import { UserDefault } from "./user-default"
import { Assets } from "./assets"

export const deafaultPackagesDir = process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, "Packages")
    : undefined

export class ClientStateError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "ClientStateError"
    }
}

export type ClientStateOptions = {
    packagesDirPath?: string
    dragonCityDirName?: string
}

export class ClientState {
    readonly packagesDirPath: string
    readonly dragonCityDirName: string
    readonly dragonCityDirPath: string
    private readonly userDefaultFilePath: string
    readonly assetsDirPath: string

    readonly userDefault: UserDefault
    readonly assets: Assets

    constructor({ dragonCityDirName, packagesDirPath }: ClientStateOptions = {}) {
        const finalPackagesDirPath = ClientState.ensurePackagesDirPath(packagesDirPath)
        this.packagesDirPath = finalPackagesDirPath
        this.dragonCityDirName = dragonCityDirName || ClientState.findDragonCityDirName(finalPackagesDirPath)
        this.dragonCityDirPath = path.join(finalPackagesDirPath, this.dragonCityDirName)
        this.assetsDirPath = path.join(this.dragonCityDirPath, "LocalCache", "Local", "Social Point", "DragonCity")
        this.userDefaultFilePath = path.join(
            this.dragonCityDirPath,
            "LocalCache",
            "Local",
            "DragonCity",
            "UserDefault.xml",
        )
        this.userDefault = new UserDefault(this.userDefaultFilePath)
        this.assets = new Assets(this.assetsDirPath)
    }

    private static ensurePackagesDirPath(packagesDirPath?: string) {
        const finalPackagesDirPath = packagesDirPath || deafaultPackagesDir

        if (!finalPackagesDirPath) {
            throw new ClientStateError("Unable to find packages directory")
        }

        return finalPackagesDirPath
    }

    static findDragonCityDirName(packagesDirPath?: string) {
        const prefix = "SocialPoint.DragonCityMobile_"
        const finalPackagesDirPath = ClientState.ensurePackagesDirPath(packagesDirPath)

        const dirNames = fs.readdirSync(finalPackagesDirPath)

        const dragonCityDirName = dirNames.find((dirName) => dirName.startsWith(prefix))

        if (!dragonCityDirName) {
            throw new ClientStateError("Unable to find Dragon City directory")
        }

        return dragonCityDirName
    }
}
