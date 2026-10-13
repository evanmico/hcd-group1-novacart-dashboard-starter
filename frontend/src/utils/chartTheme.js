/**
 * chartTheme.js — Shared recharts styling (Figma design: blue bars, teal highlight).
 * Recharts needs concrete color values, so these mirror the CSS variables in App.css.
 */

const CHART_COLORS = {
  light: {
    bar: '#1D4FFF', highlight: '#00BFA5', grid: '#E5E9F2', text: '#5A6578',
    cursor: 'rgba(29,79,255,0.06)', tooltipBg: '#FFFFFF', tooltipText: '#1A2332',
  },
  dark: {
    bar: '#6B8AFF', highlight: '#2DD4BF', grid: '#1E3248', text: '#90A4AE',
    cursor: 'rgba(107,138,255,0.12)', tooltipBg: '#132337', tooltipText: '#E8EDF2',
  },
};

export function getChartTheme(dark) {
  const colors = dark ? CHART_COLORS.dark : CHART_COLORS.light;
  return {
    colors,
    axisTick: { fill: colors.text, fontSize: 12 },
    tooltipStyle: {
      background: colors.tooltipBg,
      border: `1px solid ${colors.grid}`,
      borderRadius: 8,
      color: colors.tooltipText,
      fontSize: 13,
    },
  };
}
