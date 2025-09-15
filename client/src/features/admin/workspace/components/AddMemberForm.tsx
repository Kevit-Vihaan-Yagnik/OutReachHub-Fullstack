import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Grid,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as XLSX from "xlsx";
import {
  type IAddMemberModalProps,
  type IAddMembersDto,
  type IMemberToAdd,
  schema,
} from "../types";
import { downloadSampleExcel } from "@/utils/excel.util";

export default function AddMemberModal({
  open,
  onClose,
  onSubmit,
}: IAddMemberModalProps) {
  type FormSchema = yup.InferType<typeof schema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      avatarUrl: "",
      contactInfo: {
        countryCode: "+91",
        phoneNo: undefined as unknown as number,
        email: "",
      },
      permissions: { editor: false, viewer: true, allowAdd: false },
    },
  });

  const handleFormSubmit = (data: IMemberToAdd) => {
    const apiData: IAddMembersDto = { members: [data] };
    onSubmit(apiData);
    reset();
    onClose();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        return;
      }
      const sheet = workbook.Sheets[firstSheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet!);

      const members: IMemberToAdd[] = rows.map((row) => ({
        name: row["Name"],
        avatarUrl: row["AvatarUrl"] || null,
        contactInfo: {
          countryCode: row["CountryCode"] || "+91",
          phoneNo: Number(row["PhoneNo"]),
          email: row["Email"],
        },
        permissions: {
          viewer: row["Viewer"]?.toString().toLowerCase() === "true",
          editor: row["Editor"]?.toString().toLowerCase() === "true",
          allowAdd: row["AllowAdd"]?.toString().toLowerCase() === "true",
        },
      }));

      const apiData: IAddMembersDto = { members };
      onSubmit(apiData);

      onClose();
    } catch (err) {
      console.error("❌ Failed to parse Excel:", err);
    }
  };

  const handleDemoDownload = () => {
    const sampleData = [
      {
        Name: "John Doe",
        CountryCode: "+91",
        PhoneNo: "9876543210",
        Email: "john@example.com",
        AvatarUrl: "",
        Viewer: "TRUE",
        Editor: "FALSE",
        AllowAdd: "FALSE",
      },
    ];
    downloadSampleExcel("members", "sample_members", sampleData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Member</DialogTitle>
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
          name="avatarUrl"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Avatar URL"
              fullWidth
              margin="normal"
              error={!!errors.avatarUrl}
              helperText={errors.avatarUrl?.message}
              value={field.value || ""}
            />
          )}
        />

        <Controller
          name="contactInfo.countryCode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Country Code"
              fullWidth
              margin="normal"
              error={!!errors.contactInfo?.countryCode}
              helperText={errors.contactInfo?.countryCode?.message}
              value={field.value || ""}
            />
          )}
        />

        <Controller
          name="contactInfo.phoneNo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Number"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.contactInfo?.phoneNo}
              helperText={errors.contactInfo?.phoneNo?.message}
              value={field.value || ""}
            />
          )}
        />

        <Controller
          name="contactInfo.email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              error={!!errors.contactInfo?.email}
              helperText={errors.contactInfo?.email?.message}
            />
          )}
        />

        <FormGroup>
          <Controller
            name="permissions.editor"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value || false} />}
                label="Editor"
              />
            )}
          />
          <Controller
            name="permissions.viewer"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value || true} />}
                label="Viewer"
              />
            )}
          />
          <Controller
            name="permissions.allowAdd"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value || false} />}
                label="Allow Add"
              />
            )}
          />
        </FormGroup>

        {/* Excel Import */}
        <Box mt={3}>
          <input
            type="file"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            id="excel-upload"
            onChange={handleFileUpload}
          />
          <Grid container gap={2}>
            <Grid>
              <label htmlFor="excel-upload">
                <Button variant="outlined" component="span">
                  Import from Excel
                </Button>
              </label>
            </Grid>
            <Grid>
              <Button variant="outlined" onClick={handleDemoDownload}>
                Download Sample Excel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* Actions */}
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
