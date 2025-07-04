import {cn} from '@/lib/utils';


type HeadingProps = {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  dark?: boolean;
  primary?: boolean;
} & React.ComponentPropsWithoutRef<'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;

export function Heading({ className, as: Element = 'h2', dark = false, primary = false, ...props }: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={cn(
        className,
        primary ? `font-medium font-heading ${dark && 'text-white'}  text-3xl sm:text-4xl md:text-5xl mb-10 leading-normal lg:text-5xl xl:text-6xl lg:leading-[72px]` :'text-4xl font-heading font-medium tracking-tighter text-primary sm:text-6xl',
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

export function Lead({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return <p className={cn(className, 'text-lg sm:text-xl font-medium text-slate-500')} {...props} />;
}

export function Body({className, ...props}: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cn(className, 'w-full flex flex-col' +
      'prose prose-sm md:prose-base lg:prose-lg max-w-none',
      'prose-a:text-accent prose-a:no-underline hover:prose-a:underline',
      'prose-strong:text-primary-950 prose-headings:!text-primary-950 prose-headings:mt-0 text-slate-500 '
  )} {...props} />;
}
