import { cn } from '@/lib/utils';
import { Platform, TextInput } from 'react-native';

function Input({ className, ...props }: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        'bg-card text-foreground font-sans-medium h-14 w-full min-w-0 flex-row items-center rounded-full px-5 text-lg leading-6',
        props.editable === false && 'opacity-50',
        Platform.select({
          web: cn(
            'placeholder:text-muted-foreground outline-none transition-[color,box-shadow]',
            'focus-visible:ring-ring/40 focus-visible:ring-2'
          ),
          native: 'placeholder:text-muted-foreground/60',
        }),
        className
      )}
      {...props}
    />
  );
}

export { Input };
