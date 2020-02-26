// Adapted from https://github.com/renke/import-sort/blob/83422cef255b7e0aed47b02ae6ff2cb3e22b255c/packages/import-sort-style-module/src/index.ts
import { cosmiconfigSync } from "cosmiconfig";
import { IMatcherFunction, IStyleAPI, IStyleItem } from "import-sort-style";

export enum PrefixGroupsPosition {
  beforeAbsolute = "beforeAbsolute",
  beforeBuiltins = "beforeBuiltins",
  beforeRelative = "beforeRelative",
  afterRelative = "afterRelative"
}

export interface Config {
  position: PrefixGroupsPosition;
  groupings: (string | string[])[];
}

function assertNever(_: never): void {}

let resolvedConfig: Config | undefined;

const getConfig = (): Config => {
  if (resolvedConfig === undefined) {
    const config = cosmiconfigSync("importSortPrefix", {
      packageProp: "importSortPrefix"
    }).search();

    const defaultConfig: Config = {
      position: PrefixGroupsPosition.beforeRelative,
      groupings: []
    };

    if (
      config === null ||
      config.isEmpty ||
      typeof config.config !== "object"
    ) {
      resolvedConfig = defaultConfig;
    } else {
      const mergedConfig = { ...defaultConfig };

      if (
        Object.values(PrefixGroupsPosition).includes(config.config.position)
      ) {
        mergedConfig.position = config.config.position;
      }

      if (Array.isArray(config.config.groupings)) {
        mergedConfig.groupings = (config.config.groupings || [])
          .map((v: unknown): typeof v =>
            Array.isArray(v)
              ? v.filter((v: any): v is string => typeof v === "string")
              : v
          )
          .filter(
            (v: unknown | string[]): v is string | string[] =>
              (Array.isArray(v) && v.length > 0) || typeof v === "string"
          );
      }

      resolvedConfig = mergedConfig;
    }
  }

  return resolvedConfig;
};

const constructMatchers = (
  { moduleName, startsWith }: IStyleAPI,
  groupings: (string | string[])[]
): IMatcherFunction[] => {
  return groupings.map(
    (v): IMatcherFunction => {
      if (Array.isArray(v)) {
        return moduleName(startsWith(...v));
      } else {
        return moduleName(startsWith(v));
      }
    }
  );
};

export default function(styleApi: IStyleAPI): IStyleItem[] {
  const {
    alias,
    not,
    and,
    or,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    naturally,
    unicode
  } = styleApi;

  const config = getConfig();
  const matchers = constructMatchers(styleApi, config.groupings);
  const negativeMatcher = not(or(...matchers));

  const hasMemberStyleItems = matchers
    .map(matcher => [
      {
        match: matcher,
        sort: [dotSegmentCount, moduleName(naturally)],
        sortNamedMembers: alias(unicode)
      },
      { separator: true }
    ])
    .reduce((acc, item) => [...acc, ...item], []);

  const noMemberStyleItems = hasMemberStyleItems.map(
    ({ sortNamedMembers, ...item }) =>
      item.match !== undefined
        ? {
            ...item,
            sort: [moduleName(naturally)],
            match: and(hasNoMember, item.match)
          }
        : item
  );

  const styleItems = [noMemberStyleItems, hasMemberStyleItems];

  let beforeNoMemberAbsolute: IStyleItem[] = [],
    beforeNoMemberRelative: IStyleItem[] = [],
    beforeBuiltins: IStyleItem[] = [],
    beforeAbsolute: IStyleItem[] = [],
    beforeRelative: IStyleItem[] = [],
    afterRelative: IStyleItem[] = [];

  switch (config.position) {
    case PrefixGroupsPosition.beforeBuiltins:
      [beforeNoMemberAbsolute, beforeBuiltins] = styleItems;
      break;

    case PrefixGroupsPosition.beforeAbsolute:
      [beforeNoMemberAbsolute, beforeAbsolute] = styleItems;
      break;

    case PrefixGroupsPosition.beforeRelative:
      [beforeNoMemberRelative, beforeRelative] = styleItems;
      break;

    case PrefixGroupsPosition.afterRelative:
      [beforeBuiltins, afterRelative] = styleItems;
      break;

    default:
      assertNever(config.position);
  }

  return [
    ...beforeNoMemberAbsolute,

    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule, negativeMatcher) },
    { separator: true },

    ...beforeNoMemberRelative,

    // import "./foo"
    { match: and(hasNoMember, isRelativeModule, negativeMatcher) },
    { separator: true },

    ...beforeBuiltins,

    // import … from "fs";
    {
      match: isNodeModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode)
    },
    { separator: true },

    ...beforeAbsolute,

    // import … from "foo";
    {
      match: and(isAbsoluteModule, negativeMatcher),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode)
    },
    { separator: true },

    ...beforeRelative,

    // import … from "./foo";
    // import … from "../foo";
    {
      match: and(isRelativeModule, negativeMatcher),
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode)
    },
    { separator: true },

    ...afterRelative,

    // Others
    {
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode)
    },
    { separator: true }
  ];
}
