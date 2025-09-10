import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Campaign } from 'src/schema/campaign.schema';
import { User } from 'src/schema/user.schema';
import { Workspace } from 'src/schema/workspace.schema';
import { CreateCampaignDto } from './dto/createCampaign.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CampaignRecepient } from 'src/schema/recepient.schema';
import { Contact } from 'src/schema/contact.schema';
import { audit } from 'rxjs';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { MessageTemplate } from 'src/schema/messageTemplate.schema';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private CampaignModel: Model<Campaign>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Workspace.name) private WorkspaceModel: Model<Workspace>,
    @InjectModel(CampaignRecepient.name)
    private CampaignRecepientModel: Model<CampaignRecepient>,
    @InjectModel(Contact.name) private ContactModel: Model<Contact>,
    @InjectModel(MessageTemplate.name)
    private MessageTemplateModel: Model<MessageTemplate>,
    private mailService: MailService,
  ) {}

  async createCampaign(
    workspaceId: string,
    userId: string,
    dto: CreateCampaignDto,
  ) {
    const workspace = await this.WorkspaceModel.findById(workspaceId);

    if (!workspace) throw new HttpException('Workspace not found', 404);

    const addedTags = dto.tags;
    const validTags = workspace.tags.filter((t) => addedTags?.includes(t));

    if (!validTags) throw new HttpException('No valid tags were given', 400);

    const newCampaign = await this.CampaignModel.insertOne({
      ...dto,
      workspaceId: workspaceId,
      creator: userId,
      lastModifiedBy: userId,
      tags: validTags,
    });

    await this.WorkspaceModel.findByIdAndUpdate(workspaceId, {
      $push: { campaigns: newCampaign._id },
    });

    await this.prepareRecepientsforCampaign(newCampaign._id.toString());
    return newCampaign;
  }

  async getAllCampaigns(workspaceId: string) {
    await this.updateCampaignStatuses();
    return this.CampaignModel.find({ workspaceId, isDeleted: false });
  }

  async getCampaignById(campaignId: string) {
    const campaign = await this.CampaignModel.findOne({
      _id: campaignId,
      isDeleted: false,
    })
      .populate('templateId')
      .populate('creator', 'contactInfo.email')
      .populate('lastModifiedBy', 'contactInfo.email');

    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async updateCampaign(
    campaignId: string,
    userId: string,
    dto: Partial<CreateCampaignDto>,
  ) {
    const updated = await this.CampaignModel.findOneAndUpdate(
      { _id: campaignId, isDeleted: false },
      { ...dto, lastModifiedBy: userId },
      { new: true },
    );

    await this.prepareRecepientsforCampaign(campaignId);

    if (!updated) throw new NotFoundException('Campaign not found or deleted');
    return updated;
  }

  async deleteCampaign(campaignId: string) {
    const deleted = await this.CampaignModel.findOneAndUpdate(
      { _id: campaignId, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );

    if (!deleted)
      throw new NotFoundException('Campaign not found or already deleted');
    return { message: 'Campaign deleted successfully', campaign: deleted };
  }

  async getCampaignsByStatus(workspaceId: string, status: string) {
    return this.CampaignModel.find({
      workspaceId,
      status,
      isDeleted: false,
    });
  }

  async prepareRecepientsforCampaign(campaignId: string) {
    const campaign = await this.CampaignModel.findById(campaignId);

    if (!campaign || campaign.isDeleted)
      throw new HttpException('Campaign not found', 404);

    const tags = campaign.tags || [];

    if (!tags.length) {
      await this.CampaignRecepientModel.deleteMany({
        campaignId: campaign._id,
      });
      await this.CampaignModel.updateOne(
        { _id: campaign._id },
        { $set: { audienceSize: 0, preparedAt: new Date() } },
      );
      return { count: 0 };
    }

    const contacts = await this.ContactModel.find(
      {
        workspaceId: campaign.workspaceId,
        tags: { $in: tags },
      },
      {
        _id: 1,
        name: 1,
        'contactInfo.email': 1,
      },
    );

    const docs = contacts.map((c) => ({
      campaignId: campaign._id,
      contactId: c._id,
      email: c.contactInfo.email,
      name: c.name,
      status: 'queued',
    }));

    if (docs.length) {
      try {
        await this.CampaignRecepientModel.deleteMany({
          campaignId: campaign._id,
        });
        await this.CampaignRecepientModel.insertMany(docs, { ordered: false });
      } catch (err) {
        console.error('Insert error:', err);
      }
    }

    await this.CampaignModel.updateOne(
      {
        _id: campaignId,
      },
      {
        $set: { audienceSize: docs.length, preparedAt: new Date() },
      },
    );

    return { count: docs.length, ContactsPrepared: docs };
  }

  async runNow(campaignId: string, userId: string) {
    const campaign = await this.CampaignModel.findById(campaignId);
    if (!campaign || campaign.isDeleted)
      throw new HttpException('Campaign not found', 404);

    const now = new Date();

    if (campaign.status !== 'Draft') {
      throw new HttpException('Only draft campaign can start', 400);
    }

    campaign.status = 'Running';
    campaign.startDate = now;
    campaign.lastModifiedBy = new Types.ObjectId(userId);
    await campaign.save();

    await this.sendCampaign(campaignId);

    return {
      message: 'campaign started',
      campaignId,
      audienceSize: campaign.audienceSize ?? 0,
    };
  }

  async sendCampaign(campaignId: string) {
    const campaign =
      await this.CampaignModel.findById(campaignId).populate('templateId');
    if (!campaign) throw new HttpException('Campaign not found', 404);

    const recipients = await this.CampaignRecepientModel.find({
      campaignId: new Types.ObjectId(campaignId),
      status: 'queued',
    });

    const template = await this.MessageTemplateModel.findById(
      campaign.templateId,
    );
    if (!template) throw new HttpException('Template not found', 404);

    for (const r of recipients) {
      const subject = template!.title;

      // Replace {{name}} with recipient name or fallback "Amigo"
      const personalizedContent = template!.template.replace(
        /{{name}}/g,
        r.name || 'Amigo',
      );

      // If campaign has image, append it at the end of email
      let finalContent = personalizedContent;
      if (template.campaignImage) {
        finalContent += `<br/><br/><img src="${template.campaignImage}" alt="Campaign Image" style="max-width:100%; height:auto;" />`;
      }

      const success = await this.mailService.sendCampaignEmail(
        r.email,
        subject,
        finalContent,
      );

      await this.CampaignRecepientModel.updateOne(
        { _id: r._id },
        { $set: { status: success ? 'sent' : 'failed' } },
      );
    }

    return { sent: recipients.length };
  }

  async getContactOfCampaign(campaingId: string) {
    const campaign = await this.CampaignModel.findById(campaingId);
    if (!campaign) throw new HttpException('Campaign not found', 404);

    const recepients = await this.CampaignRecepientModel.find({
      campaignId: campaign._id,
    });

    return recepients;
  }

  async mailGone() {
    const message = await this.mailService.sendCampaignEmail(
      'yagnikvihaan5@gmail.com',
      'hello',
      'somecontent',
    );

    return { message: message };
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateCampaignStatuses() {
    const now = new Date();

    await this.CampaignModel.updateMany(
      { status: 'Draft', startDate: { $lte: now } },
      { $set: { status: 'Running' } },
    );

    await this.CampaignModel.updateMany(
      { status: 'Running', endDate: { $lte: now } },
      { $set: { status: 'Completed' } },
    );
  }
}
