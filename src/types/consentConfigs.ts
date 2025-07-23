// Define interfaces for ConsentManager data (simplified for brevity)
export interface BannerStyles {
  primaryColor: string;
  borderRadius: number;
}
export interface BannerConfig {
  _id: string;
  styles: BannerStyles;
  content: {
    title: { [key: string]: string };
    buttons: Array<{ text: { [key: string]: string }; action: string }>;
  };
  behavior: { auto_close: number; strictly_necessary_locked: boolean };
}

export type ChannelCookies = Array<
  Partial<
    Pick<Cookie, "_id" | "name" | "description" | "expiration" | "httpOnly">
  >
>;
export type ChannelVendors = Array<
  Pick<
    Vendor,
    "_id" | "name" | "cookies" | "privacy_policy_url" | "description"
  >
>;
export interface Channel {
  _id: string;
  app_id: string;
  cookies: ChannelCookies;
  vendors: ChannelVendors;
  description: { [key: string]: string };
  is_consent_required: boolean;
  is_essential?: boolean;
  label: { [key: string]: string };
  name: string;
}

export interface Cookie {
  _id: string;
  app_id: string;
  created_at: string;
  updated_at: string;
  description: { [key: string]: string };
  name: string;
  domain: string;
  expiration: string;
  uniqueIdentity: string;
  httpOnly: boolean;
  is_third_party: boolean;
  secure: boolean;
  path: string;
}

export type VendorCookies = Array<
  Partial<
    Pick<Cookie, "_id" | "name" | "description" | "expiration" | "httpOnly">
  >
>;

export interface Vendor {
  _id: string;
  app_id?: string;
  name: string;
  cookies: VendorCookies;
  description: { [key: string]: string };
  privacy_policy_url: string;
}

export interface Region {
  enabled: boolean;
  privacy_notice: {
    description: { [key: string]: string };
    policy_url?: string;
  };
  iab_tcf_enabled?: boolean;
  opt_out_enabled?: boolean;
}

export interface ConsentManagerConfig {
  regions: {
    eu: Region;
    usa: Region;
    global: Region;
  };
  applyRegion: "usa" | "global" | "eu";
  channels: Channel[];
  vendors: Vendor[];
  banner_config: BannerConfig;
}

export interface ConsentManagerSDK {
  init: (options: ConsentManagerConfig) => void;
  getConsent: () => any;
}
