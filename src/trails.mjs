export const trails = [
  { id: 'lake-loop', name: 'Lake Loop', kilometers: 3.4, difficulty: 'easy' },
  { id: 'cedar-ridge', name: 'Cedar Ridge', kilometers: 6.2, difficulty: 'moderate' },
  { id: 'granite-pass', name: 'Granite Pass', kilometers: 9.8, difficulty: 'hard' },
];

export function run(args) {
  const [command = 'list', trailId] = args;
  if (command === 'list' && args.length <= 1) {
    return { status: 0, text: trails.map(({ id, name }) => `${id}  ${name}`).join('\n') };
  }
  if (command === 'show' && args.length === 2) {
    const trail = trails.find(({ id }) => id === trailId);
    if (trail) {
      return { status: 0, text: `${trail.name} — ${trail.kilometers} km (${trail.difficulty})` };
    }
    return { status: 1, text: `Unknown trail: ${trailId}` };
  }
  return { status: 2, text: 'Usage: npm run trails -- [list | show <trail-id>]' };
}
