import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema, type IContactFormData } from "../types";

interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IContactFormData) => void;
  availableTags: string[]; 
}


export default function AddContactModal({
  open,
  onClose,
  onSubmit,
  availableTags,
}: AddContactModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IContactFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      profilePicture: "https://www.w3schools.com/howto/img_avatar.png",
      countryCode: "",
      phoneNo: 0,
      email: "",
      company: "",
      jobTitle: "",
      tags: [],
    },
  });

  const handleFormSubmit = (data: IContactFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Contact</DialogTitle>
    <DialogContent>
      {/* ✅ Name */}
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

      {/* ✅ Profile Picture */}
      <Controller
        name="profilePicture"
        control={control}
        render={({ field }) => (
        <TextField
          {...field}
          label="Profile Picture URL"
          fullWidth
          margin="normal"
          error={!!errors.profilePicture}
          helperText={errors.profilePicture?.message}
        />
        )}
      />

      {/* ✅ Country Code & Phone */}
      <Controller
        name="countryCode"
        control={control}
        render={({ field }) => (
        <TextField
          {...field}
          label="Country Code"
          fullWidth
          margin="normal"
          error={!!errors.countryCode}
          helperText={errors.countryCode?.message}
        />
        )}
      />
      <Controller
        name="phoneNo"
        control={control}
        render={({ field }) => (
        <TextField
          {...field}
          label="Phone Number"
          fullWidth
          margin="normal"
          error={!!errors.phoneNo}
          helperText={errors.phoneNo?.message}
        />
        )}
      />

      {/* ✅ Email */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
        <TextField
          {...field}
          label="Email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        )}
      />

      {/* ✅ Company & Job Title */}
      <Controller
        name="company"
        control={control}
        render={({ field }) => (
        <TextField
          {...field}
          label="Company"
          fullWidth
          margin="normal"
          error={!!errors.company}
          helperText={errors.company?.message}
        />
        )}
      />
      <Controller
        name="jobTitle"
        control={control}
        render={({ field }) => (
        <TextField
          {...field}
          label="Job Title"
          fullWidth
          margin="normal"
          error={!!errors.jobTitle}
          helperText={errors.jobTitle?.message}
        />
        )}
      />

      {/* ✅ Tags with Autocomplete */}
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
        <Autocomplete
          multiple
          options={availableTags}
          value={field.value || []}
          onChange={(_, newValue) => field.onChange(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
              key={option}
            />
            ))
          }
          renderInput={(params) => (
            <TextField
            {...params}
            label="Tags"
            placeholder="Select tags"
            margin="normal"
            error={!!errors.tags}
            helperText={errors.tags?.message}
            />
          )}
        />
        )}
      />
    </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
