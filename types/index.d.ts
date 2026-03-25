import type {
  FC,
  ReactNode,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import type { IMenuOption } from '@svar-ui/react-menu';

import type {
  TMethodsConfig,
  IApi,
  IConfig,
  TContextMenuType,
  IExtraInfo,
  IParsedEntity,
} from '@svar-ui/filemanager-store';

export * from '@svar-ui/filemanager-store';

export interface IFileMenuOption extends IMenuOption {
  hotkey: string;
}

export type FilePreview = IParsedEntity & {
  type: 'file' | 'folder' | 'search' | 'multiple' | 'none';
};

export declare const Filemanager: ForwardRefExoticComponent<
  {
    readonly?: boolean;
    menuOptions?: (
      mode: TContextMenuType,
      item?: IParsedEntity,
    ) => IFileMenuOption[];
    extraInfo?: (
      file: IParsedEntity,
    ) => Promise<IExtraInfo> | IExtraInfo | null;
    icons?: (file: IParsedEntity, size: 'big' | 'small') => string;
    previews?: (
      file: FilePreview,
      width: number,
      height: number,
    ) => string | null;
    init?: (api: IApi) => void;
  } & IConfig &
    FilemanagerActions<TMethodsConfig> &
    RefAttributes<IApi>
>;

export declare const Material: FC<{
  fonts?: boolean;
  children?: ReactNode;
}>;

export declare const Willow: FC<{
  fonts?: boolean;
  children?: ReactNode;
}>;

export declare const WillowDark: FC<{
  fonts?: boolean;
  children?: ReactNode;
}>;

/* get component events from store actions*/
type RemoveHyphen<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Head}${RemoveHyphen<Tail>}`
  : S;

type EventName<K extends string> = `on${RemoveHyphen<K>}`;

export type FilemanagerActions<TMethodsConfig extends Record<string, any>> = {
  [K in keyof TMethodsConfig as EventName<K & string>]?: (
    ev: TMethodsConfig[K],
  ) => void;
} & {
  [key: `on${string}`]: (ev?: any) => void;
};
