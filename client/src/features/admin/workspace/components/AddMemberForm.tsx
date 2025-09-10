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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import  {type IAddMemberModalProps , type IAddMembersDto, type IMemberToAdd, schema } from "../types";


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
            contactInfo: { countryCode: "+91", phoneNo: undefined as unknown as number, email: "" },
            permissions: { editor: false, viewer: true, allowAdd: false },
        },
    });

    const handleFormSubmit = (data: IMemberToAdd) => {
        const apiData: IAddMembersDto = {
            members: [data],
        };
        onSubmit(apiData);
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Member</DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                {/* Name */}
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

                {/* Avatar URL */}
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
                            value={field.value || ''}
                        />
                    )}
                />

                {/* Country Code */}
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
                            value={field.value || ''}
                        />
                    )}
                />

                {/* Phone Number */}
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
                            value={field.value || ''}
                        />
                    )}
                />

                {/* Email */}
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

                {/* Permissions */}
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