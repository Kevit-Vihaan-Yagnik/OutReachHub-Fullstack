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
import { schema, type IContactFormData, type IContact } from "../types";
import { useEffect } from "react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IContactFormData) => void;
  availableTags: string[];
  initialData?: IContact; // 👈 Pass this only for editing
}

export default function ContactFormModal({
  open,
  onClose,
  onSubmit,
  availableTags,
  initialData,
}: ContactModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IContactFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      profilePicture: "",
      countryCode: "",
      phoneNo: 0,
      email: "",
      company: "",
      jobTitle: "",
      tags: [],
    },
  });

  // 🔹 Reset form when initialData changes (Edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        profilePicture: initialData.profilePicture || "",
        countryCode: initialData.contactInfo.countryCode,
        phoneNo: initialData.contactInfo.phoneNo,
        email: initialData.contactInfo.email,
        company: initialData.company || "",
        jobTitle: initialData.jobTitle || "",
        tags: initialData.tags || [],
      });
    } else {
      reset({
        name: "",
        profilePicture: "",
        countryCode: "",
        phoneNo: 0,
        email: "",
        company: "",
        jobTitle: "",
        tags: [],
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: IContactFormData) => {
    onSubmit({
      ...data,
      contactInfo: {
        countryCode: data.countryCode,
        phoneNo: data.phoneNo,
        email: data.email,
      },
    } as unknown as IContactFormData);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Edit Contact" : "Add Contact"}
      </DialogTitle>
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
                  {...params as any}
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
          {initialData ? "Save Changes" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
