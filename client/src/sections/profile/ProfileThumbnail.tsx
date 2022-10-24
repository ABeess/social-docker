import { LoadingButton } from '@mui/lab';
import { alpha, Avatar, AvatarGroup, Box, Button, Card, IconButton, Stack, styled, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { uploadSingle } from 'src/api/upload.api';
import { getProfile, IUploadImage, updateThumbnail, uploadAvatar } from 'src/api/user.api';
import Dialog from 'src/components/Dialog';
import Iconify from 'src/components/Iconify';
import Image from 'src/components/Image';
import { UploadSingle } from 'src/components/upload';
import useRouter from 'src/hooks/useRouter';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { updateAvatarRedux, updateProfileRedux, updateThumbnailRedux } from 'src/redux/slice/auth.slice';
import { closeModal, openModal } from 'src/redux/slice/modal.slice';
import { Maybe } from 'src/types';
import { FileType, User, UserProfile } from 'src/types/Base';
import { hashOwner } from 'src/utils/whitelistUrl';
import { ProfileCreateForm } from './ProfileCreateForm';

const RootStyled = styled('div')(() => ({}));

const ThumbnailStyled = styled('div')(({ theme }) => ({
  position: 'relative',

  '&::before': {
    position: 'absolute',
    content: '""',
    inset: 0,
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    zIndex: theme.zIndex.mobileStepper,
  },
}));

const InformationStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(16),
}));

const MyAvatarStyled = styled(Avatar)(({ theme }) => ({
  height: 100,
  width: 100,
  border: '2px solid #F5F5F5',
  zIndex: theme.zIndex.drawer,
  cursor: 'pointer',
  '&:hover::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundColor: theme.palette.divider,
  },
}));

const BoxAvatarStyled = styled('div')(() => ({
  height: 100,
  width: 100,
  position: 'absolute',
  bottom: 30,
  left: 16,
  overflow: 'hidden',
  borderRadius: '100%',
}));

interface ItemAvatarProp {
  open: boolean;
}

