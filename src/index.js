import Filemanager from './components/Filemanager.jsx';
import Tooltip from './components/Tooltip.jsx';

import Material from './themes/Material.jsx';
import Willow from './themes/Willow.jsx';
import WillowDark from './themes/WillowDark.jsx';

export { Filemanager, Tooltip, Material, Willow, WillowDark };

export { getMenuOptions } from '@svar-ui/filemanager-store';

import { env, setEnv } from '@svar-ui/lib-dom';
setEnv(env);
