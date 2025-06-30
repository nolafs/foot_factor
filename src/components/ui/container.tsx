import { clsx } from 'clsx'
// todo: replace this bounded component with the one from the design system
export function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={clsx(className, 'px-6 lg:px-8')}>
      <div className="mx-auto max-w-2xl lg:max-w-8xl">{children}</div>
    </div>
  )
}
