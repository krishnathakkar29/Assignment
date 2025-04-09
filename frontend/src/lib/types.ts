export interface Campaign {
  _id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  leads: string[];
  accountIDs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LinkedInProfile {
  name: string;
  connection: string;
  headline: string;
  location: string;
  summary: string;
  profileURL: string;
}
