import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { GraphQLError } from 'graphql';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { registerRequest } from 'src/api/auth.api';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { RegisterValues } from 'src/types/InputValue';
import socket from 'src/utils/socket';
import * as Yup from 'yup';

export default function RegisterForm() {
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required().min(8),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const defaultValues: RegisterValues = {
    firstName: 'abees',
    lastName: 'dev',
    email: 'abeesdevjs@gmail.com',
    password: 'abeesdevjs',
    confirmPassword: 'abeesdevjs',
  };

  const methods = useForm<RegisterValues>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const { mutate, isLoading } = useMutation((value: RegisterValues) => registerRequest(value), {
    onSuccess: (response) => {
      if (response?.code === 201) {
        enqueueSnackbar(response.message);
        socket?.emit('CREATE_ROOM', response.user?.id);
      } else {
        enqueueSnackbar(response?.message, { variant: 'error' });
      }
    },
    onError: (error: GraphQLError) => {
      enqueueSnackbar(error?.message, { variant: 'error' });
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (value: RegisterValues) => {
    mutate(value);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <RHFTextField name="firstName" label="Fist name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>
        <RHFTextField name="email" label="Email" />
        <RHFTextField name="password" label="Password" type="password" />
        <RHFTextField name="confirmPassword" label="Confirm" type="password" />
        <LoadingButton variant="contained" size="large" loading={isLoading} type="submit">
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
