import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { LauncherScreen } from './components/LauncherScreen';
import { WorldDetail } from './components/worlds/WorldDetail';
import { WorldWidgets } from './components/worlds/WorldWidgets';
import { HeartPage } from './components/HeartPage';
import { ChatScreen } from './components/ChatScreen';

const router = createBrowserRouter([
  { index: true,              Component: LauncherScreen },
  { path: 'worlds',           Component: WorldWidgets },
  { path: ':id',              Component: WorldDetail },
  { path: 'chat/:contextId',  Component: ChatScreen },
  { path: 'heart',            Component: HeartPage },
], { basename: import.meta.env.BASE_URL });

export default function App() {
  return <RouterProvider router={router} />;
}