const ItemAvatarStyled = styled('div')<ItemAvatarProp>(({ theme, open }) => ({
  position: 'absolute',
  inset: 0,
  top: open ? '60%' : '110%',
  backgroundColor: alpha(theme.palette.grey[500], 0.4),
  zIndex: theme.zIndex.drawer,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export default function ProfileThumbnail() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth) as { user: User; isAuthenticated: boolean };
  const [file, setFile] = useState<Partial<FileType>>({});

  const [owner, setOwner] = useState(false);
  const [currentUser, setCurrenUser] = useState<Maybe<User>>(null);
  const [type, setType] = useState('');
  const { params } = useRouter();
  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const [isHoverAvatar, setIsHoverAvatar] = useState(false);

  const handleOpenModal = (name: string, type?: string) => {
    dispatch(openModal(name));
    setType(type || '');
  };

  const handleCloseModal = (name: string) => {
    dispatch(closeModal(name));
  };

  const handleMouseEnter = () => {
    if (hashOwner(String(params.id), String(user?.id))) {
      setIsHoverAvatar(true);
    }
  };

  const handleMouseLeave = () => {
    if (hashOwner(String(params.id), String(user?.id))) {
      setIsHoverAvatar(false);
    }
  };

  const ondrop = useCallback(
    (acceptedFiles: FileType[]) => {
      const file = acceptedFiles[0];

      setFile(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    },
    [setFile]
  );

  const { data, isLoading } = useQuery(
    ['PROFILE_USER', { user_id: params.id }],
    () => getProfile(params.id as string),
    {
      onSuccess(data) {
        // dispatch(setEnable('profile'));

        if (user?.id === params.id) {
          dispatch(updateProfileRedux(data.user.profile as UserProfile));
        }
      },
      enabled: isAuthenticated,
    }
  );

  useEffect(() => {
    if (params.id !== user.id && !isLoading) {
      setCurrenUser(data?.user as User);
    } else {
      setCurrenUser(user);
    }
  }, [params.id, data]);

  useEffect(() => {
    setOwner(hashOwner(String(params.id), String(user?.id)));
  }, [params]);

  const { mutateAsync: uploadAvatarMutate } = useMutation((values: IUploadImage) => uploadAvatar(values));
  const { mutateAsync: uploadThumbnailMutate } = useMutation((values: IUploadImage) => updateThumbnail(values));

  const { mutateAsync: uploadAvatarFile, isLoading: isLoadingUpload } = useMutation(
    (values: FormData) => uploadSingle(values),
    {
      async onSuccess({ upload }) {
        if (type === 'avatar') {
          const res = await uploadAvatarMutate({
            userId: user?.id,
            url: upload.url,
          });

          if (res.code === 200) {
            dispatch(updateAvatarRedux(upload.url));
          }
        } else if (type === 'thumbnail') {
          const res = await uploadThumbnailMutate({
            userId: user.id,
            url: upload.url,
          });

          if (res.code === 200) {
            setCurrenUser((prev) => ({ ...prev, profile: { ...prev?.profile, thumbnail: upload.url } } as User));
            dispatch(updateThumbnailRedux(upload.url));
          }
        }
      },
    }
  );

  const handleUploadAvatar = async () => {
    try {
      const formData = new FormData();
      if (isEmpty(file)) return;

      formData.append('file', file as FileType);

      await uploadAvatarFile(formData);

      handleCloseModal('avatar');
      setFile({});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <RootStyled>
      <Card sx={{ position: 'relative' }}>
        <ThumbnailStyled>
          <Image src={currentUser?.profile?.thumbnail} sx={{ maxHeight: 240 }} />
          <Button
            sx={{ position: 'absolute', right: 8, bottom: 8, zIndex: (theme) => theme.zIndex.appBar - 1 }}
            onClick={() => handleOpenModal('avatar', 'thumbnail')}
          >
            Change thumbnail
          </Button>
        </ThumbnailStyled>
        <BoxAvatarStyled onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <MyAvatarStyled src={currentUser?.avatar || ''} />
          {owner && isHoverAvatar && (
            <ItemAvatarStyled open={isHoverAvatar}>
              <IconButton size="small" onClick={() => handleOpenModal('avatar', 'avatar')}>
                <Iconify icon="fa:camera" color="#FFF" />
              </IconButton>
            </ItemAvatarStyled>
          )}
        </BoxAvatarStyled>

        <Box sx={{ height: 100, mt: 1 }}>
          <InformationStyled>
            <Stack spacing={0.5}>
              <Typography
                variant="subtitle1"
                sx={{ textTransform: 'capitalize' }}
              >{`${currentUser?.firstName} ${currentUser?.lastName}`}</Typography>

              <AvatarGroup
                spacing={4}
                sx={{ '& .MuiAvatar-root': { border: (theme) => `1px solid ${alpha(theme.palette.grey[50], 0.4)}` } }}
              >
                {[...Array(4)].map((_, index) => (
                  <Avatar key={index} alt="Remy Sharp" src={currentUser?.avatar || ''} sx={{ width: 32, height: 32 }} />
                ))}
              </AvatarGroup>
            </Stack>
            {owner && (
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                sx={{
                  px: 2,
                }}
                onClick={() => handleOpenModal('editProfile')}
                startIcon={<Iconify icon="ci:edit" />}
              >
                Edit profile
              </Button>
            )}
          </InformationStyled>
          <Dialog open={(modal['editProfile'] as boolean) || false} onClose={() => handleCloseModal('editProfile')}>
            <ProfileCreateForm />
          </Dialog>

          <Dialog open={(modal['avatar'] as boolean) || false} onClose={() => handleCloseModal('avatar')}>
            <Box sx={{ p: 2 }}>
              <UploadSingle file={file} onDrop={ondrop} sx={{ height: 400 }} />
              <Stack mt={2}>
                <LoadingButton loading={isLoadingUpload} variant="contained" onClick={handleUploadAvatar}>
                  Upload
                </LoadingButton>
              </Stack>
            </Box>
          </Dialog>
        </Box>
      </Card>
    </RootStyled>
  );
}
