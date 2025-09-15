import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Typography,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { type RootState } from "@/app/store";
import { useState, useEffect } from "react";
import type { IContact } from "@/features/user/contact/types";
import { getContactsByTags } from "@/features/user/contact/service/contact.service";
import { schema, type ICampaignFormData, type ICampaign } from "../types";
import type { IMessageTemplate } from "@/features/user/message-template/types";
import { getMessageTemplatesApi } from "@/features/user/message-template/service/messageTemplate.service";

interface AddCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ICampaignFormData, contacts: IContact[]) => void;
  mode?: "add" | "edit";
  campaign?: ICampaign;
}

export default function AddEditCampaignModal({
  open,
  onClose,
  onSubmit,
  mode = "add",
  campaign,
}: AddCampaignModalProps) {
  const isEdit = mode === "edit";

  // 🔹 Workspace tags from Redux
  const workspaceTags = useSelector(
    (state: RootState) => state.userWorkspace.tags
  );

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ICampaignFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      templateId: "",
      name: "",
      tags: [],
      status: "Draft",
      startDate: "",
      endDate: "",
    },
  });

  // Prefill when editing
  useEffect(() => {
    if (isEdit && campaign) {
      reset({
        templateId: campaign.templateId,
        name: campaign.name,
        tags: campaign.tags,
        status: 'Draft',
        startDate: campaign.startDate
          ? new Date(campaign.startDate).toISOString().slice(0, 16)
          : "",
        endDate: campaign.endDate
          ? new Date(campaign.endDate).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [isEdit, campaign, reset]);

  // watch selected tags
  const selectedTags = watch("tags");

  // contacts preview
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // get workspaceId from Redux
  const workspaceId = useSelector(
    (state: RootState) => state.userWorkspace.current?._id
  );

  useEffect(() => {
    const fetchContacts = async () => {
      if (!selectedTags || selectedTags.length === 0 || !workspaceId) {
        setContacts([]);
        return;
      }
      try {
        setLoadingContacts(true);
        const data = await getContactsByTags(workspaceId, {
          tags: selectedTags,
        });
        setContacts(data);
      } catch (err) {
        console.error("❌ Failed to fetch contacts by tags:", err);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, [selectedTags, workspaceId]);

  // state for message templates
  const [templates, setTemplates] = useState<IMessageTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!workspaceId) return;
      try {
        setLoadingTemplates(true);
        const data = await getMessageTemplatesApi(workspaceId);
        setTemplates(data);
      } catch (err) {
        console.error("❌ Failed to fetch message templates:", err);
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, [workspaceId]);

  const handleFormSubmit = (data: ICampaignFormData) => {
    onSubmit(data, contacts);
    reset();
    onClose();
  };

  const isDraft = campaign?.status === "Draft" || !isEdit;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEdit ? "Edit Campaign" : "Add Campaign"}
      </DialogTitle>
      <DialogContent>
        <Controller
          name="templateId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={templates}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.title
              }
              value={templates.find((t) => t._id === field.value) || null}
              onChange={(_, value) => field.onChange(value ? value._id : "")}
              loading={loadingTemplates}
              disabled={!isDraft}
              renderInput={(params) => (
                <TextField
                  {...params as any}
                  label="Select Template"
                  margin="normal"
                  fullWidth
                  error={!!errors.templateId}
                  helperText={errors.templateId?.message}
                />
              )}
            />
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Campaign Name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={!isDraft}
            />
          )}
        />

        {/* Autocomplete for Tags */}
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={workspaceTags}
              value={field.value || []}
              onChange={(_, value) => field.onChange(value)}
              disabled={!isDraft}
              renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params as any}
                  label="Select Tags"
                  margin="normal"
                  error={!!errors.tags}
                  helperText={errors.tags?.message}
                />
              )}
            />
          )}
        />

        {/* Contacts Preview */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Contacts in selected tags
          </Typography>
          {loadingContacts ? (
            <CircularProgress size={24} />
          ) : contacts.length > 0 ? (
            <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
              {contacts.map((c) => (
                <Typography key={c._id} variant="body2">
                  {c.name} ({c.contactInfo.email})
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No contacts found.
            </Typography>
          )}
        </Box>

        {/* Dates */}
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="datetime-local"
              label="Start Date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
              disabled={!isDraft}
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="datetime-local"
              label="End Date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
              disabled={!isDraft}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        {isDraft && (
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            variant="contained"
            color="primary"
          >
            {isEdit ? "Update" : "Add"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
