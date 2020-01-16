# import-sort-style-module-and-prefix

An [import sort](https://github.com/renke/import-sort) style based on [`import-sort-style-module`](https://github.com/renke/import-sort/tree/master/packages/import-sort-style-module) that support extra groupings by path prefix.

# Install

Install this package through `npm`:
```bash
npm install --dev import-sort-style-module-and-prefix
```

or `yarn`:
```bash
yarn install -D import-sort-style-module-and-prefix
```

In your `package.json` or `.importsortrc`, specify `module-and-prefix` as the `style` for file groups which you want to use this style.

For example, in `package.json`:
```json
"importSort": {
  ".js, .jsx, .ts, .tsx": {
    "style": "module-and-prefix"
  }
}
```

# Configuration

This module works exactly the same as `import-sort-style-module` if no extra configuration is done.

The configuration either lies under the key `importSortPrefix` in your `package.json`, in a file named `.importSortPrefixrc`. Thanks to [cosmiconfig](https://github.com/davidtheclark/cosmiconfig), `.importSortPrefixrc` can be of JSON or YAML format. Format can be explicited specified by the file extension. Please refer to [cosmiconfig](https://github.com/davidtheclark/cosmiconfig#cosmiconfig) for further information.

## Sample configurations

1. Groups all imports with path matching the prefix `src/`, and places them above the imports with relative path.

```json
{ "groupings": ["src/"] }
```

2. Groups all imports with path matching the prefix `src/` or `components/` together, and those matching the prefix `lib/` in another group.

```json
{ "groupings": [["src/", "components/"], "lib/"] }
```

## Options

There are two options available:

* [`position`](#position) - Accepted values: `beforeAbsolute`, `beforeBuiltins`, `beforeRelative`, `afterRelative`. **Default**: `beforeRelative`
* [`groupings`](#groupings) - Array of \[string or array of string] `(string | string[])[]`. **Default**: `[]`

### `position`

If not specified, the default value `beforeRelative` is used.

To illustrate each value, let's consider the following examples adapted from [import-sort-style-module](https://github.com/renke/import-sort/tree/master/packages/import-sort-style-module), and assume we have a custom group for modules matching the path prefix `src/`.

<details><summary><code>beforeAbsolute</code></summary>

```js
/*******************************************
 *
 * Absolute module without assigned imports
 *
 *******************************************/
import "src";
import "src/some_module";
import "src/helpers/some_helper";

// Absolute modules with side effects (not sorted because order may matter)
import "a";
import "c";
import "b";

// Relative modules with side effects (not sorted because order may matter)
import "./a";
import "./c";
import "./b";

// Modules from the Node.js "standard" library sorted by name
import {readFile, writeFile} from "fs";
import * as path from "path";

/*******************************************
 *
 * Ordinary absolute module imports
 *
 *******************************************/
import indexModule from "src";
import {namedExport} from "src/some_module";
import helperFunc from "src/helpers/some_helper";

// Third-party modules sorted by name
import aa from "aa";
import bb from "bb";
import cc from "cc";

// First-party modules sorted by "relative depth" and then by name
import aaa from "../../aaa";
import bbb from "../../bbb";
import aaaa from "../aaaa";
import bbbb from "../bbbb";
import aaaaa from "./aaaaa";
import bbbbb from "./bbbbb";
```
</details>

<details><summary><code>beforeBuiltins</code></summary>

```js
/*******************************************
 *
 * Absolute module without assigned imports
 *
 ******************************************/
import "src";
import "src/some_module";
import "src/helpers/some_helper";

// Absolute modules with side effects (not sorted because order may matter)
import "a";
import "c";
import "b";

// Relative modules with side effects (not sorted because order may matter)
import "./a";
import "./c";
import "./b";

/*******************************************
 *
 * Ordinary absolute module imports
 *
 ******************************************/
import indexModule from "src";
import {namedExport} from "src/some_module";
import helperFunc from "src/helpers/some_helper";

// Modules from the Node.js "standard" library sorted by name
import {readFile, writeFile} from "fs";
import * as path from "path";

// Third-party modules sorted by name
import aa from "aa";
import bb from "bb";
import cc from "cc";

// First-party modules sorted by "relative depth" and then by name
import aaa from "../../aaa";
import bbb from "../../bbb";
import aaaa from "../aaaa";
import bbbb from "../bbbb";
import aaaaa from "./aaaaa";
import bbbbb from "./bbbbb";
```
</details>

<details><summary><code>beforeRelative</code> <em>(default)</em></summary>

```js
// Absolute modules with side effects (not sorted because order may matter)
import "a";
import "c";
import "b";

/*******************************************
 *
 * Absolute module without assigned imports
 *
 ******************************************/
import "src";
import "src/some_module";
import "src/helpers/some_helper";

// Relative modules with side effects (not sorted because order may matter)
import "./a";
import "./c";
import "./b";

// Modules from the Node.js "standard" library sorted by name
import {readFile, writeFile} from "fs";
import * as path from "path";

// Third-party modules sorted by name
import aa from "aa";
import bb from "bb";
import cc from "cc";

/*******************************************
 *
 * Ordinary absolute module imports
 *
 ******************************************/
import indexModule from "src";
import {namedExport} from "src/some_module";
import helperFunc from "src/helpers/some_helper";

// First-party modules sorted by "relative depth" and then by name
import aaa from "../../aaa";
import bbb from "../../bbb";
import aaaa from "../aaaa";
import bbbb from "../bbbb";
import aaaaa from "./aaaaa";
import bbbbb from "./bbbbb";
```
</details>

<details><summary><code>afterRelative</code></summary>

```js
// Absolute modules with side effects (not sorted because order may matter)
import "a";
import "c";
import "b";

// Relative modules with side effects (not sorted because order may matter)
import "./a";
import "./c";
import "./b";

/*******************************************
 *
 * Absolute module without assigned imports
 *
 ******************************************/
import "src";
import "src/some_module";
import "src/helpers/some_helper";

// Modules from the Node.js "standard" library sorted by name
import {readFile, writeFile} from "fs";
import * as path from "path";

// Third-party modules sorted by name
import aa from "aa";
import bb from "bb";
import cc from "cc";

// First-party modules sorted by "relative depth" and then by name
import aaa from "../../aaa";
import bbb from "../../bbb";
import aaaa from "../aaaa";
import bbbb from "../bbbb";
import aaaaa from "./aaaaa";
import bbbbb from "./bbbbb";

/*******************************************
 *
 * Ordinary absolute module imports
 *
 ******************************************/
import indexModule from "src";
import {namedExport} from "src/some_module";
import helperFunc from "src/helpers/some_helper";
```
</details>

### `groupings`

This option defines custom groupings and accepts an array. Each array item can either be a path prefix, or an array of path prefixes.

If not specified, the default value `[]` is assumed. In such case, this style works exactly the same as [import-sort-style-module](https://github.com/renke/import-sort/tree/master/packages/import-sort-style-module).

Each item in the `groupings` array corrisponds to one group, i.e. a chunk of import statements that does not contain any empty line.

To group multiple path prefixes into one group, place them in an array. Refer to [Example 2](#2-groups-of-path-prefixes) for an example.

The custom groups will appear in the same order as specified in the option.

#### Examples

##### 1. Simple path prefix groups:

Options:
```json
{ "groupings": ["src/", "@helpers/", "@components/", "lib/"] }
```

Imports matching each of the specified path prefix will be grouped into their corrisponding group.

```js
// Third-party modules sorted by name
import aa from "aa";
import bb from "bb";
import cc from "cc";

/** Custom import groups */
import indexModule from "src";
import {namedExport} from "src/some_module";

import helperFunc from "@helpers/some_helper";

import ExternalLib, {libHelperFunc} from "lib/external_lib";

// First-party modules sorted by "relative depth" and then by name
import aaa from "../../aaa";
import bbb from "../../bbb";
import aaaa from "../aaaa";
import bbbb from "../bbbb";
import aaaaa from "./aaaaa";
import bbbbb from "./bbbbb";
```

Take note that the `src/` group appears before the  `@helpers/` group, in the same order as the `groupings` option, regardless of alphabetical order. `lib/` group comes after `@helpers/` group, the two groups separated by exactly one empty line, unaffected by the empty `@components/` group.

<a id="example-2"></a>

##### 2. Groups of path prefixes

Options:
```json
{ "groupings": [["src/", "@helpers/"], "@components/", "lib/"] }
```

Imports matching each of the specified path prefix **group** will be grouped into their corrisponding group. In other words, imports matching the path prefixes `src/` or `@helpers/` are grouped together, with the ones matching `src/` come before those matching `@helpers/`; imports matching `lib/` are in their own group.

```js
// Third-party modules sorted by name
import aa from "aa";
import bb from "bb";
import cc from "cc";

/** Custom import groups */
import indexModule from "src";
import {namedExport} from "src/some_module";
import helperFunc from "@helpers/some_helper";

import ExternalLib, {libHelperFunc} from "lib/external_lib";

// First-party modules sorted by "relative depth" and then by name
import aaa from "../../aaa";
import bbb from "../../bbb";
import aaaa from "../aaaa";
import bbbb from "../bbbb";
import aaaaa from "./aaaaa";
import bbbbb from "./bbbbb";
```

# License

Released under [the MIT License](https://opensource.org/licenses/MIT). :copyright: 2020 Ron Lau.
