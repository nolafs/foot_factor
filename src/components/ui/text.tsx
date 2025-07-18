import {cn} from '@/lib/utils';
import {type SelectField} from '@prismicio/client';


type HeadingProps = {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'header';
  dark?: boolean;
  primary?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: SelectField | string | undefined;
} & React.ComponentPropsWithoutRef<'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'header'>;

export function Heading({ className, as: Element = 'h2', dark = false, primary = false, color, size, ...props }: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={cn('font-medium font-heading leading-tight tracking-tighter',
        primary && `text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl xl:leading-[65px] mb-10`,
        !size && !primary && 'text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl mb-5',
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
        'inline-flex items-center h-5 px-2.5 py-0.5 gap-0.5 shadow-[0px_1px_2px_0px_rgba(105,81,255,0.05)]  text-xs/5 font-semibold uppercase leading-none w-fit text-slate-500 bg-primary-200 rounded-full',
      )}
    />
  );
}

type LeadProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: SelectField | string | undefined;
}

export function Lead({ className, size, color, ...props }: LeadProps & React.ComponentPropsWithoutRef<'p'>) {
  return <p className={cn(className,
      'font-medium tracking-tight leading-tight',
      !size && 'text-lg sm:text-xl',
      size === 'sm' && 'text-sm sm:text-base',
      size === 'md' && 'text-sm sm:text-sm md:text-lg',
      size === 'lg' && 'text-base sm:text-lg md:text-xl',
      size === 'xl' && 'text-2xl sm:text-2xl xl:text-3xl',
      !color && 'text-slate-500',
      color === 'Primary' && 'text-primary-500',
      color === 'Light' && 'text-slate-200',
      color === 'White' && 'text-white',
  )

  } {...props} />;
}

type BodyProps = {
  className?: string;
  color?: SelectField | string | undefined;
}

export function Body({className, color, ...props}: React.ComponentPropsWithoutRef<'div'> & BodyProps) {
  return <div className={cn('w-full flex flex-col', className,
      'prose prose-sm md:prose-base lg:prose-lg max-w-none !leading-tight md:!leading-normal',
      'prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-headings:font-heading',
      color !== 'Primary' && 'prose-strong:text-primary-950 prose-headings:!text-primary-950  prose-headings:mt-0 text-slate-500 ',
      color === 'Primary' && 'prose-strong:!text-primary-400 prose-headings:!text-white prose-p:!text-primary-300 prose-ul:!text-primary-300 prose-headings:mt-0 text-primary-500 ',
      color === 'Light' && 'prose-strong:text-primary-950 prose-headings:!text-primary-950 prose-headings:mt-0 text-slate-200 '
  )} {...props} />;
}
