import { IconType } from 'react-icons';

type DynamicIconProps = {
  icon: IconType;
  width: number;
  height: number;
  color?: string;
};

export function DynamicIcon({ icon, width, height, color }: DynamicIconProps) {
  const Icon = icon;

  return (
    <Icon
      color={color ?? 'black'}
      style={{ width: `${width / 16}rem`, height: `${height / 16}rem` }}
    />
  );
}
