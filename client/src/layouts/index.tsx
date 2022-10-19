import { styled } from '@mui/material';
import { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/guards/AuthGuard';
import DashboardLayout from './dashboard';
import LogoOnly from './LogoOnly';
import MainLayout from './main';

type Variants = 'dashboard' | 'logoOnly' | 'main';
interface ILayout {
  variants?: Variants;
}

export default function Layout({ variants = 'main' }: ILayout) {
  if (variants === 'logoOnly') {
    return <LogoOnly />;
  }

  if (variants === 'dashboard') {
    return (
      <RenderContent>
        <DashboardLayout />
      </RenderContent>
    );
  }

  return (
    <RenderContent>
      <MainLayout />
    </RenderContent>
  );
}

const RootStyle = styled('div')(() => ({
  display: 'flex',
}));

const MainStyle = styled('main')(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(15),
  paddingRight: theme.spacing(4),
  paddingLeft: theme.spacing(4),
  paddingBottom: theme.spacing(15),
}));
interface RenderContentProps {
  children: ReactElement;
}
function RenderContent({ children }: RenderContentProps) {
  return (
    <RootStyle>
      <AuthGuard>{children}</AuthGuard>

      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
