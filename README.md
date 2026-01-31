# @dchighs/dc-client-state

> ⚠️ **Disclaimer**: This library is **NOT** intended for hacking or cheating. The author is radically against hacking. This library only modifies local preferences and asset states; it does **not** provide any in-game advantage or modify server-side data.

**@dchighs/dc-client-state** is a library for accessing and managing the local client state of Dragon City (Windows version). It allows reading and modifying the `UserDefault.xml` (preferences) and accessing local cached assets.

[Leia a documentação em Português aqui](./README.pt.md)

## 📦 Installation

Installation is straightforward—simply use your preferred package manager. Here is an example using NPM:

```cmd
npm i @dchighs/dc-client-state
```

## 🚀 Usage

To start interacting with the Dragon City client state, you can instantiate the `ClientState` class. It automatically attempts to locate the Dragon City installation directory on your Windows machine.

### Initializing Client State

```ts
import { ClientState } from "@dchighs/dc-client-state"

const client = new ClientState()
console.log(`Game directory found at: ${client.dragonCityDirPath}`)
```

## 🏗 High-Level vs Low-Level Access

This library provides two ways to interact with the game's stored data: **UserDefault** (Low-Level) and **Preferences** (High-Level).

### 1. UserDefault (Low-Level)
`UserDefault` provides direct access to the `UserDefault.xml` file. It operates on raw key-value pairs exactly as they are stored by the game. You should use this if you know the specific internal keys you want to read or modify.

*   **Pros**: Full control over every entry in the XML file.
*   **Cons**: Requires knowledge of internal key names (e.g., "options_music_disabled").

**Example:**
```ts
// Get a raw value by its key
const musicDisabled = await client.userDefault.get("options_music_disabled")

// Set a raw value manually
await client.userDefault.set("options_music_disabled", true)
```

### 2. Preferences (High-Level)
`Preferences` is a wrapper around `UserDefault` that provides semantic, type-safe methods for common tasks. It abstracts away the obscure key names into readable function calls.

*   **Pros**: Easier to use, readable code, type validation.
*   **Cons**: Limited to the specific features implemented in the class.

**Example:**
```ts
// Disable music using a named method
await client.preferences.disableMusic()

// Get the User ID
const userId = await client.preferences.getUserId()


// Set all farms to grow a specific crop
await client.preferences.setAllFarmCrops(1)
```

## 🎨 Assets Management

The `Assets` class allows you to manage the files cached locally by the game. This can be useful for replacing textures, music, or other assets with custom ones (locally). It is accessible via `client.assets`.

### Listing Assets

You can list all assets currently in the cache, optionally filtering by type.

```ts
import { AssetType } from "@dchighs/dc-client-state"

// List all assets
const allAssets = await client.assets.listAssets()
console.log(`Found ${allAssets.length} assets`)

// List only image assets (png, jpg)
const images = await client.assets.listAssets([AssetType.Image])
console.log("Images found:", images)
```

### Replacing an Asset

To replace an asset, you need its current file name in the cache and the path to your replacement file.

```ts
const assetName = "ui_button_close.png" // Example asset name
const myReplacementFile = "./my-custom-assets/new-close-button.png"

await client.assets.set(assetName, myReplacementFile)
```

### Getting Asset Path

If you need the full absolute path of a cached asset:

```ts
const fullPath = client.assets.getFilePath("some_sound.mp3")
```

### Cleaning Up

You can delete a specific asset or clear the entire cache.

```ts
// Delete a specific asset
await client.assets.delete("old_banner.png")

// ⚠️ WARNING: This deletes ALL files in the local cache folder!
// The game will redownload necessary assets on next launch.
await client.assets.clearAssets()
```

## 🤝 Contributing

* Want to contribute? Follow these steps:
* Fork the repository.
* Create a new branch (`git checkout -b feature-new`).
* Commit your changes (`git commit -m 'Add new feature'`).
* Push to the branch (`git push origin feature-new`).
* Open a Pull Request.

## 📝 License

This project is licensed under the MIT License.