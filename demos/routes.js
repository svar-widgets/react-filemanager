import BasicInit from './cases/BasicInit.jsx';
import PathAndSelection from './cases/PathAndSelection.jsx';
import ContextMenu from './cases/ContextMenu.jsx';
import Readonly from './cases/Readonly.jsx';
import CustomStyles from './cases/CustomStyles.jsx';
import SimpleIcons from './cases/SimpleIcons.jsx';
import Locales from './cases/Locales.jsx';
import API from './cases/API.jsx';
import ExtraInfo from './cases/ExtraInfo.jsx';
import BackendData from './cases/BackendData.jsx';
import DataProvider from './cases/DataProvider.jsx';
import BackendFilter from './cases/BackendFilter.jsx';

export const links = [
  ['/base/:skin', 'Basic File Manager', BasicInit, 'BasicInit'],
  [
    '/selection/:skin',
    'Initial path/selection',
    PathAndSelection,
    'PathAndSelection',
  ],
  ['/context/:skin', 'Custom context menu', ContextMenu, 'ContextMenu'],
  ['/readonly/:skin', 'Readonly mode', Readonly, 'Readonly'],
  ['/custom-styles/:skin', 'Styling', CustomStyles, 'CustomStyles'],
  ['/simple-icons/:skin', 'Simple icons', SimpleIcons, 'SimpleIcons'],
  ['/locales/:skin', 'Locales', Locales, 'Locales'],
  ['/api/:skin', 'API calls', API, 'API'],
  ['/extra-info/:skin', 'Extra info', ExtraInfo, 'ExtraInfo'],
  ['/serverdata/:skin', 'Backend data', BackendData, 'BackendData'],
  ['/data-provider/:skin', 'Saving to backend', DataProvider, 'DataProvider'],
  [
    '/serverfilter/:skin',
    'Filtering on backend',
    BackendFilter,
    'BackendFilter',
  ],
];
