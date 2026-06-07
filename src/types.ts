export enum UserRole {
  SYS_ADMIN = "System Admin",
  BROKER_OWNER = "Broker Owner",
  AGENT = "Individual Agent",
  MORTGAGE_PARTNER = "Mortgage Partner"
}

export enum LeadStage {
  NEW = "New",
  AI_NURTURING = "AI Nurturing",
  QUALIFIED = "Qualified",
  MORTGAGE_REVIEW = "Mortgage Review",
  SCHEDULED = "Scheduled",
  HANDED_OFF = "Handed Off"
}

export enum BillingStatus {
  ACTIVE = "Active",
  DELINQUENT = "Delinquent"
}

export interface Tenant {
  id: string;
  name: string;
  subscription_tier: "Starter" | "Pro Team" | "Enterprise Brokerage";
  billing_status: BillingStatus;
  tech_fee_balance: number;
  active_campaigns_count: number;
  ad_spend_budget: number;
}

export interface Lead {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone: string;
  stage: LeadStage;
  income: number;
  credit_score: number;
  property_preferences: string;
  listing_interest: string;
  compliance_status: "Active" | "Compliance Hold";
  compliance_report?: string;
  last_interaction_time: string;
  assigned_agent_id?: string;
}

export interface ChatLog {
  id: string;
  lead_id: string;
  sender: "lead" | "ai" | "agent" | "mortgage";
  message: string;
  timestamp: string;
  channel_visibility: "all" | "agents_only";
}

export interface AdCampaign {
  id: string;
  tenant_id: string;
  property_id: string;
  original_url: string;
  headline: string;
  ad_copy: string;
  zipcodes: string[];
  budget: number;
  tech_fee: number;
  status: "Active" | "Pending Approval" | "Compliance Hold";
}

export interface VideoTemplate {
  id: string;
  name: string;
  aspectRatio: "16:9" | "9:16";
  musicMood: string;
  thumbnail: string;
}

export interface VideoQueueItem {
  id: string;
  address: string;
  status: "Price Dropped" | "Just Listed";
  progress: number;
  status_text: "In Queue" | "Parsing MLS" | "Stitching Visuals" | "Kinetic Layering" | "Voiceover Synthesizing" | "Completed";
  voiceover_script: string;
  duration_sec: number;
  url?: string;
}

export interface PhoneNode {
  id: string;
  label: string;
  phone_number: string;
  voice_persona: string;
  greeting_script: string;
  fallback_routing: string;
  calls_count: number;
}

export interface PastClient {
  id: string;
  name: string;
  address: string;
  latitude: number; // For mapping
  longitude: number; // For mapping
  close_date: string;
  purchase_price: number;
  estimated_equity: number;
  moving_probability: number; // 0-100
  last_contacted: string;
  draft_text?: string;
}
