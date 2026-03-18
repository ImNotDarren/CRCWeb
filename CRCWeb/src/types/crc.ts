/**
 * CRC model types inferred from backend server models/crc/*
 * Backend: /Users/darren/Desktop/hulab-apps/server
 */

// --- Nested types used by CRCModule and others ---

export interface CRCContentPageSummary {
  title: string;
  content: string;
  crcContentId?: number;
}

export interface CRCModuleContentItem {
  id: number;
  content: string;
  completed?: boolean;
  crcContentPage?: CRCContentPageSummary;
}

export interface CRCUserAssignmentContentValue {
  value: boolean;
}

export interface CRCModuleAssignmentContentSummary {
  id?: number;
  title?: string;
  content?: string;
  crcUserAssignmentContents?: CRCUserAssignmentContentValue[];
}

export interface CRCModuleAssignmentItem {
  id: number;
  assignment: string;
  crcAssignmentContent?: CRCModuleAssignmentContentSummary;
}

export interface CRCWebResourceItem {
  id: number;
  content: string;
}

export interface CRCLectureItem {
  id: number;
  title: string;
  link: string;
  transcript?: string | null;
  note?: string | null;
}

export interface CRCModuleProgressSummary {
  progress: number;
}

export interface CRCQuizUserScore {
  score: number;
}

// --- Main CRC types ---

export interface CRCModule {
  id: number;
  name: string;
  crcContents?: CRCModuleContentItem[];
  crcAssignments?: CRCModuleAssignmentItem[];
  crcWebResources?: CRCWebResourceItem[];
  crcLectures?: CRCLectureItem[];
  crcModuleProgresses?: CRCModuleProgressSummary[];
  crcQuizUsers?: CRCQuizUserScore[];
  crcMultipleChoices?: unknown[];
}

export interface CRCVersion {
  id: number;
  name: string;
  description: string | null;
}

export interface CRCModuleVersion {
  id: number;
  crcModuleId: number;
  crcVersionId: number;
  order: number;
}

export interface CRCSummary {
  id: number;
  summary: string;
  index: number;
  crcModuleId: number;
}

export interface CRCAgenda {
  id: number;
  title: string;
  index: number;
  crcModuleId: number;
}

export interface CRCAgendaContent {
  id: number;
  content: string;
  index: number;
  crcAgendaId: number;
}

export interface CRCFormat {
  id: number;
  format: string;
}

export interface CRCLecture {
  id: number;
  title: string;
  link: string;
  transcript: string | null;
  note: string | null;
  crcModuleId: number;
}

export interface CRCContent {
  id: number;
  content: string;
  index: number;
  crcModuleId: number;
}

export interface CRCContentPage {
  id: number;
  title: string;
  content: string;
  crcContentId: number;
}

export interface CRCQuestion {
  id: number;
  question: string;
  index: number;
  crcModuleId: number;
}

export interface CRCWebResource {
  id: number;
  content: string;
  index: number;
  crcModuleId: number;
}

export interface CRCAssignment {
  id: number;
  assignment: string;
  index: number;
  crcModuleId: number;
}

export interface CRCCompetenciesAndEval {
  id: number;
  content: string;
  index: number;
  crcModuleId: number;
}

export interface CRCModuleProgress {
  id: number;
  userId: number;
  crcModuleId: number;
  progress: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CRCMultipleChoice {
  id: number;
  question: string;
  A: string;
  B: string;
  C: string | null;
  D: string | null;
  answer: string;
  index: number;
  explanation: string | null;
  crcModuleId: number;
}

export interface CRCModuleRole {
  id: number;
  role: string;
  crcModuleId: number;
}

export interface CRCQuizUser {
  id: number;
  score: number;
  crcModuleId: number;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CRCAssignmentContent {
  id: number;
  title: string;
  content: string;
  crcAssignmentId: number;
}

export interface CRCUserAssignmentContent {
  id: number;
  userId: number;
  crcAssignmentContentId: number;
  value: boolean;
  details: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CRCPermission {
  id: number;
  type: string;
  userId: number;
}

export interface CRCLocation {
  id: number;
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  speed: number;
  userId: number;
}

export interface CRCAccelerometer {
  id: number;
  userId: number;
  [key: string]: unknown;
}

export type FontSizeKey = 'small' | 'medium' | 'large';
