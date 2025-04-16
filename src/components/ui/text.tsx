import { clsx } from 'clsx';

type HeadingProps = {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  dark?: boolean;
} & React.ComponentPropsWithoutRef<'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;

export function Heading({ className, as: Element = 'h2', dark = false, ...props }: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'text-4xl font-heading font-medium tracking-tighter text-primary data-[dark]:text-white sm:text-6xl',
      )}
    />
  );
}

export function Subheading({ className, as: Element = 'h2', dark = false, ...props }: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'inline-flex items-center h-5 px-2.5 py-0.5 gap-0.5 shadow-[0px_1px_2px_0px_rgba(105,81,255,0.05)]  text-xs/5 font-semibold uppercase leading-none w-fit text-primary-500 bg-primary-200 rounded-full',
      )}
    />
  );
}

export function Lead({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return <p className={clsx(className, 'text-lg sm:text-xl font-medium text-primary-500')} {...props} />;
}
