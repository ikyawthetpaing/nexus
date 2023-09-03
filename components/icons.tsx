import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from "react-native-svg";

interface IconProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  filled?: boolean;
}

const defaultIconProps: IconProps = {
  size: 28,
  strokeWidth: 2,
  color: "#000000",
  filled: false,
};

export const Icons = {
  logo: ({ ...props }: SvgProps) => {
    return (
      <Svg viewBox="0 0 235.83920418129168 60" {...props}>
        <Defs>
          <LinearGradient
            gradientTransform="rotate(25)"
            id="09405742-9446-4e07-92d2-259b1ac08d4b"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor={"rgb(233, 13, 218)"} stopOpacity={1} />
            <Stop
              offset="100%"
              stopColor={"rgb(21, 207, 241)"}
              stopOpacity={1}
            ></Stop>
          </LinearGradient>
        </Defs>
        <G
          id="9bde7bb8-2a76-4cf1-a1b6-b0e48698c8e5"
          fill="url(#09405742-9446-4e07-92d2-259b1ac08d4b)"
          transform="matrix(6.0301508693628145,0,0,6.0301508693628145,-9.346737309630043,-25.326632024326663)"
        >
          <Path d="M6.41 4.20L6.87 4.20L6.87 14L6.23 14L2.02 4.90L2.02 14L1.55 14L1.55 4.20L2.20 4.20L6.41 13.30L6.41 4.20ZM13.02 6.83L13.02 6.83Q13.90 6.83 14.52 7.27L14.52 7.27L14.52 7.27Q15.13 7.71 15.44 8.46L15.44 8.46L15.44 8.46Q15.75 9.20 15.75 10.12L15.75 10.12L15.75 10.12Q15.75 10.39 15.74 10.51L15.74 10.51L10.53 10.51L10.53 10.51Q10.54 12.03 11.17 12.86L11.17 12.86L11.17 12.86Q11.80 13.69 12.98 13.69L12.98 13.69L12.98 13.69Q13.85 13.69 14.39 13.31L14.39 13.31L14.39 13.31Q14.92 12.94 15.19 12.45L15.19 12.45L15.68 12.71L15.68 12.71Q15.33 13.24 14.66 13.70L14.66 13.70L14.66 13.70Q13.99 14.15 12.98 14.15L12.98 14.15L12.98 14.15Q11.66 14.15 10.84 13.23L10.84 13.23L10.84 13.23Q10.01 12.31 10.01 10.49L10.01 10.49L10.01 10.49Q10.01 9.27 10.43 8.44L10.43 8.44L10.43 8.44Q10.85 7.62 11.54 7.22L11.54 7.22L11.54 7.22Q12.22 6.83 13.02 6.83L13.02 6.83ZM10.54 10.07L15.19 10.07L15.19 10.07Q15.22 9.38 14.99 8.74L14.99 8.74L14.99 8.74Q14.76 8.11 14.25 7.70L14.25 7.70L14.25 7.70Q13.75 7.29 12.99 7.29L12.99 7.29L12.99 7.29Q12.01 7.29 11.33 8.00L11.33 8.00L11.33 8.00Q10.64 8.71 10.54 10.07L10.54 10.07ZM23.90 7L21.67 10.46L23.90 14L23.34 14L21.28 10.68L20.58 10.68L18.52 14L17.96 14L20.19 10.46L17.96 7L18.52 7L20.58 10.23L21.28 10.23L23.34 7L23.90 7ZM32.12 14L31.64 14L31.64 12.89L31.64 12.89Q31.25 13.47 30.59 13.80L30.59 13.80L30.59 13.80Q29.93 14.14 29.11 14.14L29.11 14.14L29.11 14.14Q28.08 14.14 27.51 13.54L27.51 13.54L27.51 13.54Q26.94 12.94 26.94 11.35L26.94 11.35L26.94 6.99L27.40 6.99L27.40 11.07L27.40 11.07Q27.40 12.00 27.53 12.54L27.53 12.54L27.53 12.54Q27.66 13.09 28.06 13.38L28.06 13.38L28.06 13.38Q28.45 13.68 29.20 13.68L29.20 13.68L29.20 13.68Q30.23 13.68 30.82 13.14L30.82 13.14L30.82 13.14Q31.42 12.60 31.64 12.04L31.64 12.04L31.64 6.99L32.10 6.99L32.10 12.59L32.12 14ZM37.83 14.15L37.83 14.15Q36.95 14.15 36.20 13.92L36.20 13.92L36.20 13.92Q35.45 13.68 35.07 13.30L35.07 13.30L35.55 12.95L35.55 12.95Q35.85 13.30 36.48 13.50L36.48 13.50L36.48 13.50Q37.10 13.69 37.86 13.69L37.86 13.69L37.86 13.69Q38.74 13.69 39.43 13.29L39.43 13.29L39.43 13.29Q40.12 12.89 40.12 12.04L40.12 12.04L40.12 12.04Q40.12 11.45 39.52 11.14L39.52 11.14L39.52 11.14Q38.92 10.82 38.42 10.69L38.42 10.69L38.42 10.69Q37.91 10.56 37.80 10.53L37.80 10.53L37.80 10.53Q37.69 10.50 37.00 10.32L37.00 10.32L37.00 10.32Q36.30 10.14 35.80 9.70L35.80 9.70L35.80 9.70Q35.31 9.25 35.31 8.64L35.31 8.64L35.31 8.64Q35.31 8.05 35.71 7.64L35.71 7.64L35.71 7.64Q36.11 7.22 36.72 7.03L36.72 7.03L36.72 7.03Q37.32 6.83 37.95 6.83L37.95 6.83L37.95 6.83Q38.82 6.83 39.48 7.10L39.48 7.10L39.48 7.10Q40.14 7.38 40.36 7.77L40.36 7.77L39.87 8.08L39.87 8.08Q39.62 7.66 39.09 7.48L39.09 7.48L39.09 7.48Q38.56 7.29 37.95 7.29L37.95 7.29L37.95 7.29Q37.23 7.29 36.53 7.60L36.53 7.60L36.53 7.60Q35.84 7.91 35.84 8.64L35.84 8.64L35.84 8.64Q35.84 9.25 36.38 9.54L36.38 9.54L36.38 9.54Q36.92 9.83 37.37 9.93L37.37 9.93L37.37 9.93Q37.83 10.02 37.93 10.05L37.93 10.05L37.93 10.05Q38.67 10.23 39.17 10.41L39.17 10.41L39.17 10.41Q39.68 10.58 40.17 10.99L40.17 10.99L40.17 10.99Q40.66 11.40 40.66 12.03L40.66 12.03L40.66 12.03Q40.66 12.70 40.26 13.18L40.26 13.18L40.26 13.18Q39.86 13.66 39.21 13.91L39.21 13.91L39.21 13.91Q38.56 14.15 37.83 14.15L37.83 14.15Z" />
        </G>
      </Svg>
    );
  },

  home: (iconProps: IconProps) => {
    const { size, color, strokeWidth, filled }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {filled ? (
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274ZM9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
            fill={color}
          />
        ) : (
          <>
            <Path
              d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M15 18H9"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        )}
      </Svg>
    );
  },
  search: (iconProps: IconProps) => {
    const { size, color, strokeWidth, filled }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {filled ? (
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.7883 21.7883C22.0706 21.506 22.0706 21.0483 21.7883 20.7659L18.1224 17.1002C19.4884 15.5007 20.3133 13.425 20.3133 11.1566C20.3133 6.09956 16.2137 2 11.1566 2C6.09956 2 2 6.09956 2 11.1566C2 16.2137 6.09956 20.3133 11.1566 20.3133C13.4249 20.3133 15.5006 19.4885 17.1 18.1225L20.7659 21.7883C21.0483 22.0706 21.506 22.0706 21.7883 21.7883Z"
            fill={color}
          />
        ) : (
          <>
            <Circle
              cx="11.5"
              cy="11.5"
              r="9.5"
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M18.5 18.5L22 22"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        )}
      </Svg>
    );
  },
  add: (iconProps: IconProps) => {
    const { size, color, strokeWidth, filled }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {filled ? (
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM12 8.25C12.4142 8.25 12.75 8.58579 12.75 9V11.25H15C15.4142 11.25 15.75 11.5858 15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H12.75L12.75 15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15V12.75H9C8.58579 12.75 8.25 12.4142 8.25 12C8.25 11.5858 8.58579 11.25 9 11.25H11.25L11.25 9C11.25 8.58579 11.5858 8.25 12 8.25Z"
            fill={color}
          />
        ) : (
          <>
            <Path
              d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        )}
      </Svg>
    );
  },
  mail: (iconProps: IconProps) => {
    const { size, color, strokeWidth, filled }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {filled ? (
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.17157 5.17157C2 6.34315 2 8.22876 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H14C17.7712 20 19.6569 20 20.8284 18.8284C22 17.6569 22 15.7712 22 12C22 8.22876 22 6.34315 20.8284 5.17157C19.6569 4 17.7712 4 14 4H10C6.22876 4 4.34315 4 3.17157 5.17157ZM18.5762 7.51986C18.8413 7.83807 18.7983 8.31099 18.4801 8.57617L16.2837 10.4066C15.3973 11.1452 14.6789 11.7439 14.0448 12.1517C13.3843 12.5765 12.7411 12.8449 12 12.8449C11.2589 12.8449 10.6157 12.5765 9.95518 12.1517C9.32112 11.7439 8.60271 11.1452 7.71636 10.4066L5.51986 8.57617C5.20165 8.31099 5.15866 7.83807 5.42383 7.51986C5.68901 7.20165 6.16193 7.15866 6.48014 7.42383L8.63903 9.22291C9.57199 10.0004 10.2197 10.5384 10.7666 10.8901C11.2959 11.2306 11.6549 11.3449 12 11.3449C12.3451 11.3449 12.7041 11.2306 13.2334 10.8901C13.7803 10.5384 14.428 10.0004 15.361 9.22291L17.5199 7.42383C17.8381 7.15866 18.311 7.20165 18.5762 7.51986Z"
            fill={color}
          />
        ) : (
          <>
            <Path
              d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        )}
      </Svg>
    );
  },
  profile: (iconProps: IconProps) => {
    const { size, color, strokeWidth, filled }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {filled ? (
          <>
            <Circle cx="12" cy="6" r="4" fill={color} />
            <Path
              d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
              fill={color}
            />
          </>
        ) : (
          <>
            <Circle
              cx="12"
              cy="6"
              r="4"
              stroke={color}
              strokeWidth={strokeWidth}
            ></Circle>
            <Path
              d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
              stroke={color}
              strokeWidth={strokeWidth}
            />
          </>
        )}
      </Svg>
    );
  },
  bell: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path
          d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    );
  },
  verified: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.5924 3.20027C9.34888 3.4078 9.22711 3.51158 9.09706 3.59874C8.79896 3.79854 8.46417 3.93721 8.1121 4.00672C7.95851 4.03705 7.79903 4.04977 7.48008 4.07522C6.6787 4.13918 6.278 4.17115 5.94371 4.28923C5.17051 4.56233 4.56233 5.17051 4.28923 5.94371C4.17115 6.278 4.13918 6.6787 4.07522 7.48008C4.04977 7.79903 4.03705 7.95851 4.00672 8.1121C3.93721 8.46417 3.79854 8.79896 3.59874 9.09706C3.51158 9.22711 3.40781 9.34887 3.20027 9.5924C2.67883 10.2043 2.4181 10.5102 2.26522 10.8301C1.91159 11.57 1.91159 12.43 2.26522 13.1699C2.41811 13.4898 2.67883 13.7957 3.20027 14.4076C3.40778 14.6511 3.51158 14.7729 3.59874 14.9029C3.79854 15.201 3.93721 15.5358 4.00672 15.8879C4.03705 16.0415 4.04977 16.201 4.07522 16.5199C4.13918 17.3213 4.17115 17.722 4.28923 18.0563C4.56233 18.8295 5.17051 19.4377 5.94371 19.7108C6.278 19.8288 6.6787 19.8608 7.48008 19.9248C7.79903 19.9502 7.95851 19.963 8.1121 19.9933C8.46417 20.0628 8.79896 20.2015 9.09706 20.4013C9.22711 20.4884 9.34887 20.5922 9.5924 20.7997C10.2043 21.3212 10.5102 21.5819 10.8301 21.7348C11.57 22.0884 12.43 22.0884 13.1699 21.7348C13.4898 21.5819 13.7957 21.3212 14.4076 20.7997C14.6511 20.5922 14.7729 20.4884 14.9029 20.4013C15.201 20.2015 15.5358 20.0628 15.8879 19.9933C16.0415 19.963 16.201 19.9502 16.5199 19.9248C17.3213 19.8608 17.722 19.8288 18.0563 19.7108C18.8295 19.4377 19.4377 18.8295 19.7108 18.0563C19.8288 17.722 19.8608 17.3213 19.9248 16.5199C19.9502 16.201 19.963 16.0415 19.9933 15.8879C20.0628 15.5358 20.2015 15.201 20.4013 14.9029C20.4884 14.7729 20.5922 14.6511 20.7997 14.4076C21.3212 13.7957 21.5819 13.4898 21.7348 13.1699C22.0884 12.43 22.0884 11.57 21.7348 10.8301C21.5819 10.5102 21.3212 10.2043 20.7997 9.5924C20.5922 9.34887 20.4884 9.22711 20.4013 9.09706C20.2015 8.79896 20.0628 8.46417 19.9933 8.1121C19.963 7.95851 19.9502 7.79903 19.9248 7.48008C19.8608 6.6787 19.8288 6.278 19.7108 5.94371C19.4377 5.17051 18.8295 4.56233 18.0563 4.28923C17.722 4.17115 17.3213 4.13918 16.5199 4.07522C16.201 4.04977 16.0415 4.03705 15.8879 4.00672C15.5358 3.93721 15.201 3.79854 14.9029 3.59874C14.7729 3.51158 14.6511 3.40781 14.4076 3.20027C13.7957 2.67883 13.4898 2.41811 13.1699 2.26522C12.43 1.91159 11.57 1.91159 10.8301 2.26522C10.5102 2.4181 10.2043 2.67883 9.5924 3.20027ZM16.3735 9.86314C16.6913 9.5453 16.6913 9.03 16.3735 8.71216C16.0557 8.39433 15.5403 8.39433 15.2225 8.71216L10.3723 13.5624L8.77746 11.9676C8.45963 11.6498 7.94432 11.6498 7.62649 11.9676C7.30866 12.2854 7.30866 12.8007 7.62649 13.1186L9.79678 15.2889C10.1146 15.6067 10.6299 15.6067 10.9478 15.2889L16.3735 9.86314Z"
          fill={color}
        />
      </Svg>
    );
  },
  heart: (iconProps: IconProps) => {
    const { size, color, filled }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {filled ? (
          <Path
            d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
            fill={color}
          />
        ) : (
          <Path
            d="M8.96173 18.9109L9.42605 18.3219L8.96173 18.9109ZM12 5.50063L11.4596 6.02073C11.601 6.16763 11.7961 6.25063 12 6.25063C12.2039 6.25063 12.399 6.16763 12.5404 6.02073L12 5.50063ZM15.0383 18.9109L15.5026 19.4999L15.0383 18.9109ZM9.42605 18.3219C7.91039 17.1271 6.25307 15.9603 4.93829 14.4798C3.64922 13.0282 2.75 11.3345 2.75 9.1371H1.25C1.25 11.8026 2.3605 13.8361 3.81672 15.4758C5.24723 17.0866 7.07077 18.3752 8.49742 19.4999L9.42605 18.3219ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219Z"
            fill={color}
          />
        )}
      </Svg>
    );
  },
  comment: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </Svg>
    );
  },
  share: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M9 12C9 13.3807 7.88071 14.5 6.5 14.5C5.11929 14.5 4 13.3807 4 12C4 10.6193 5.11929 9.5 6.5 9.5C7.88071 9.5 9 10.6193 9 12Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path
          d="M14 6.5L9 10"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d="M14 17.5L9 14"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d="M19 18.5C19 19.8807 17.8807 21 16.5 21C15.1193 21 14 19.8807 14 18.5C14 17.1193 15.1193 16 16.5 16C17.8807 16 19 17.1193 19 18.5Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path
          d="M19 5.5C19 6.88071 17.8807 8 16.5 8C15.1193 8 14 6.88071 14 5.5C14 4.11929 15.1193 3 16.5 3C17.8807 3 19 4.11929 19 5.5Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </Svg>
    );
  },
  // settings: (iconProps: IconsProps) => {
  //   const { size, viewBox, color, strokeWidth }: IconsProps = {
  //     ...defaultSvgProps,
  //     ...iconProps,
  //   };
  //   return (
  //     <Svg width={size} height={size} viewBox={viewBox} fill="none">
  //       <Circle
  //         cx="12"
  //         cy="12"
  //         r="3"
  //         stroke={color}
  //         strokeWidth={strokeWidth}
  //       />
  //       <Path
  //         d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z"
  //         stroke={color}
  //         strokeWidth={strokeWidth}
  //       />
  //     </Svg>
  //   );
  // },
  menu: (iconProps: IconProps) => {
    const { size, color }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6Z"
          fill={color}
        />
        <Path
          d="M4 18C4 17.4477 4.44772 17 5 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18Z"
          fill={color}
        />
        <Path
          d="M11 11C10.4477 11 10 11.4477 10 12C10 12.5523 10.4477 13 11 13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H11Z"
          fill={color}
        />
      </Svg>
    );
  },
  world: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M22 12C22 13.3132 21.7413 14.6136 21.2388 15.8268C20.7362 17.0401 19.9997 18.1425 19.0711 19.0711C18.1425 19.9997 17.0401 20.7362 15.8268 21.2388C14.6136 21.7413 13.3132 22 12 22C10.6868 22 9.38642 21.7413 8.17317 21.2388C6.95991 20.7362 5.85752 19.9997 4.92893 19.0711C4.00035 18.1425 3.26375 17.0401 2.7612 15.8268C2.25866 14.6136 2 13.3132 2 12C2 10.6868 2.25866 9.38642 2.76121 8.17316C3.26375 6.95991 4.00035 5.85752 4.92893 4.92893C5.85752 4.00035 6.95991 3.26375 8.17317 2.7612C9.38642 2.25866 10.6868 2 12 2C13.3132 2 14.6136 2.25866 15.8268 2.76121C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12L22 12Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path
          d="M16 12C16 13.3132 15.8965 14.6136 15.6955 15.8268C15.4945 17.0401 15.1999 18.1425 14.8284 19.0711C14.457 19.9997 14.016 20.7362 13.5307 21.2388C13.0454 21.7413 12.5253 22 12 22C11.4747 22 10.9546 21.7413 10.4693 21.2388C9.98396 20.7362 9.54301 19.9997 9.17157 19.0711C8.80014 18.1425 8.5055 17.0401 8.30448 15.8268C8.10346 14.6136 8 13.3132 8 12C8 10.6868 8.10346 9.38642 8.30448 8.17316C8.5055 6.95991 8.80014 5.85752 9.17157 4.92893C9.54301 4.00035 9.98396 3.26375 10.4693 2.7612C10.9546 2.25866 11.4747 2 12 2C12.5253 2 13.0454 2.25866 13.5307 2.76121C14.016 3.26375 14.457 4.00035 14.8284 4.92893C15.1999 5.85752 15.4945 6.95991 15.6955 8.17317C15.8965 9.38642 16 10.6868 16 12L16 12Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path
          d="M2 12H22"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    );
  },
  arrowLeft: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M20 12H4M4 12L10 6M4 12L10 18"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  },
  closeCircle: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path
          d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    );
  },
  photo: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Circle cx="16" cy="8" r="2" stroke={color} strokeWidth={strokeWidth} />
        <Path
          d="M5 13.307L5.81051 12.5542C6.73658 11.6941 8.18321 11.7424 9.04988 12.6623L11.6974 15.4727C12.2356 16.0439 13.1166 16.1209 13.7457 15.6516C14.6522 14.9753 15.9144 15.0522 16.7322 15.8334L19 18"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    );
  },
  earth: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path
          d="M6 4.71053C6.78024 5.42105 8.38755 7.36316 8.57481 9.44737C8.74984 11.3955 10.0357 12.9786 12 13C12.7549 13.0082 13.5183 12.4629 13.5164 11.708C13.5158 11.4745 13.4773 11.2358 13.417 11.0163C13.3331 10.7108 13.3257 10.3595 13.5 10C14.1099 8.74254 15.3094 8.40477 16.2599 7.72186C16.6814 7.41898 17.0659 7.09947 17.2355 6.84211C17.7037 6.13158 18.1718 4.71053 17.9377 4"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path
          d="M22 13C21.6706 13.931 21.4375 16.375 17.7182 16.4138C17.7182 16.4138 14.4246 16.4138 13.4365 18.2759C12.646 19.7655 13.1071 21.3793 13.4365 22"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </Svg>
    );
  },
  checklist: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path
          d="M6 15.8L7.14286 17L10 14"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M6 8.8L7.14286 10L10 7"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M13 9L18 9"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d="M13 16L18 16"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    );
  },
  mapPoint: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C6.55332 19.8124 4 14.6055 4 10.1433Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx="12"
          cy="10"
          r="3"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </Svg>
    );
  },
  videoFramePlay: (iconProps: IconProps) => {
    const { size, color, strokeWidth }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path
          d="M21.5 17L2.5 17"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d="M21.5 7L2.5 7"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d="M12 2L12 7M12 22L12 17"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d="M17 2.5L17 7M17 21.5L17 17"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d="M7 2.5L7 7M7 21.5L7 17"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d="M14 12C14 11.4722 13.4704 11.1162 12.4112 10.4043C11.3375 9.68271 10.8006 9.3219 10.4003 9.58682C10 9.85174 10 10.5678 10 12C10 13.4322 10 14.1483 10.4003 14.4132C10.8006 14.6781 11.3375 14.3173 12.4112 13.5957C13.4704 12.8838 14 12.5278 14 12Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    );
  },

  LogoIcon: (iconProps: IconProps) => {
    const { size, color }: IconProps = {
      ...defaultIconProps,
      ...iconProps,
    };
    return (
      <Svg width={size} height={size} viewBox="0 0 1024 1024">
        <Path
          d="M368.394 280.52C338.687 288.373 279.956 317.056 250.249 338.227C224.639 356.666 166.932 406.519 166.932 409.933C166.932 411.982 169.664 412.324 173.078 410.958C204.834 396.958 218.151 394.226 261.517 392.86C304.882 391.495 307.956 391.836 339.029 402.421C373.175 413.69 397.077 428.031 400.833 439.641C403.906 449.202 393.321 465.933 381.028 471.055C373.175 474.47 363.614 474.128 331.858 468.665C294.639 462.86 290.883 462.86 259.127 468.323C206.883 477.201 179.908 487.787 139.957 514.762C96.2496 544.811 55.2743 595.006 17.3721 665.688C-5.84729 708.712 -5.84729 716.907 17.7135 691.639C46.0548 661.249 93.8594 632.908 137.908 620.615C161.469 614.127 217.127 614.81 254.005 622.322C292.59 630.176 371.809 659.542 426.443 685.834C532.979 737.736 581.125 752.419 642.246 751.736C678.441 751.395 708.831 743.883 742.294 727.493C781.562 708.371 830.391 667.054 866.586 622.664C889.806 593.981 894.928 586.81 929.757 531.494C980.634 451.933 1000.1 423.25 1011.71 411.982C1018.54 405.495 1024 398.665 1024 396.958C1024 395.251 1018.88 390.47 1012.39 386.031C1006.24 381.592 991.561 367.251 979.952 353.592C952.635 321.154 930.098 305.788 910.976 306.129C893.903 306.471 860.099 322.861 836.879 342.324C808.196 366.226 770.636 388.421 751.514 392.519C713.612 401.055 671.612 388.08 612.539 349.153C595.808 338.227 580.442 328.324 578.393 327.641C576.686 326.958 567.125 321.154 557.222 315.007C547.661 308.519 538.101 303.398 536.393 303.398C534.686 303.398 526.491 299.641 518.296 295.202C498.15 283.934 447.955 272.666 420.296 273.007C407.662 273.007 384.443 276.422 368.394 280.52Z"
          fill={color?.toString()}
        />
      </Svg>
    );
  },
};
