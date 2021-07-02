import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';

const FormInput = ({ name, error, type, controllerProps, ...props }: any) => {
  const { control } = useFormContext();

  return (
    <Controller
      render={({ field }) => (
        <TextField type={type} error={!!error} helperText={error ? error.message : null} {...field} {...props} />
      )}
      name={name}
      control={control}
      defaultValue=""
      fullWidth={true}
      {...controllerProps}
    />
  );
};

export default FormInput;
