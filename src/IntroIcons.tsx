// Small line drawings that sit in the intro's text. Drawn in Figma; they paint with
// currentColor so the stylesheet picks their color and they follow the theme.

interface IconProps {
  className: string | undefined;
}

export function WaveIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 53 52" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M17.2916 27.3688L21.0016 21.0643C21.8793 19.5719 21.3589 17.6635 19.8378 16.8024C18.3167 15.9412 16.3716 16.4519 15.4939 17.9443L11.2539 25.1494C6.86338 32.6104 9.46885 42.1513 17.0733 46.459C24.6777 50.7667 34.4022 48.2104 38.7927 40.7494L47.2727 26.3392C48.1504 24.8468 47.6299 22.9384 46.1088 22.0772C44.5877 21.2161 42.6426 21.7268 41.7649 23.2192L36.9949 31.3249L44.9449 17.8153C45.8226 16.3229 45.3021 14.4145 43.781 13.5534C42.2599 12.6923 40.3149 13.2029 39.4372 14.6953L32.5472 26.4036L33.6072 24.6024L41.5572 11.0928C42.4349 9.60036 41.9144 7.69197 40.3933 6.83085C38.8722 5.96973 36.9271 6.48036 36.0494 7.97276L28.0994 21.4824L27.0394 23.2836L34.9894 9.77405C35.8671 8.28165 35.3466 6.37324 33.8255 5.51212C32.3044 4.651 30.3593 5.16165 29.4816 6.65405L21.5316 20.1636"
        stroke="currentColor"
        strokeWidth="3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 70 38" fill="none" aria-hidden="true" focusable="false">
      <path d="M1.49976 35.867L68.4998 35.5081" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M34.8438 10.6416C45.4226 10.6417 53.998 19.218 53.998 29.7969C53.998 31.5431 53.763 33.2343 53.3252 34.8418H48.8652C49.4322 33.2662 49.7421 31.5677 49.7422 29.7969C49.7422 21.5689 43.0717 14.8985 34.8438 14.8984C26.6157 14.8984 19.9453 21.5688 19.9453 29.7969C19.9454 31.5678 20.2552 33.2662 20.8223 34.8418H16.3613C15.9235 33.2343 15.6885 31.543 15.6885 29.7969C15.6885 19.2179 24.2648 10.6416 34.8438 10.6416ZM11.4316 31.9248H5.04688V27.668H11.4316V31.9248ZM64.6396 31.9248H58.2549V27.668H64.6396V31.9248ZM15.6328 16.2471L13.5049 19.9336L7.97461 16.7412L10.1035 13.0547L15.6328 16.2471ZM61.7119 16.7412L56.1826 19.9336L54.0547 16.2471L59.584 13.0547L61.7119 16.7412ZM24.9814 8.45801L21.2949 10.5859L18.1025 5.05664L21.7881 2.92773L24.9814 8.45801ZM51.585 5.05664L48.3926 10.5859L44.7061 8.45801L47.8984 2.92773L51.585 5.05664ZM36.9717 6.38477H32.7148V0H36.9717V6.38477Z"
        fill="currentColor"
      />
    </svg>
  );
}

const ARROW_PATH = 'M20 7.36133L10.25 14.7227V10.8613H0V3.86133H10.25V0L20 7.36133Z';
// Mask ids are page-wide, and there is only ever one arrow.
const ARROW_MASK_ID = 'intro-arrow';

// The outline is a stroke masked to the arrow's own shape, so only the inner half
// shows and the outline stays inside the arrow.
export function ArrowIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 15" fill="none" aria-hidden="true" focusable="false">
      <mask id={ARROW_MASK_ID} fill="white">
        <path d={ARROW_PATH} />
      </mask>
      <path d={ARROW_PATH} stroke="currentColor" strokeWidth="4" mask={`url(#${ARROW_MASK_ID})`} />
    </svg>
  );
}

const MOON_PATH =
  'M33.0449 6.10156C42.3016 9.07662 49.001 17.7556 49.001 28.001C49.001 40.7035 38.7035 51.001 26.001 51.001C18.0794 51.001 11.0938 46.9958 6.95703 40.9004C9.17711 41.6139 11.5438 42.001 14.001 42.001C26.7035 42.001 37.001 31.7035 37.001 19.001C37.001 14.22 35.5416 9.78029 33.0449 6.10156Z';
// Mask ids are page-wide, and there is only ever one moon.
const MOON_MASK_ID = 'intro-moon';

export function MoonIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 49 51" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M2 25.5C6.5266 25.5 8.5 23.5955 8.5 19C8.5 23.5955 10.4597 25.5 15 25.5C10.4597 25.5 8.5 27.4597 8.5 32C8.5 27.4597 6.5266 25.5 2 25.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M15 8.5C19.5266 8.5 21.5 6.59554 21.5 2C21.5 6.59554 23.4597 8.5 28 8.5C23.4597 8.5 21.5 10.4597 21.5 15C21.5 10.4597 19.5266 8.5 15 8.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* The crescent's outline is a stroke masked to its own shape, so only the
          inner half shows and the outline stays inside the moon. */}
      <mask id={MOON_MASK_ID} fill="white">
        <path d={MOON_PATH} />
      </mask>
      <path d={MOON_PATH} stroke="currentColor" strokeWidth="6" mask={`url(#${MOON_MASK_ID})`} />
    </svg>
  );
}
