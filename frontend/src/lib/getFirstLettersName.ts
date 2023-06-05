export default function getFirstLettersName(name: string) {
  const parts = name.toUpperCase().split(' ');
  return parts[0] && parts[1]
    ? [parts[0].charAt(0), parts[1].charAt(0)]
    : [parts[0].charAt(0)];
}
