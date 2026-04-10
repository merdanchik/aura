import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { LauncherScreen } from './components/LauncherScreen';
import { WorldDetail } from './components/worlds/WorldDetail';
import { HeartPage } from './components/HeartPage';
import { ChatScreen } from './components/ChatScreen';
import { Dashboard } from './components/Dashboard';
import { AuraProvider } from './context/AuraContext';

const router = createBrowserRouter([
  { index: true,              Component: LauncherScreen },
  { path: 'worlds',           Component: Dashboard },
  { path: ':id',              Component: WorldDetail },
  { path: 'chat/:contextId',  Component: ChatScreen },
  { path: 'heart',            Component: HeartPage },
  { path: 'dashboard',        Component: Dashboard },
], { basename: import.meta.env.BASE_URL });

export default function App() {
  return (
    <AuraProvider>
      <RouterProvider router={router} />
    </AuraProvider>
  );
}
