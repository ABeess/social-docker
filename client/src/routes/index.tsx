import { lazy, LazyExoticComponent, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import GuestGuard from 'src/guards/GuestGuard';
import Layout from 'src/layouts';
// import Layout from 'src/layouts';

// eslint-disable-next-line react/display-name, arrow-body-style
const Loadable = (Component: LazyExoticComponent<() => JSX.Element>) => (props: JSX.IntrinsicAttributes) => {
  return (
    <Suspense fallback={<></>}>
      <Component {...props} />
    </Suspense>
  );
};

const Login = Loadable(lazy(() => import('src/pages/auth/Login')));
const Register = Loadable(lazy(() => import('src/pages/auth/Register')));

// Dashboard

const PostPage = Loadable(lazy(() => import('src/pages/home/Post')));

// const NotFound = Loadable(lazy(() => import('src/pages/Page404')));

// Home
const LookingFriend = Loadable(lazy(() => import('src/pages/home/LookingFriend')));
const Profile = Loadable(lazy(() => import('src/pages/home/Profile')));
const Message = Loadable(lazy(() => import('src/pages/home/Message')));
const Broadcast = Loadable(lazy(() => import('src/pages/home/LiveStream')));
const CreateStream = Loadable(lazy(() => import('src/pages/home/CreateStream')));
const StreamDetail = Loadable(lazy(() => import('src/pages/home/StreamDetails')));

export const router = createBrowserRouter([
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { element: <PostPage />, index: true },
      {
        path: 'post',
        element: <PostPage />,
      },
      {
        path: 'looking-friend',
        element: <LookingFriend />,
      },
      {
        path: 'profile/:id',
        element: <Profile />,
      },
      {
        path: 'message/t/:to',
        element: <Message />,
      },
      {
        path: 'live/create',
        element: <CreateStream />,
      },
      {
        path: 'broadcast',
        element: <Broadcast />,
      },
      {
        path: 'broadcast/live/:stream_key',
        element: <StreamDetail />,
      },
    ],
  },
]);
