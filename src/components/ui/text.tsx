import { cn } from '@/lib/utils';
import { type SelectField } from '@prismicio/client';

type HeadingProps = {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'header';
  dark?: boolean;
  primary?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: SelectField | string | undefined;
} & React.ComponentPropsWithoutRef<'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'header'>;

export function Heading({
  className,
  as: Element = 'h2',
  dark = false,
  primary = false,
  color,
  size,
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={cn(
        'font-heading font-medium leading-tight tracking-tighter',
        primary && `mb-10 text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl xl:leading-[65px]`,
        !size && !primary && 'mb-5 text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl',
        size === 'sm' && 'text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl',
        size === 'md' && 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl',
        size === 'lg' && 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
        size === 'xl' && 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
        className,
        color === 'Primary' && 'text-primary-500',
        color === 'Light' && 'text-primary-200',
        color === 'White' && 'text-white',
      )}
    />
  );
}

export function Subheading({ className, as: Element = 'h2', dark = false, ...props }: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={cn(
        className,
        'inline-flex h-5 w-fit items-center gap-0.5 rounded-full bg-primary-200 px-2.5 py-0.5 text-xs/5 font-semibold uppercase leading-none text-slate-500 shadow-[0px_1px_2px_0px_rgba(105,81,255,0.05)]',
      )}
    />
  );
}

type LeadProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: SelectField | string | undefined;
};

export function Lead({ className, size, color, ...props }: LeadProps & React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={cn(
        className,
        'font-medium leading-tight tracking-tight',
        !size && 'text-lg sm:text-lg md:text-lg lg:text-xl',
        size === 'sm' && 'text-sm sm:text-base',
        size === 'md' && 'text-sm sm:text-sm md:text-lg',
        size === 'lg' && 'text-base sm:text-lg md:text-xl',
        size === 'xl' && 'text-2xl sm:text-2xl xl:text-3xl',
        !color && 'text-slate-600',
        color === 'Primary' && 'text-primary-500',
        color === 'Light' && 'text-slate-200',
        color === 'White' && 'text-white',
      )}
      {...props}
    />
  );
}

type BodyProps = {
  className?: string;
  color?: SelectField | string | undefined;
};

export function Body({ className, color, ...props }: React.ComponentPropsWithoutRef<'div'> & BodyProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col',
        className,
        'prose prose-sm max-w-none !leading-tight md:prose-base lg:prose-lg md:!leading-normal',
        'prose-headings:font-heading prose-a:text-accent prose-a:no-underline hover:prose-a:underline',
        color !== 'Primary' &&
          'text-primary-400 prose-headings:mt-0 prose-headings:!text-primary-950 prose-strong:text-primary-950',
        color === 'Primary' &&
          'text-primary-500 prose-headings:mt-0 prose-headings:!text-white prose-p:!text-primary-300 prose-strong:!text-primary-400 prose-ul:!text-primary-400',
        color === 'Light' &&
          'text-slate-200 prose-headings:mt-0 prose-headings:!text-primary-950 prose-strong:text-primary-950',
        color === 'Dark' &&
          'text-primary-600 prose-headings:mt-0 prose-headings:!text-primary-950 prose-strong:text-primary-950',
        color === 'Accent' &&
          'text-primary-800 prose-headings:mt-0 prose-headings:!text-primary-950 prose-strong:text-primary-950',
      )}
      {...props}
    />
  );
}
