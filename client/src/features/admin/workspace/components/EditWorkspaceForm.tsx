import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IWorkspaceRow } from "../types";
import { useEffect } from "react";

interface EditWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  workspace: IWorkspaceRow | null; // workspace being edited
  onSubmit: (data: { id: string; name: string; description: string }) => void;
}

// 🔹 Validation schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
});

export default function EditWorkspaceModal({
  open,
  onClose,
  workspace,
  onSubmit,
}: EditWorkspaceModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; description: string }>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: workspace?.name || "",
      description: workspace?.description || "",
    },
  });

  // 🔹 Reset values when modal opens with a different workspace
  useEffect(() => {
    if (workspace) {
      reset({
        name: workspace.name,
        description: workspace.description,
      });
    }
  }, [workspace, reset]);

  const handleFormSubmit = (data: { name: string; description: string }) => {
    if (workspace) {
      onSubmit({ id: workspace.id, ...data });
    }
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Workspace</DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              margin="normal"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
