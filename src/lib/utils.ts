import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  // Convert to lowercase
  text = text.toLowerCase();

  // Replace accented characters with their non-accented equivalents
  const replacements: { [key: string]: string } = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ä': 'a', 'æ': 'ae', 'ã': 'a', 'å': 'a',
    'ç': 'c', 'č': 'c',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ē': 'e', 'ė': 'e', 'ę': 'e',
    'ğ': 'g',
    'ḧ': 'h',
    'î': 'i', 'ï': 'i', 'í': 'i', 'ī': 'i', 'į': 'i', 'ì': 'i',
    'ł': 'l',
    'ḿ': 'm',
    'ñ': 'n', 'ń': 'n', 'ǹ': 'n', 'ň': 'n',
    'ô': 'o', 'ö': 'o', 'ò': 'o', 'ó': 'o', 'œ': 'oe', 'ø': 'o', 'ō': 'o', 'õ': 'o', 'ő': 'o',
    'ṕ': 'p',
    'ŕ': 'r', 'ř': 'r',
    'ß': 'ss', 'ś': 's', 'š': 's', 'ş': 's', 'ș': 's',
    'ť': 't', 'ț': 't',
    'û': 'u', 'ü': 'u', 'ù': 'u', 'ú': 'u', 'ū': 'u', 'ǘ': 'u', 'ů': 'u', 'ű': 'u', 'ų': 'u',
    'ẃ': 'w',
    'ẍ': 'x',
    'ÿ': 'y', 'ý': 'y',
    'ž': 'z', 'ź': 'z', 'ż': 'z'
  };

  for (const char in replacements) {
    text = text.replace(new RegExp(char, 'g'), replacements[char]);
  }

  // Remove non-alphanumeric characters (except spaces and hyphens)
  text = text.replace(/[^a-z0-9\s-]/g, '');

  // Replace spaces with hyphens
  text = text.replace(/\s+/g, '-');

  // Remove multiple consecutive hyphens
  text = text.replace(/-+/g, '-');

  // Trim leading/trailing hyphens
  text = text.replace(/^-+|-+$/g, '');

  return text;
}
