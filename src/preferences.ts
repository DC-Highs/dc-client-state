import { UserDefault } from "./user-default"

type SetFarmRangeOptions = {
    plantId: number
    start: number
    end: number
}

/*
    High level API for preferences
*/
export class Preferences {
    private readonly userDefault: UserDefault

    constructor(userDefault: UserDefault) {
        this.userDefault = userDefault
    }

    async setFarmCropRange({ plantId, start, end }: SetFarmRangeOptions) {
        const entries = await this.userDefault.listByPrefix("retry_grow_type_food")

        let counter = 0

        for (const entry of entries) {
            const key = entry["@_key"]

            if (key.startsWith("retry_grow_type_food")) {
                if (counter >= start && counter < end) {
                    await this.userDefault.set(key, plantId)
                }

                counter++
            }
        }
    }

    async setAllFarmCrops(plantId: number) {
        const entries = await this.userDefault.listByPrefix("retry_grow_type_food")

        for (const entry of entries) {
            await this.userDefault.set(entry["@_key"], plantId)
        }
    }

    async deleteAllFarmCrops() {
        const entries = await this.userDefault.listByPrefix("retry_grow_type_food")

        for (const entry of entries) {
            await this.userDefault.delete(entry["@_key"])
        }
    }

    async getAllFarmCrops() {
        const entries = await this.userDefault.listByPrefix("retry_grow_type_food")
        return entries
    }

    async getDisplayTutorials() {
        const entries = await this.userDefault.listByInclude("tutorial")
        return entries
    }

    async setDisplayTutorials(shown: boolean) {
        const entries = await this.userDefault.listByInclude("tutorial")

        for (const entry of entries) {
            await this.userDefault.set(entry["@_key"], shown)
        }
    }

    async deleteDisplayTutorials() {
        const entries = await this.userDefault.listByInclude("tutorial")

        for (const entry of entries) {
            await this.userDefault.delete(entry["@_key"])
        }
    }

    async disableMusic() {
        await this.userDefault.set("options_music_disabled", true)
    }

    async enableMusic() {
        await this.userDefault.delete("options_music_disabled")
    }

    async disableSound() {
        await this.userDefault.set("options_sound_disabled", true)
    }

    async enableSound() {
        await this.userDefault.delete("options_sound_disabled")
    }

    async getUserId() {
        const userIdString = await this.userDefault.get("user_origin_id")

        if (!userIdString) {
            return undefined
        }

        return Number(userIdString)
    }

    async getLastExecution() {
        const timestampString = await this.userDefault.get("last_execution")

        if (!timestampString) {
            return undefined
        }

        const timestamp = Number(timestampString)

        return new Date(timestamp * 1000)
    }

    async getRetryBreedSanctuaryDragons() {
        const leftAccountDragonId = (await this.userDefault.listByInclude("left_retry_breeed_dragon"))[0]
        const rightAccountDragonId = (await this.userDefault.listByInclude("right_retry_breeed_dragon"))[0]

        if (!leftAccountDragonId || !rightAccountDragonId) {
            return undefined
        }

        return {
            leftAccountDragonId: Number(leftAccountDragonId["#text"]),
            rightAccountDragonId: Number(rightAccountDragonId["#text"]),
        }
    }

    async setRetryBreedSanctuaryDragons(leftAccountDragonId: number, rightAccountDragonId: number) {
        await this.userDefault.set("left_retry_breeed_dragon_444", leftAccountDragonId)
        await this.userDefault.set("right_retry_breeed_dragon_444", rightAccountDragonId)
    }
}
