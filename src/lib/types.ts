export type ScanType = 'IP' | 'URL' | 'SpeedTest' | 'Image' | 'Password Strength' | 'Password Leak' | 'Initial' | 'Current' | 'password_strength' | 'password_leak' | 'password_generator' | 'url' | 'speed' | 'image';

export interface ScanHistoryEntry {
  id: string;
  timestamp: Date;
  type: ScanType;
  summary: string;
  scoreImpact: number;
}

export interface ScoreHistoryPoint {
  date: number;
  score: number;
  type: ScanType;
  summary: string;
}

export interface IpInfo {
  ip: string;
  ipv6: string;
  country_name: string;
  city: string;
  org: string;
  isp: string;
  asn: string;
  security: {
    is_vpn: boolean;
    is_proxy: boolean;
  };
}

export type ScoreWeights = {
  ip: number;
  url: number;
  speed: number;
  password: {
    strength: number;
    generator: number;
    leak: number;
  };
  image: number;
};

export type AddScanHistory = (entry: Omit<ScanHistoryEntry, 'id' | 'timestamp'>) => void;

export type SpeedHistoryPoint = {
  time: number;
  speed: number;
};
