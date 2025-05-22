/**
 * Map task types to appropriate emojis
 * @param {string} taskType - Type of task
 * @returns {string} Emoji icon for the task type
 */
export const getTaskIcon = (taskType) => {
  const iconMap = {
    'brush': '🪥',
    'bed': '🛏️',
    'clothes': '👕',
    'food': '🥣',
    'homework': '📚',
    'reading': '📖',
    'piano': '🎹',
    'default': '📝'
  };
  
  return iconMap[taskType] || iconMap.default;
};

/**
 * Calculate completion percentage
 * @param {number} completed - Number of completed tasks
 * @param {number} total - Total number of tasks
 * @returns {number} Percentage of completion
 */
export const calculateCompletionPercentage = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};
