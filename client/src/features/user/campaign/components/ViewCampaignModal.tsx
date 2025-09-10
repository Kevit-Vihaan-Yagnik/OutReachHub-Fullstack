import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { ICampaignDetail, ICampaignRecipient } from "../types";
import {
  getCampignDetails,
  getContactOfCampaign,
} from "../service/campaign.service";

interface ViewCampaignModalProps {
  open: boolean;
  onClose: () => void;
  campaignId?: string;
}

export default function ViewCampaignModal({
  open,
  onClose,
  campaignId,
}: ViewCampaignModalProps) {
  const [campaign, setCampaign] = useState<ICampaignDetail | null>(null);
  const [recipients, setRecipients] = useState<ICampaignRecipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);

  useEffect(() => {
    if (!campaignId || !open) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const detail = await getCampignDetails(campaignId);
        const contacts = await getContactOfCampaign(campaignId);
        setCampaign(detail);
        setRecipients(Array.isArray(contacts) ? contacts : []);
      } catch (err) {
        console.error("❌ Failed to fetch campaign details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId, open]);

  return (
    <>
      {/* Main Campaign Modal */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Campaign Details</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : campaign ? (
            <>
              {/* Campaign Info */}
              <Typography variant="h6" gutterBottom>
                {campaign.name}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label={campaign.status} color="primary" />
              </Box>
              <Typography>
                <strong>Start Date:</strong>{" "}
                {new Date(campaign.startDate).toLocaleString()}
              </Typography>
              <Typography>
                <strong>End Date:</strong>{" "}
                {new Date(campaign.endDate).toLocaleString()}
              </Typography>
              <Typography>
                <strong>Tags:</strong> {campaign.tags.join(", ")}
              </Typography>
              <Typography>
                <strong>Audience Size:</strong> {campaign.audienceSize}
              </Typography>
              <Typography>
                <strong>Created By:</strong>{" "}
                {campaign.creator?.contactInfo?.email}
              </Typography>
              <Typography>
                <strong>Last Modified By:</strong>{" "}
                {campaign.lastModifiedBy?.contactInfo?.email}
              </Typography>

              {/* View Template Button */}
              {campaign.templateId && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setTemplateOpen(true)}
                  >
                    View Template
                  </Button>
                </Box>
              )}

              {/* Recipients */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recipients
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recipients.map((r) => (
                      <TableRow key={r._id}>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>{r.email}</TableCell>
                        <TableCell>{r.status}</TableCell>
                      </TableRow>
                    ))}
                    {recipients.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No recipients found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </>
          ) : (
            <Typography>No campaign data available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Template Modal */}
      <Dialog
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Template Details</DialogTitle>
        <DialogContent dividers>
          {campaign?.templateId ? (
            <>
              <Typography variant="h6" gutterBottom>
                {campaign.templateId.title}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Type: {campaign.templateId.type}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {campaign.templateId.template}
              </Typography>
            </>
          ) : (
            <Typography>No template linked with this campaign.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
