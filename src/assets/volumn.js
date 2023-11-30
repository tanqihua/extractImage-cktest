import * as React from "react";
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={28}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeMiterlimit={10}
      d="m20.392 13.71-9.696-9.695L1 13.71l9.696 9.696 9.696-9.695Z"
    />
    <path
      stroke="#fff"
      strokeMiterlimit={10}
      d="M32.058 13.707 22.363 4.01l-9.696 9.695 9.696 9.696 9.695-9.696Z"
    />
    <path
      fill="#000"
      stroke="#fff"
      strokeMiterlimit={10}
      d="M29.305 13.774 16.532 1 3.758 13.774l12.774 12.773 12.773-12.774Z"
    />
    <mask
      id="a"
      width={9}
      height={8}
      x={12}
      y={10}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <path fill="#fff" d="M20.866 10.185h-8.67v7.175h8.67v-7.175Z" />
    </mask>
    <g fill="#fff" mask="url(#a)">
      <path d="M12.627 15.411a.436.436 0 0 1-.434-.434v-2.328a.435.435 0 0 1 .869 0v2.328c0 .239-.195.434-.435.434ZM14.182 16.348a.436.436 0 0 1-.435-.435v-4.205a.435.435 0 0 1 .87 0v4.205c0 .24-.196.435-.435.435ZM17.295 15.411a.436.436 0 0 1-.434-.434v-2.328a.435.435 0 0 1 .869 0v2.328c0 .239-.196.434-.435.434Z" />
    </g>
    <mask
      id="b"
      width={2}
      height={4}
      x={19}
      y={12}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <path fill="#fff" d="M20.843 12.21h-.866v3.201h.866v-3.2Z" />
    </mask>
    <g mask="url(#b)">
      <path
        fill="#fff"
        d="M20.408 15.411a.435.435 0 0 1-.435-.434v-2.328a.435.435 0 0 1 .87 0v2.328c0 .239-.196.434-.435.434Z"
      />
    </g>
    <mask
      id="c"
      width={9}
      height={8}
      x={12}
      y={10}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <path fill="#fff" d="M20.866 10.185h-8.67v7.175h8.67v-7.175Z" />
    </mask>
    <g mask="url(#c)">
      <path
        fill="#fff"
        d="M18.853 16.348a.436.436 0 0 1-.434-.435v-4.205a.436.436 0 0 1 .869 0v4.205c0 .24-.195.435-.435.435Z"
      />
    </g>
    <mask
      id="d"
      width={2}
      height={8}
      x={15}
      y={10}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <path fill="#fff" d="M16.175 10.19h-.873v7.174h.873V10.19Z" />
    </mask>
    <g mask="url(#d)">
      <path
        fill="#fff"
        d="M15.74 17.436a.435.435 0 0 1-.434-.434V10.62a.435.435 0 0 1 .869 0v6.382c0 .239-.196.434-.435.434Z"
      />
    </g>
  </svg>
);
export default SvgComponent;
