
/**
 * Defines colors for guest status tags
 */
export const guestStatusColors = {
  potential: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    darkBg: "dark:bg-blue-900/20",
    darkText: "dark:text-blue-300",
    darkBorder: "dark:border-blue-800/30",
  },
  contacted: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    darkBg: "dark:bg-amber-900/20",
    darkText: "dark:text-amber-300",
    darkBorder: "dark:border-amber-800/30",
  },
  confirmed: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    darkBg: "dark:bg-purple-900/20", 
    darkText: "dark:text-purple-300",
    darkBorder: "dark:border-purple-800/30",
  },
  appeared: {
    bg: "bg-green-50",
    text: "text-green-700", 
    border: "border-green-200",
    darkBg: "dark:bg-green-900/20",
    darkText: "dark:text-green-300",
    darkBorder: "dark:border-green-800/30",
  },
};

/**
 * Defines colors for episode status indicators
 */
export const episodeStatusColors = {
  scheduled: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    darkBg: "dark:bg-orange-900/30",
    darkText: "dark:text-orange-300",
  },
  recorded: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    darkBg: "dark:bg-blue-900/30",
    darkText: "dark:text-blue-300",
  },
  published: {
    bg: "bg-green-100",
    text: "text-green-700",
    darkBg: "dark:bg-green-900/30",
    darkText: "dark:text-green-300",
  },
};

/**
 * Returns combined Tailwind classes for a guest status
 */
export function getGuestStatusClasses(status: string): string {
  const statusKey = status.toLowerCase() as keyof typeof guestStatusColors;
  const colorSet = guestStatusColors[statusKey] || guestStatusColors.potential;
  
  return cn(
    colorSet.bg, 
    colorSet.text, 
    colorSet.border,
    colorSet.darkBg,
    colorSet.darkText,
    colorSet.darkBorder
  );
}

/**
 * Returns combined Tailwind classes for an episode status
 */
export function getEpisodeStatusClasses(status: string): string {
  const statusKey = status.toLowerCase() as keyof typeof episodeStatusColors;
  const colorSet = episodeStatusColors[statusKey] || episodeStatusColors.scheduled;
  
  return cn(
    colorSet.bg, 
    colorSet.text,
    colorSet.darkBg,
    colorSet.darkText
  );
}

// Helper to combine class names
function cn(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}
