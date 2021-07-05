import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import InputMask from 'react-input-mask';
import { useState } from 'react';

const FormInput = ({
  rules,
  control,
  mask,
  maskType,
  maskChar,
  beforeMaskedValueChange,
  alwaysShowMask,
  inputRef,
  name,
  type,
  defaultValue = '',
  controllerProps,
  ...props
}: any) => {
  const [phoneMask, setPhoneMask] = useState('(99) 9999-9999');
  const beforeMaskedValueChangePhone = (newState: any, oldState: any, userInput: any) => {
    const telefone = newState.value.replace(/\D/g, '');
    const { value } = newState;
    const selection = newState.selection;
    console.log('newState:', newState);
    console.log('oldstate:', oldState);
    console.log(userInput);
    if (telefone.length < 10) {
      setPhoneMask('(99) 9999-9999');
      return {
        value,
        selection
      };
    } else {
      if (telefone.length === 10) {
        setPhoneMask('(99) 9999-9999');
      }
      if (selection.start === 16 && selection.end === 16) {
        console.log('starend');
        return {
          value,
          selection
        };
      }
      if (newState.value === oldState.value && userInput != null) {
        setPhoneMask('(99) 99999-9999');
        console.log('input', userInput);
        return {
          value: `${value}${userInput}`,
          selection
        };
      } else {
        return {
          value,
          selection
        };
      }
    }
  };
  // return mask || maskType ? (
  return mask ? (
    <Controller
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputMask
          // mask={maskType === 'telefone' ? phoneMask : mask}
          mask={mask}
          // beforeMaskedValueChange={maskType === 'telefone' ? beforeMaskedValueChangePhone : beforeMaskedValueChange}
          beforeMaskedValueChange={beforeMaskedValueChange}
          maskChar={maskChar}
          alwaysShowMask={alwaysShowMask}
          inputRef={inputRef}
          value={value}
          onChange={onChange}
        >
          {(inputProps: any) => (
            <TextField
              variant="outlined"
              label="Telefone"
              id="telefone"
              margin="normal"
              error={!!error}
              type={type}
              helperText={error ? error.message : null}
              {...inputProps}
              {...props}
              fullWidth
            />
          )}
        </InputMask>
      )}
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      {...controllerProps}
    />
  ) : (
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
