import * as yup from "yup";
import type { ICampaign } from "./campaign";

// ──────────────────────────────
// Workspace Types
// ──────────────────────────────
export interface IWorkspace {
    _id: string;
    creator: string;
    name: string;
    description: string;
    tags: string[];
    users: (string | IWorkspaceUser)[]; // can be just IDs or full objects depending on API
    campaigns: (string | ICampaign)[];
    creationDate: string;
    __v: number;
}

export interface IWorkspaceRow {
    id: string;
    name: string;
    description: string;
    users: number;
    campaigns: number;
    creationDate: string;
}

export interface IWorkspaceFormData {
    name: string;
    description: string;
    tags: string[];
}

// ──────────────────────────────
// Members & Users
// ──────────────────────────────
export interface IMemberPermissions {
    editor?: boolean | null;
    viewer?: boolean | null;
    allowAdd?: boolean | null;
}

export interface IContactInfo {
    countryCode: string;
    phoneNo: number;
    email: string;
}

export interface IMemberToAdd {
    name: string;
    avatarUrl?: string | null;
    contactInfo: IContactInfo;
    permissions: IMemberPermissions;
}

export interface IAddMembersDto {
    members: IMemberToAdd[];
}

export interface IAddMemberModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: IAddMembersDto) => void;
}

// ──────────────────────────────
// Full Workspace User (from getWorkspaceById)
// ──────────────────────────────
export interface IUserPermission {
    editor: boolean;
    viewer: boolean;
    allowAdd: boolean;
    _id: string;
}

export interface IUserWorkspace {
    workspaceId: string;
    permission: IUserPermission;
    _id: string;
}

export interface IWorkspaceUser {
    _id: string;
    name: string;
    password?: string; // API sends it, but frontend usually ignores
    contactInfo: IContactInfo;
    workspaces: IUserWorkspace[];
    joinDate: string;
    __v: number;
}

// ──────────────────────────────
// Validation Schema
// ──────────────────────────────
export const schema = yup.object({
    name: yup.string().required("Name is required"),
    avatarUrl: yup.string().url("Avatar URL must be a valid URL").nullable().default(""),
    contactInfo: yup.object({
        countryCode: yup.string().required("Country code is required"),
        phoneNo: yup
            .number()
            .typeError("Phone number must be a number")
            .required("Phone number is required"),
        email: yup.string().email("Email must be valid").required("Email is required"),
    }),
    permissions: yup.object({
        editor: yup.boolean().notRequired().default(false),
        viewer: yup.boolean().notRequired().default(true),
        allowAdd: yup.boolean().notRequired().default(false),
    }),
});
