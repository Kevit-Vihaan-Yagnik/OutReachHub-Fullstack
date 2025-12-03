import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import type { RootState } from '@/app/store';

import { getContactById } from '../service/contact.service';
import type { IContact } from '../types';

interface ViewContactModalProps {
  open: boolean;
  onClose: () => void;
  contactId: string | null;
}

export default function ViewContactModal({ open, onClose, contactId }: ViewContactModalProps) {
  const [contact, setContact] = useState<IContact | null>(null);
  const [loading, setLoading] = useState(false);
  const workspaceId = useSelector((state: RootState) => state.userAuth.currentWorkspace?.id);
  useEffect(() => {
    if (!contactId || !open || !workspaceId) return;

    const fetchContact = async () => {
      setLoading(true);
      try {
        const res = await getContactById(workspaceId, contactId);
        setContact(res);
      } catch (err) {
        console.error('❌ Failed to fetch contact:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [contactId, open, workspaceId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Contact Details</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : contact ? (
          <Box>
            {/* Top section for Avatar and Name */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <Avatar
                src={contact.profilePicture as string}
                alt={contact.name}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Typography variant="h5" fontWeight={600}>
                {contact.name}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Details section using a List for clean alignment */}
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={contact.contactInfo.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary={`${contact.contactInfo.countryCode} ${contact.contactInfo.phoneNo}`}
                />
              </ListItem>
              {contact.company && (
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Company" secondary={`${contact.company} - ${contact.jobTitle}`} />
                </ListItem>
              )}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Tags section */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Tags
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {contact.tags.map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" color="primary" />
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography>No contact details found.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}