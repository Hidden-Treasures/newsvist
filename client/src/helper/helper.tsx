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

export const formatDate = (dateString?: string | Date | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
