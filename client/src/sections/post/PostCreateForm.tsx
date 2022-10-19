import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Container, Stack, styled, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPost, CreatePostQuery } from 'src/api/post.api';
import { uploadMultiple } from 'src/api/upload.api';
import { FormProvider } from 'src/components/hook-form';
import RHFTextArea from 'src/components/hook-form/RHFTextArea';
import { RHFUploadMultiple } from 'src/components/hook-form/RHFUpload';
import Iconify from 'src/components/Iconify';
import MyAvatar from 'src/components/MyAvatar';
import { useAppSelector } from 'src/redux/hooks';
import { FileType, User } from 'src/types/Base';
import { PostInput } from 'src/types/InputValue';
import * as Yup from 'yup';
import PostAction from './PostAction';

// eslint-disable-next-line no-empty-pattern
const RootStyled = styled('div')(() => ({}));

interface PostValues extends Omit<PostInput, 'user'> {
  files?: FileType[];
}

interface IAction {
  addImage: boolean;
  value: string;
}

const PostSchema = Yup.object().shape({
  content: Yup.string(),
  files: Yup.mixed(),
});

interface PostFormProps {
  // eslint-disable-next-line no-unused-vars
  handleSuccess: () => void;
}

export default function PostCreateForm({ handleSuccess }: PostFormProps) {
  const user = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const [action, setAction] = useState<IAction>({
    addImage: false,
    value: '',
  });

  const defaultValues: PostValues = {
    content: '',
    files: [],
  };

  const methods = useForm({
    resolver: yupResolver(PostSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting },
  } = methods;

  const handleOndrop = useCallback(
    (acceptedFiles: FileType[]) =>
      setValue('files', [
        ...(getValues('files') as Array<FileType>),
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]),
    [setValue]
  );

  const { mutateAsync } = useMutation((values: CreatePostQuery) => createPost(values));

  const onSubmit = async (postValue: PostValues) => {
    try {
      const formData = new FormData();
      postValue.files?.map((file) => formData.append('files', file));

      const { uploads } = await uploadMultiple(formData);

      await mutateAsync({
        images: uploads,
        post: {
          content: postValue.content,
          user: user as User,
        },
      });

      handleSuccess();
      queryClient.invalidateQueries(['POST']);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAction = (value: string) => {
    setAction((prev) => ({ ...prev, addImage: value === 'add' }));
  };

  return (
    <RootStyled>
      <Container>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack mt={2} direction="row" spacing={2} alignItems="center">
            <MyAvatar sx={{ width: 45, height: 45 }} />
            <Stack spacing={0.2}>
              <Typography variant="subtitle1">{`${user?.firstName} ${user?.lastName}`}</Typography>
              <Button
                size="small"
                color="inherit"
                variant="contained"
                sx={{ py: 0 }}
                startIcon={<Iconify icon="material-symbols:public" sx={{ width: 15, height: 15 }} />}
                endIcon={<Iconify icon="bi:caret-down-fill" sx={{ width: 12, height: 12 }} />}
              >
                Public
              </Button>
            </Stack>
          </Stack>

          <Stack mt={2}>
            <RHFTextArea
              name="content"
              sx={{
                border: 'none',
              }}
              placeholder="What are you thinking?"
              minRows={3}
            />
            {(action.addImage || !isEmpty(watch('files'))) && (
              <RHFUploadMultiple name="files" onDrop={handleOndrop} singlePreview />
            )}
          </Stack>
          <PostAction handleClick={handleSelectAction} />
          <LoadingButton loading={isSubmitting} type="submit" fullWidth size="large" variant="contained">
            Post
          </LoadingButton>
        </FormProvider>
      </Container>
    </RootStyled>
  );
}
