import { IconType } from 'react-icons';

type DynamicIconProps = {
  icon: IconType;
  width: number;
  height: number;
};

export function DynamicIcon({ icon, width, height }: DynamicIconProps) {
  const Icon = icon;

  return (
    <Icon style={{ width: `${width / 16}rem`, height: `${height / 16}rem` }} />
  );
}
