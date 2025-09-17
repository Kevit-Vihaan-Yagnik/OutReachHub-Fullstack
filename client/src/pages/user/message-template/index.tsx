import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Masonry from '@mui/lab/Masonry';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Pagination,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';

import type { RootState } from '@/app/store';
import { showSnackbar } from '@/common/slices/snackbarSlice';

import AddTemplateModal from './components/AddTemplate';
import DeleteTemplateModal from './components/DeleteTemplateModal';
import ViewTemplateModal from './components/ViewTemplateModal';
import {
  createMessageTemplate,
  deleteMessageTemplateApi,
  getMessageTemplatesApi,
} from './service/messageTemplate.service';
import {
  addMessageTemplate,
  deleteMessageTemplate,
  setError,
  setLoading,
  setMessageTemplate,
} from './slices/messageTemplateSlice';
import type { IMessageTemplate, ITemplateFormData } from './types';

export default function MessageTemplate() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const templates = useSelector((state: RootState) => state.messageTemplate.messageTemplates);
  const workspaceId = useSelector((state: RootState) => state.userAuth.currentWorkspace?.id);

  const permission = useSelector(
    (state: RootState) => state.userAuth.currentWorkspace?.permission.editor,
  );
  const [openAdd, setOpenAdd] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<IMessageTemplate | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTemplate, setDeleteTemplate] = useState<IMessageTemplate | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'text-image'>('all');

  // pagination state
  const [page, setPage] = useState(1);
  const limit = 9; // templates per page

  const handleAddTemplate = async (data: ITemplateFormData) => {
    if (!workspaceId) return;

    try {
      const newTemplate = await createMessageTemplate(workspaceId, data);
      dispatch(addMessageTemplate(newTemplate));

      dispatch(showSnackbar({ message: 'Template added successfully!', severity: 'success' }));
    } catch (err) {
      console.error('❌ Failed to add template:', err);
      dispatch(showSnackbar({ message: 'Failed to add template', severity: 'error' }));
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!workspaceId) return;

    try {
      await deleteMessageTemplateApi(workspaceId, templateId);
      dispatch(deleteMessageTemplate(templateId)); // ✅ create this reducer in slice
      dispatch(showSnackbar({ message: 'Template deleted successfully!', severity: 'success' }));
    } catch (err) {
      console.error('❌ Failed to delete template:', err);
      dispatch(showSnackbar({ message: 'Failed to delete template', severity: 'error' }));
    } finally {
      setDeleteOpen(false);
      setDeleteTemplate(null);
    }
  };

  // 🔹 Fetch messageTemplates once
  useEffect(() => {
    const fetchMessageTemplates = async () => {
      if (!workspaceId) return;
      try {
        dispatch(setLoading(true));
        const res = await getMessageTemplatesApi(workspaceId);
        dispatch(setMessageTemplate(res));
      } catch {
        dispatch(setError('Failed to fetch message templates'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchMessageTemplates();
  }, [workspaceId, dispatch]);

  // 🔹 Filter + Search
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.template.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, filterType, templates]);

  // 🔹 Pagination (client-side)
  const totalPages = Math.ceil(filteredTemplates.length / limit);
  const paginatedTemplates = filteredTemplates.slice((page - 1) * limit, page * limit);

  // Reset to page 1 whenever filters/search change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterType]);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary">
          Message Templates
        </Typography>
        {permission ? (
          <Button variant="contained" color="primary" onClick={() => setOpenAdd(true)}>
            Add Template +
          </Button>
        ) : (
          ''
        )}
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <TextField
          label="Search templates"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: '250px' }}
        />

        <ToggleButtonGroup
          value={filterType}
          exclusive
          onChange={(_, newType) => newType && setFilterType(newType)}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="text">Text</ToggleButton>
          <ToggleButton value="text-image">Text + Image</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Cards */}
      <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={3}>
        {paginatedTemplates.map((template) => (
          <Card key={template._id} sx={{ borderRadius: 2, boxShadow: 3, height: 'min-content' }}>
            {template.campaignImage && (
              <CardMedia
                component="img"
                height="160"
                image={template.campaignImage}
                alt={template.title}
              />
            )}
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {template.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {template.template}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  setSelectedTemplate(template);
                  setViewOpen(true);
                }}
              >
                View
              </Button>
              {permission ? (
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    setDeleteTemplate(template);
                    setDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              ) : (
                ''
              )}
            </CardActions>
          </Card>
        ))}

        {paginatedTemplates.length === 0 && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 4, mx: 'auto' }}>
            No templates found.
          </Typography>
        )}
      </Masonry>

      {/* Modals */}
      <AddTemplateModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddTemplate}
      />

      <ViewTemplateModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        template={selectedTemplate}
      />

      <DeleteTemplateModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        template={deleteTemplate}
        onConfirm={handleDeleteTemplate}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
