import { Controller, useForm } from 'react-hook-form';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { yupResolver } from '@hookform/resolvers/yup';

import { type ITemplateFormData, schema } from '../types';

interface AddTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ITemplateFormData) => void;
}

export default function AddTemplateModal({ open, onClose, onSubmit }: AddTemplateModalProps) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ITemplateFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      type: 'text',
      template: '',
      campaignImage: '',
    },
  });

  const type = watch('type');

  type CleanedData = {
    title: string;
    type: 'text' | 'text-image';
    template: string;
  };

  const handleFormSubmit = (data: ITemplateFormData) => {
    let dataForSubmission: CleanedData | ITemplateFormData;

    if (data.type === 'text') {
      const cleanedData: CleanedData = {
        title: data.title,
        type: data.type,
        template: data.template,
      };
      dataForSubmission = cleanedData;
    } else {
      dataForSubmission = data;
    }

    onSubmit(dataForSubmission);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Message Template</DialogTitle>
      <DialogContent>
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Template Title"
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        {/* Type Toggle */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              {...field}
              value={field.value}
              exclusive
              onChange={(_, value) => field.onChange(value)}
              sx={{ mt: 2, mb: 2 }}
            >
              <ToggleButton value="text">Text</ToggleButton>
              <ToggleButton value="text-image">Text + Image</ToggleButton>
            </ToggleButtonGroup>
          )}
        />

        {/* Template Body (Simple TextArea) */}
        <Controller
          name="template"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Message Body"
              fullWidth
              margin="normal"
              multiline
              rows={5}
              error={!!errors.template}
              helperText={errors.template?.message}
            />
          )}
        />

        {/* Campaign Image (only for text-image) */}
        {type === 'text-image' && (
          <Controller
            name="campaignImage"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Campaign Image URL"
                fullWidth
                margin="normal"
                error={!!errors.campaignImage}
                helperText={errors.campaignImage?.message}
              />
            )}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained" color="primary">
          Add Template
        </Button>
      </DialogActions>
    </Dialog>
  );
}
