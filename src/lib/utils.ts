import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Children, isValidElement, type ReactNode, type ReactElement } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(value: string) {
  if (typeof value !== 'string') return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getFirstChildPropValue(
  children: ReactNode,
  propNameCb: (props: Record<string, any>) => string,
): string | string[] | undefined {
  let propValue: string | string[] | undefined = undefined;

  Children.forEach(children, element => {
    if (!isValidElement(element)) return;
    const props = element.props as Record<string, any>;
    const propName = propNameCb(props);
    if (propName in props) {
      propValue = props[propName];
      return;
    }
  });

  return propValue;
}
