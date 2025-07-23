export default function TruncateText(text: string, maxWords: number): string {
  const words = text.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return text;
}

export const getPoster = (images: string[] = []): string | null => {
  const { length } = images;

  if (length === 0) return null;

  if (length > 2) return images[2];

  return images[0];
};

export const formatDateOfBirth = (dob: string | Date): string => {
  const date = new Date(dob);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const currentYear = new Date().getFullYear();
  const birthYear = date.getFullYear();
  const age = currentYear - birthYear;

  return `${formattedDate} - Age ${age}`;
};
