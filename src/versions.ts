type SemVer = `${number}.${number}.${number}`;

type MajorRelease = {
  readonly major: number;
  readonly version: SemVer;
  readonly url: `https://${string}`;
};

type VersionManifest = {
  readonly current: SemVer;
  readonly majors: readonly MajorRelease[];
};

// Hand-maintained. See README "Cutting a new major version" before editing.
export const versions: VersionManifest = {
  current: '1.0.0',
  majors: [
    { major: 1, version: '1.0.0', url: 'https://www.gracealwan.com' },
  ],
};
