<div align="center">
	
# SVAR React File Manager | File Explorer

:globe_with_meridians: [Website](https://svar.dev/react/filemanager/) • :bulb: [Getting Started](https://docs.svar.dev/react/filemanager/getting_started/) • :eyes: [Demos](https://docs.svar.dev/react/filemanager/samples/)

[![npm](https://img.shields.io/npm/v/@svar-ui/react-filemanager.svg)](https://www.npmjs.com/package/@svar-ui/react-filemanager)
[![License](https://img.shields.io/github/license/svar-widgets/react-filemanager)](https://github.com/svar-widgets/react-filemanager/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/react-filemanager.svg)](https://www.npmjs.com/package/@svar-ui/react-filemanager)

</div>

[SVAR React File Manager](https://svar.dev/react/filemanager/) is a flexible file explorer component for React apps. It offers a familiar interface for browsing, organizing, and previewing files. Thanks to its extensive API for listening, intercepting, and executing data operations, you can integrate it with any backend — from local storage and databases to cloud services.

<div align="center">
  <img src="https://cdn.svar.dev/public/file-manager-1400.png" alt="SVAR File Manager for React - UI preview" width="700">
</div>
</br>

### :sparkles: Key features:

-   Basic file operations: create, delete, copy, rename, cut, paste
-   Download and upload files
-   Files tree view
-   List and tiles views
-   File preview pane with file information (file size, type, modified date, etc)
-   Split view to manage files between different locations
-   Built-in search box
-   Context menu and toolbar for quick actions
-   Keyboard navigation
-   Used storage info
-   Light and dark themes, with easy customization
-   Localization support
-   Optimized for large datasets with dynamic directory loading
-   Extensive API to listen, intercept, and execute data operations
-   Full TypeScript support
-   React 18 & 19 compatible

### :hammer_and_wrench: How to Use

To start using SVAR React File Manager, simply import the package and include the component in your React file:

```jsx
import { FileManager } from "@svar-ui/react-filemanager";
import "@svar-ui/react-filemanager/all.css";

const files = [
  {
    id: "/Music",
    size: 4096,
    date: new Date(2023, 11, 1, 14, 45),
    type: "folder",
  },
  {
    id: "/Info.txt",
    size: 1000,
    date: new Date(2023, 10, 30, 6, 13),
    type: "file",
  },
];
const myComponent => (<FileManager data={files} />);
```

See the [getting started guide](https://docs.svar.dev/react/filemanager/getting_started/) to set up and start using the File Manager in your React projects.

### :speech_balloon: Need Help?

[Post an Issue](https://github.com/svar-widgets/react-filemanager/issues/) or use our [community forum](https://forum.svar.dev).
