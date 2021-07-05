import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';

const FormInput = ({ rules, control, name, type, defaultValue = '', controllerProps, ...props }: any) => {
  return (
    <Controller
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          type={type}
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error ? error.message : null}
          {...props}
        />
      )}
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      {...controllerProps}
    />
  );
};

export default FormInput;
