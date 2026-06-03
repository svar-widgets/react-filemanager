import { Tooltip as BaseTooltip } from '@svar-ui/react-core';
import { getID } from '@svar-ui/lib-dom';

function Tooltip({
  api,
  at = 'point',
  content: Content,
  overflow = false,
  resolver,
  ...restProps
}) {
  function defaultResolver(element) {
    if (!api) return null;

    if (element.classList.contains('wx-item')) {
      const id = getID(element);
      if (!id) return null;
      const file = api.getFile(id);
      if (!file) return null;
      if (overflow) {
        const nameEl = element.querySelector('.wx-name');
        const startEl = nameEl?.firstElementChild;
        if (!startEl || startEl.scrollWidth <= startEl.clientWidth) {
          return null;
        }
      }
      if (Content) {
        return { api, data: { file } };
      } else {
        return file.name;
      }
    }

    return null;
  }

  return (
    <BaseTooltip
      at={at}
      content={Content}
      resolver={resolver || defaultResolver}
      {...restProps}
    />
  );
}

export default Tooltip;
