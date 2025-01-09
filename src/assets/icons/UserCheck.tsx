import type React from "react";
import type { SVGIconInterface } from "../../common/interfaces/svg";

const UserCheck: React.FC<SVGIconInterface> = ({ width, height }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={width ?? 180}
		height={height ?? 40}
		fill="none"
	>
		<g clipPath="url(#a)">
			<path
				fill="#125AB3"
				d="M9.5 9.855a4.25 4.25 0 1 0-4.494 0c-1.29.422-2.451 1.211-3.385 2.323a.5.5 0 1 0 .765.643C3.641 11.324 5.37 10.5 7.25 10.5s3.61.824 4.867 2.321a.5.5 0 1 0 .766-.643c-.934-1.112-2.095-1.9-3.383-2.323ZM4 6.25a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm12.354 2.103-2 2a.501.501 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.707l.646.647 1.646-1.647a.5.5 0 1 1 .708.707Z"
			/>
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M.5 0h16v16H.5z" />
			</clipPath>
		</defs>
	</svg>
);
export default UserCheck;
