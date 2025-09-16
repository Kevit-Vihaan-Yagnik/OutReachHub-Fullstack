import { Controller, useForm } from 'react-hook-form';

import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

import type { IWorkspaceFormData } from '../types';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IWorkspaceFormData) => void;
}

const availableTags = ['marketing', 'design', 'leads', 'email', 'sales'];

export default function FormModal({ open, onClose, onSubmit }: FormModalProps) {
  const { control, handleSubmit, reset } = useForm<IWorkspaceFormData>({
    defaultValues: {
      name: '',
      description: '',
      tags: [],
    },
  });

  const handleFormSubmit = (data: IWorkspaceFormData) => {
    onSubmit(data);
    reset(); // clear form after submit
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Workspace</DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {/* Name */}
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Workspace Name"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Tags */}
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              options={availableTags}
              value={field.value}
              onChange={(_, newValue) => field.onChange(newValue)}
              renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params: AutocompleteRenderInputParams) => {
                return (
                  <TextField
                    {...(params as { size: string })}
                    size="medium"
                    label="Tags"
                    placeholder="Select tags"
                  />
                );
              }}
            />
          )}
        />
      </DialogContent>

      {/* Actions */}
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
