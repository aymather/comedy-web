import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export type NanoId = string;

export type Props<T extends React.ComponentType<any>> = React.ComponentProps<T>;
