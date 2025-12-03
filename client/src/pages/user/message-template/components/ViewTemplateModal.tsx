import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { type IMessageTemplate } from '../types';

interface ViewTemplateModalProps {
  open: boolean;
  onClose: () => void;
  template?: IMessageTemplate | null;
}

export default function ViewTemplateModal({ open, onClose, template }: ViewTemplateModalProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{template.title}</DialogTitle>
      <DialogContent dividers>
        {template.campaignImage && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img
              src={template.campaignImage}
              alt={template.title}
              style={{ maxWidth: '100%', borderRadius: 8 }}
            />
          </Box>
        )}
        <Typography
          variant="body1"
          sx={{ whiteSpace: 'pre-line' }} // keeps line breaks
        >
          {template.template}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
