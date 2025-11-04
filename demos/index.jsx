import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './common/Index.jsx';

import { Globals, Button, Segmented } from '@svar-ui/react-core';

import Willow from '../src/themes/Willow.jsx';
import WillowDark from '../src/themes/WillowDark.jsx';

import '@svar-ui/react-core/style.css';
import '@svar-ui/react-menu/style.css';
import '@svar-ui/react-grid/style.css';
import '@svar-ui/react-uploader/style.css';

const skins = [
  { id: 'willow', label: 'Willow', Component: Willow },
  { id: 'willow-dark', label: 'Dark', Component: WillowDark },
];

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App
      publicName="File Manager"
      skins={skins}
      productTag="filemanager"
      Globals={Globals}
      Button={Button}
      Segmented={Segmented}
    />
  </React.StrictMode>,
);
