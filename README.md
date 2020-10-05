# .pref

> Perfect for CLI application user preferences

Out of the box 📦⤵️ easy application encrypted preferences 👍

[![npm version](https://img.shields.io/npm/v/dotpref?style=flat-square)](https://www.npmjs.com/package/dotpref)
[![npm license](https://img.shields.io/npm/l/dotpref?style=flat-square)](https://github.com/cassels/dotpref)
[![npm downloads](https://img.shields.io/npm/dt/dotpref?style=flat-square)](https://www.npmjs.com/package/dotpref)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/cassels/dotpref?style=flat-square)
[![dependencies Status](https://david-dm.org/cassels/dotpref/status.svg?style=flat-square)](https://david-dm.org/cassels/dotpref)
[![devDependencies Status](https://david-dm.org/cassels/dotpref/dev-status.svg?style=flat-square)](https://david-dm.org/cassels/dotpref?type=dev)

---

## Highlights

- No configuration needed ❌⚙️
- Everything is configurable ✅⚙️
- Human-readable 🤓 or encrypted 🔐
<!---
- Easy migration paths 🌱🦌
- Watch for events 👀 including external changes 🔭
  -->

## Install

### `npm`

```
$ npm install --save dotpref
```

### `yarn`

```
$ yarn add dotpref
```

## Usage

### Quick start

Out of the box simple key/value store.

```js
import Pref from 'dotpref';

Pref.set('foo', 'bar');
console.log(Pref.get('foo'));
//=> 'bar'

Pref.set('foo', { bar: 'baz' });
console.log(Pref.get('foo'));
//=> '{ bar: "baz" } '
```

### API

#### `Pref`

The default export of the `dotpref` module is a singleton [instance](#Instance) with a default configuration.

```js
import Pref from 'dotpref';
```

#### `createPref`

Creates a custom [instance](#Instance) of dotpref with custom configuration. This method can be used if you need multiple configurations.

```js
import { createPref } from 'dotpref';
```

#### Instance

##### `.get`

Type: `(key: string) => string`

Get the value assigned to `key` in the state.

##### `.set`

Type: `(key: string, value: string) => void`

Set the `value` of `key` in the state. The value must serializable by the instance's [`serializer`](#serializer). For example, using the default serializer (JSON), setting a value of type `undefined`, `function`, or `symbol` will result in a TypeError.

##### `.reset`

Type: `(key: string) => void`

Reset the value assigned to `key` to the default state.

##### `.write`

Type: `() => void`

Explicitly write to disk.

##### `.read`

Type: `() => void`

Explicitly read from disk to state.

<!---
##### `.on`

Type: `(event: string, callback: (event, state) => void)`

TODO: events

##### `.migrate`

Type: `(map: { [version]: handler }) => void`

TODO: migrate
-->

##### `.filePath`

Type: `readonly string`

Readonly absolute path to the preference file stored on disk. This property will exist even if the preference file does not.

#### `getDefaultCrypto`

### Options

#### `defaults`

Type: `state`

An object specifying the default values of the preference state. If preferences are found, they will override the defaults in the state. If no preferences are found, defaults will be used – state will not be written to disk upon creation. Default: `{}`.

#### `name`

Type: `string`

The name of your project. This value will be used to build the [`filePath`](#.filePath) of the preference file stored on disk. Default: the `name` property of your `package.json`.

#### `filename`

Type: `string`

The filename of the preference file stored on disk. Default: `config.pref`

#### `dirPath`

Type: `string`

Absolute path determining where the preferences should be stored on disk. Default: `<system config>/<name>` where `<system config>` is the [User's default system config path](#Config%20Paths) and `<name>` is the `name` property configuration property;

#### `serializer`

Type: `state => string`

A function that specifies how the state should be serialized when written to disk. Default: `JSON.stringify`.

#### `deserializer`

Type: `string => state`

The reverse of `serializer`. A function that specifies how the state should be deserialized when read from disk. Default: `JSON.parse`.

#### `encoder`

Type: `string => string`

A function that specifies how the state should be encrypted. Default: [`getDefaultCrypto.encrypt`](#getDefaultCrypto).

#### `decoder`

Type: `string => string`

A function that specifies how the state should be decrypted. Default: [`getDefaultCrypto.decrypt`](#getDefaultCrypto).

#### `setter`

Type: `(state, key, value) => void`

A function that takes the existing `state`, the `key`, and the `value` and returns a new state to be saved to disk. The state will be saved to disk if the `equality` function returns false. Default: `(state, key, value) => { ...state, [key]: value }`.

#### `getter`

Type: `(state, key) => value`

Reverse of setter. A function that takes the existing `state` and the `key` and returns the value. Default: `(state, key) => state[key]`.

#### `equality`

Type: `boolean | (state, newState) => boolean`

Determines the equality of the old state and the new state. This method is used to determine if the state has changed since the last write. If set to `true` the state will write to disk on every `set`. When set to `false` the state will never write to disk on `set` and therefore must explicitly be written via [`write`](#.write).

<!---
#### `watch`

Type: `boolean`

Watch the preference file on disk for changes. If a change occurs it will trigger an `CHANGE` event that can be subscribed to using [`on`](#.on).

-->

## Config Paths

For each OS below `<home>` is calculated using NodeJS' `os.homedir()`.

- **macOS**: `<home>/Library/Preferences/<name>`
- **Windows**: `<home>/AppData/Roaming/<name>/Config`
- **Linux**: `<home>/.config/<name>` or `$XDG_CONFIG_HOME/<name>`

<!---
## Recipes

TODO: Dot Notation
TODO: YAML Serialization
TODO: Write on process exit
TODO: Migration example
-->
