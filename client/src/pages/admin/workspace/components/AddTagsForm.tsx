import { useState } from 'react';

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

interface AddTagsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tags: string[]) => void;
  initialTags?: string[];
}

export default function AddTagsModal({
  open,
  onClose,
  onSubmit,
  initialTags = [],
}: AddTagsModalProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = () => {
    onSubmit(tags);
    onClose();
    setTags(initialTags);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Tags</DialogTitle>
      <DialogContent>
        {/* Pills / Chips */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {tags.map((tag, idx) => (
            <Chip
              key={idx}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        {/* Input Field */}
        <TextField
          fullWidth
          label="Type a tag and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddTag}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
