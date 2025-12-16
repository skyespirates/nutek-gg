export interface User {
  id: number;
  email: string;
  password: string;
}

export interface OTP {
  id: number;
  otp_code: string;
  expires_at: Date;
  created_at: Date;
  used: boolean;
}

export interface Counter {
  name: string;
  current: number;
}

export interface RequestPerHour {
  hour: string;
  total_request: number;
}

export interface TokenPayload {
  id: number;
  email: string;
}

export interface Account {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  balance: number;
  profile_image?: string;
}

export interface NewAccount {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export interface Balance {
  balance: number;
}

export interface Service {
  id: number;
  code: string;
  name: string;
  icon?: string;
  tariff: number;
}

export interface Banner {
  name: string;
  image: string;
  description: string;
}

export interface BannerResp {
  banner_name: string;
  banner_image: string;
  banner_description: string;
}

export interface Item {
  id_product: number;
  name: string;
  price: number;
  qty: number;
}

export interface OrderPayload {
  address: string;
  payment_type: string;
  items: Item[];
}

export interface Order {}
