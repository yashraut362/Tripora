import { cn } from '@/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

const textVariants = cva(
  cn(
    'text-foreground font-sans text-base',
    Platform.select({
      web: 'select-text',
    })
  ),
  {
    variants: {
      variant: {
        default: '',
        // Android can't synthesize weights on custom fonts,
        // so weight lives in the font family, never in font-bold classes.
        h1: 'font-sans-bold text-[34px] leading-[42px] tracking-tight',
        h2: 'font-sans-bold text-2xl leading-8',
        h3: 'font-sans-bold text-xl leading-7',
        h4: 'font-sans-semibold text-lg',
        p: 'mt-3 leading-7',
        blockquote: 'mt-4 border-l-2 border-border pl-3 text-lg',
        lead: 'text-muted-foreground text-xl',
        large: 'font-sans-semibold text-lg',
        small: 'font-sans-medium text-sm leading-none',
        muted: 'text-muted-foreground font-sans-medium text-sm leading-5',
        eyebrow: 'text-muted-foreground font-sans-bold text-[11px] uppercase tracking-[3px]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext };
