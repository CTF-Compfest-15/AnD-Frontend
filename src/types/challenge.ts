export type ChallengePublic = {
  id: number;
  title: string;
};

export type Challenge = ChallengePublic & {
  slug: string;
  description: string | undefined;
  description_raw: string | undefined;
};

export type ChallengeDetail = Challenge & {
  visibility: number[];
  artifact_checksum: string;
  testcase_checksum: string;
  point: number;
  num_flag: number;
  num_service: number;
};