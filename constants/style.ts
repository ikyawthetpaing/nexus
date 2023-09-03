type Styles = {
  padding: number;
  radius: number;
  borderWidth: number
};

const styles: Styles = {
  padding: 12,
  radius: 8,
  borderWidth: 0.5,
};

export function getStyles(): Styles {
  return styles;
}
