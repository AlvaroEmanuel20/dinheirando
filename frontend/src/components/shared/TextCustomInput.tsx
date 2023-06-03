import { TextInput, TextInputProps } from '@mantine/core';

export default function TextCustomInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      styles={(theme) => ({
        input: {
          '&:focus-within': {
            borderColor: theme.colors.violet[6],
          },
        },
      })}
    />
  );
}
