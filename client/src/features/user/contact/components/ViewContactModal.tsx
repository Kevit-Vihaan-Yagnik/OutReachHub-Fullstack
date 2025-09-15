import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { IContact } from "../types";
import { getContactById } from "../service/contact.service";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

interface ViewContactModalProps {
  open: boolean;
  onClose: () => void;
  contactId: string | null;
}

export default function ViewContactModal({
  open,
  onClose,
  contactId,
}: ViewContactModalProps) {
  const [contact, setContact] = useState<IContact | null>(null);
  const [loading, setLoading] = useState(false);
  const workspaceId = useSelector(
    (state: RootState) => state.userAuth.currentWorkspace?.id
  );
  useEffect(() => {
    if (!contactId || !open || !workspaceId) return;

    const fetchContact = async () => {
      setLoading(true);
      try {
        const res = await getContactById(workspaceId, contactId);
        setContact(res);
      } catch (err) {
        console.error("❌ Failed to fetch contact:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [contactId, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Contact Details</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : contact ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            {/* Profile picture */}
            <Avatar
              src={contact.profilePicture as string}
              alt={contact.name}
              sx={{ width: 80, height: 80 }}
            />
            {/* Name */}
            <Typography variant="h6">{contact.name}</Typography>

            {/* Email */}
            <Typography variant="body1" color="text.secondary">
              📧 {contact.contactInfo.email}
            </Typography>

            {/* Phone */}
            <Typography variant="body1" color="text.secondary">
              📞 {contact.contactInfo.countryCode} {contact.contactInfo.phoneNo}
            </Typography>

            {/* Company & Job */}
            {contact.company && (
              <Typography variant="body2">
                🏢 {contact.company} - {contact.jobTitle}
              </Typography>
            )}

            {/* Tags */}
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              {contact.tags.map((tag) => (
                <Chip key={tag} label={tag} variant="outlined" />
              ))}
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
