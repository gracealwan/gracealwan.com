import { MeshGradient } from '@paper-design/shaders-react';
import * as styles from './Pool.module.css';

// Settings from the Paper shaders playground (shaders.paper.design/mesh-gradient).
const WATER_COLORS = ['#e92f64', '#ff8fa2', '#ffd105'];
const WATER_ROTATION_DEG = 72;
const WATER_GRAIN_MIXER = 0.01;

// Read once at load. A frozen frame still shows the gradient, just without the drift.
// jsdom (the smoke test) has no matchMedia, so it animates there.
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const WATER_SPEED = globalThis.matchMedia?.(REDUCED_MOTION_QUERY).matches ? 0 : 1;

// The shader sets itself up asynchronously and rejects without WebGL2, which would
// surface as an unhandled rejection (and crash the jsdom smoke test). Skip it there
// and let the stylesheet's fallback gradient fill the water.
const SUPPORTS_WEBGL2 = 'WebGL2RenderingContext' in globalThis;

// Exported from Figma as FINAL GRAPHIC.svg. The viewBox is cropped to the drawing
// so the stylesheet can place the pool's edges against the viewport. Fills live in
// the stylesheet, one class per surface, so a theme change can recolor and animate
// each surface on its own. The water is a WebGL gradient behind the drawing, clipped
// to the water's outline, so it never shows on the deck.
export default function Pool() {
  return (
    <div className={styles.pool} aria-hidden="true">
      <div className={styles.water}>
        {SUPPORTS_WEBGL2 && (
          <MeshGradient
            className={styles.shader}
            colors={WATER_COLORS}
            distortion={1}
            swirl={0}
            grainMixer={WATER_GRAIN_MIXER}
            grainOverlay={0}
            speed={WATER_SPEED}
            rotation={WATER_ROTATION_DEG}
          />
        )}
      </div>
      <svg className={styles.drawing} viewBox="0 662.88 4146.8 1185.23" focusable="false">
        <path
          className={styles['wall-long']}
          d="M0.196854 1441.91L2736.41 662.886L2819 686.696L2736.52 710.139L82.7864 1465.69L0.196854 1441.91Z"
        />
        <path
          className={styles['wall-short']}
          d="M2736.4 710.19L2736.4 662.884L4146.8 1069.08L4064.36 1092.56L2736.4 710.19Z"
        />
        <path
          className={styles.ladder}
          d="M3853.22 1151.7C3853.22 1151.7 3853.16 1127.71 3853.22 1127.12C3853.25 1126.83 3853.38 1125.63 3853.98 1123.98C3854.58 1122.33 3855.6 1121.13 3855.7 1120.87C3855.9 1120.36 3876.7 1087.33 3882.27 1079.51C3887.84 1071.68 3898.06 1069.52 3900.86 1068.77C3902.25 1068.4 3910.83 1067.25 3919.17 1069.95C3927.63 1073.25 3932.64 1078.17 3935.6 1081.28C3937.1 1082.84 3940.31 1086.51 3940.97 1087.61C3941.63 1088.71 3944.64 1093.86 3945.66 1096.49C3947.2 1100.49 3948.55 1103.3 3949.75 1106.76C3951.87 1112.87 3953.44 1119.34 3954.32 1125.91C3955.84 1137.35 3955.16 1220.51 3955.16 1220.51L3942.34 1219.77C3942.34 1219.77 3942.06 1139.67 3941.13 1128.42C3940.67 1122.73 3938.29 1114.03 3936.69 1109.35C3935.08 1104.67 3931.66 1098.2 3930.68 1096.49C3928.67 1093.03 3924.99 1088.14 3921.26 1085.96C3917.53 1083.77 3914.49 1081.47 3908.52 1081.28C3896.41 1080.88 3892.21 1088.39 3892.21 1088.39C3892.21 1088.39 3876.58 1112.74 3870.05 1123.43C3869.58 1124.19 3868.25 1126.52 3867.88 1127.12C3867.6 1127.12 3867.44 1128.85 3867.32 1129.17C3867.32 1131.76 3867.32 1147.81 3867.32 1147.81L3853.22 1151.7Z"
        />
        <ellipse
          className={styles.ladder}
          cx="14.7286"
          cy="7.49357"
          rx="14.7286"
          ry="7.49357"
          transform="matrix(0.987522 0.157479 -0.163388 0.986562 3935.57 1216.22)"
        />
        <path
          className={styles.ladder}
          d="M3759.26 1178.35C3759.26 1178.35 3759.21 1154.36 3759.26 1153.77C3759.29 1153.48 3759.42 1152.28 3760.03 1150.63C3760.63 1148.98 3761.65 1147.78 3761.75 1147.52C3761.95 1147.01 3782.75 1113.98 3788.32 1106.16C3793.89 1098.33 3804.1 1096.17 3806.91 1095.42C3808.3 1095.05 3816.87 1093.9 3825.22 1096.6C3833.68 1099.9 3838.69 1104.82 3841.65 1107.93C3843.14 1109.49 3846.36 1113.15 3847.02 1114.26C3847.68 1115.36 3850.69 1120.51 3851.71 1123.14C3853.25 1127.14 3854.59 1129.94 3855.8 1133.4C3857.92 1139.52 3859.49 1145.99 3860.36 1152.55C3861.89 1164 3861.21 1247.16 3861.21 1247.16L3848.38 1246.41C3848.38 1246.41 3848.1 1166.32 3847.18 1155.07C3846.71 1149.37 3844.34 1140.68 3842.73 1136C3841.13 1131.32 3837.71 1124.85 3836.72 1123.14C3834.72 1119.68 3831.03 1114.79 3827.31 1112.6C3823.58 1110.42 3820.53 1108.12 3814.56 1107.93C3802.46 1107.53 3798.25 1115.04 3798.25 1115.04C3798.25 1115.04 3782.62 1139.39 3776.09 1150.08C3775.63 1150.84 3774.29 1153.16 3773.93 1153.77C3773.65 1153.77 3773.49 1155.5 3773.37 1155.82C3773.37 1158.41 3773.37 1174.46 3773.37 1174.46L3759.26 1178.35Z"
        />
        <ellipse
          className={styles.ladder}
          cx="14.7286"
          cy="7.49357"
          rx="14.7286"
          ry="7.49357"
          transform="matrix(0.987522 0.157479 -0.163388 0.986562 3841.61 1242.87)"
        />
        <path
          className={styles['board-top']}
          d="M3019.26 837.547L3472.7 709.193L3625.91 753.085L3172.46 881.469L3019.26 837.547Z"
        />
        <path
          className={styles['stand-front']}
          d="M3520.05 795.034L3606.67 770.716L3606.66 840.747L3520.05 865.068L3520.05 795.034Z"
        />
        <path
          className={styles['stand-side']}
          d="M3425.63 821.859L3520.06 795.12L3520.05 865.072L3425.63 837.744L3425.63 821.859Z"
        />
        <path
          className={styles['board-tip']}
          d="M3019.26 849.898L3019.26 837.552L3172.42 881.475L3172.42 893.861L3019.26 849.898Z"
        />
        <path
          className={styles['board-edge']}
          d="M3172.46 881.473L3625.91 753.09L3625.91 765.358L3172.46 893.82L3172.46 881.473Z"
        />
      </svg>
    </div>
  );
}
