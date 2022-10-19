import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Divider, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { GraphQLError } from 'graphql';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { loginRequest } from 'src/api/auth.api';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { useAppDispatch } from 'src/redux/hooks';
import { loginSuccess } from 'src/redux/slice/auth.slice';
import { LoginValues } from 'src/types/InputValue';
import * as Yup from 'yup';
import SocialButton from '../SocialButton';

export default function LoginForm() {
  // const socket = useSocket();
  const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string().required(),
  });

  const methods = useForm<LoginValues>({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: 'abeesdevjs@gmail.com',
      password: 'abeesdevjs',
    },
  });

  const { mutate, isLoading } = useMutation((value: LoginValues) => loginRequest(value), {
    onSuccess: (data) => {
      if (data.code === 200) {
        enqueueSnackbar(data?.message, {
          variant: 'success',
        });
        dispatch(loginSuccess(data));
      } else {
        enqueueSnackbar(data?.message, {
          variant: 'error',
        });
      }
    },
    onError: (error: GraphQLError) => {
      enqueueSnackbar(error?.message, {
        variant: 'error',
      });
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (input: LoginValues) => {
    mutate(input);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <RHFTextField fullWidth name="email" label="Email" />
        <RHFTextField fullWidth name="password" label="Password" type="password" />
        <LoadingButton variant="contained" size="large" loading={isLoading} type="submit">
          Login
        </LoadingButton>
        <Divider>
          <Typography variant="subtitle1" color="text.secondary">
            Or
          </Typography>
        </Divider>
        <SocialButton />
      </Stack>
    </FormProvider>
  );
}
