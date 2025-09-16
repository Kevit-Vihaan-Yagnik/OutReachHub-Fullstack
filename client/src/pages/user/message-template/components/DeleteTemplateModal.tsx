import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { type IMessageTemplate } from '../types';

interface DeleteTemplateModalProps {
  open: boolean;
  onClose: () => void;
  template?: IMessageTemplate | null;
  onConfirm: (templateId: string) => void;
}

export default function DeleteTemplateModal({
  open,
  onClose,
  template,
  onConfirm,
}: DeleteTemplateModalProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Template</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{template.title}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => onConfirm(template._id)} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
