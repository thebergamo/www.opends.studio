import { cn } from '@/utils/Helpers';

/* FIXME: update with the design system later */
const Background = (props: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('w-full bg-[#F9B8AB]', props.className)}>
    {props.children}
  </div>
);

export { Background };
