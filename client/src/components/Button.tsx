type ButtonProps = {
  text: string;
  color?: string;
};

export function Button({ text }: ButtonProps) {
  return <button>{text}</button>;
}
