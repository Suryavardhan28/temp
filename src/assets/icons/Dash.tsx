import type { SVGIconInterface } from "../../common/interfaces/svg";

const Dash: React.FC<SVGIconInterface> = ({ color, width, height }) => (
	<svg
		width={width || 24}
		height={height || 8}
		viewBox="0 0 24 8"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect width={24} height={8} rx={4} fill={color} />
	</svg>
);
export default Dash;
