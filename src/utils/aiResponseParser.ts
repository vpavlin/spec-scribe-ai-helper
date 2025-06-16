
export const parseAIResponse = (response: string) => {
  // Extract thinking process from <think></think> blocks
  const thinkRegex = /<think>([\s\S]*?)<\/think>/gi;
  const thinkMatches = response.match(thinkRegex);
  
  let thinking = '';
  if (thinkMatches) {
    thinking = thinkMatches
      .map(match => match.replace(/<\/?think>/gi, '').trim())
      .join('\n\n---\n\n');
  }
  
  // Remove thinking blocks from the main response
  const cleanedResponse = response.replace(thinkRegex, '').trim();
  
  return { cleanedResponse, thinking };
};
