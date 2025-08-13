import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Contact } from "src/schema/contact.schema";
import { User } from "src/schema/user.schema";
import { Workspace } from "src/schema/workspace.schema";
import { CreateContactsDto } from "./dto/createContact.dto";
import { UpdateContactDto } from "./dto/updateContact.dto";

@Injectable()
export class ContactService {
    constructor(
        @InjectModel(Contact.name) private ContactModel: Model<Contact>,
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(Workspace.name) private WorkspaceModel: Model<Workspace>
    ) { }


    async createContact(workspaceId: string, dto: CreateContactsDto, creatorId: string) {
        const workspace = await this.WorkspaceModel.findById(workspaceId);

        if (!workspace) {
            throw new HttpException("Workspace not found", 404);
        }

        const contactsToInsert = dto.contacts.map((contact) => ({
            ...contact,
            workspaceId: workspace._id,
            creator: creatorId
        }))

        const createdContact = await this.ContactModel.insertMany(contactsToInsert);

        return {
            message: `${createdContact.length} contact(s) added successfuly`,
            data: createdContact
        }
    }

    async getContactByWorkspace(workspaceId: string) {
        const workspace = await this.WorkspaceModel.findById(workspaceId);

        if (!workspace) {
            throw new HttpException("Workspace not found", 404);
        }

        const contacts = await this.ContactModel.find({ workspaceId: workspace._id });

        return {
            message: `${contacts.length} contact(s) found`,
            data: contacts
        }
    }

    async getContactById(contactId: string) {
        const contact = await this.ContactModel.findById(contactId);
        if (!contact) {
            throw new HttpException("Contact not found", 404);
        }
        return {
            message: "Contact found",
            data: contact
        };
    }

    async deleteContact(contactId: string) {
        const contact = await this.ContactModel.findByIdAndDelete(contactId);
        if (!contact) {
            throw new HttpException("Contact not found", 404);
        }
        return {
            message: "Contact deleted successfully",
            data: contact
        };
    }

    async updateContact(contactId: string, updateData: UpdateContactDto) {
        const contact = await this.ContactModel.findByIdAndUpdate(contactId, updateData, { new: true });
        if (!contact) {
            throw new HttpException("Contact not found", 404);
        }
        return {
            message: "Contact updated successfully",
            data: contact
        };
    }

    async filterByTags(workspaceId : string , tags : string[]){
        const workspace = this.WorkspaceModel.findById(workspaceId);
        
        if(!workspace){
            throw new HttpException('Workspace not found', 404);
        }

        const filteredContacts = await this.ContactModel.find({
            tags : {$in : tags}
        })

        return filteredContacts;
    }
}