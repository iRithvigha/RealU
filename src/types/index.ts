export type Region = 'North America' | 'South America' | 'Europe' | 'Asia';

export type Interest = {
  id: string;
  label: string;
};

export type Gender = 'male' | 'female' | 'non-binary';

export type FormData = {
  region: Region;
  interests: string[];
  genderPreference: Gender[];
  zkProofVerified: boolean;
};